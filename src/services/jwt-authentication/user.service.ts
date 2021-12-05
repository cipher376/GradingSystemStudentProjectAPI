import {UserService} from '@loopback/authentication';
import {inject, injectable} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {Profile as PassportProfile} from 'passport';
import {PasswordHasherBindings} from '../../keys';
import {Profile, User} from '../../models';
import {PasswordRepository, ProfileRepository} from '../../repositories';
import {UserIdentityRepository} from '../../repositories/user-identity.repository';
import {UserRepository} from '../../repositories/user.repository';
import {BcryptHasher} from '../hash.password';


export type Credentials = {
    email?: string;
    phone?: string;
    password: string | undefined;
}


@injectable()
export class MyUserService implements UserService<User, Credentials>{


    constructor(
        @repository(UserRepository)
        private userRepository: UserRepository,

        @repository(PasswordRepository)
        private passwordRepository: PasswordRepository,

        @repository(ProfileRepository)
        private profileRepository: ProfileRepository,

        // @inject('service.hasher')
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        private hasher: BcryptHasher,

        @repository(UserIdentityRepository)
        private userIdentityRepository: UserIdentityRepository
    ) { }


    /**
  * find a linked local user for an external profile
  * create a local user if not created yet.
  * @param email
  * @param profile
  * @param token
  */
    async findOrCreateUser(profile: PassportProfile): Promise<User> {
        if (!profile.emails || !profile.emails.length) {
            throw new Error('email-id is required in returned profile to login');
        }

        const email = profile.emails[0].value;

        const users: User[] = await this.userRepository.find({
            where: {
                email: email,
            },
            include: [
                {
                    relation: 'profile'
                }]
        });
        let user: User;
        if (!users || !users.length) {
            const name = profile.name?.givenName
                ? profile.name.givenName + ' ' + profile.name.familyName
                : profile.displayName;
            user = await this.userRepository.create({
                email: email,
                // name: name || JSON.stringify(profile.name),
                // username: email,
            });
            if (user) {
                const temProf = new Profile();
                temProf.userId = user.id;
                temProf.firstName = profile.name?.givenName ?? profile.name?.familyName ?? profile.displayName;
                temProf.lastName = profile.name?.familyName ?? profile.displayName;
                temProf.username = profile.displayName;
                temProf.nickName = profile.displayName;
                await this.profileRepository.create(temProf);
            }
        } else {
            user = users[0];
        }
        user = await this.linkExternalProfile('' + user.id, profile);
        return user;
    }


    /**
      * link external profile with local user
      * @param userId
      * @param userIdentity
      */
    async linkExternalProfile(
        userId: string,
        userIdentity: PassportProfile,
    ): Promise<User> {
        let profile;
        try {
            profile = await this.userIdentityRepository.findById(userIdentity.id);
        } catch (err) {
            // no need to throw an error if entity is not found
            if (!(err.code === 'ENTITY_NOT_FOUND')) {
                throw err;
            }
        }

        if (!profile) {
            await this.createUser(userId, userIdentity);
        } else {
            await this.userIdentityRepository.updateById(userIdentity.id, {
                profile: {
                    emails: userIdentity.emails,
                },
                created: new Date(),
            });
        }
        if (!userId) console.log('user id is empty');
        return this.userRepository.findById(userId, {
            include: [
                {
                    relation: 'profile',
                },
            ],
        });
    }



    /**
      * create a copy of the external profile
      * @param userId
      * @param userIdentity
      */
    async createUser(
        userId: string,
        userIdentity: PassportProfile,
    ): Promise<void> {
        await this.userIdentityRepository.create({
            id: userIdentity.id,
            provider: userIdentity.provider,
            authScheme: userIdentity.provider,
            userId: userId,
            profile: {
                emails: userIdentity.emails,
            },
            created: new Date(),
        });
    }

    async verifyCredentials(credentials: Credentials): Promise<User> {
        if (!credentials.email && !credentials.phone) {
            throw new HttpErrors.Forbidden('User not allowed');
        }
        // implement this method
        let foundUser = await this.userRepository.findOne({
            where: {
                email: credentials.email
            }
        });
        if (!credentials.email) {
            // search with phone number
            foundUser = await this.userRepository.findOne({
                where: {
                    phone: credentials.phone
                }
            })
        }
        if (!foundUser) {
            throw new HttpErrors.NotFound('user not found');
        }
        // get user password hash
        const password = await this.passwordRepository.findOne({where: {userId: foundUser.id}});
        const passwordMatched = await this.hasher.comparePassword(credentials.password as string, password?.hash as any)
        if (!passwordMatched)
            throw new HttpErrors.Unauthorized('Check username or password');
        return foundUser;
    }
    convertToUserProfile(user: User): UserProfile {
        return {
            [securityId]: user.id!.toString(),
            id: user.id,
            email: user.email,
            phone: user.phone
        };
    }

    convertToUserView(user: User): User {
        // remove sensitive data
        user.realm = undefined;
        user.remember = undefined;
        // user.emailVerified = undefined;
        user.emailVerificationToken = undefined;
        user.phoneVerificationToken = undefined;
        // user.phoneVerified = undefined;
        return user
    }


    convertToUsersView(users: User[]) {
        users.forEach(user => {
            // remove sensitive fields;
            user = this.convertToUserView(user);
        });

        return users;
    }

    async userExist(credentials: Credentials): Promise<boolean> {
        if (!credentials.email && !credentials.phone) {
            throw new HttpErrors.BadRequest('Invalid Username or Phone Number')
        }
        let foundUser = await this.userRepository.findOne({
            where: {
                email: credentials.email
            }
        })

        if (!foundUser && credentials.phone) {
            foundUser = await this.userRepository.findOne({
                where: {
                    phone: credentials.phone
                }
            })
        }

        console.log(foundUser);
        if (!foundUser?.id) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    async emailExist(email: string): Promise<boolean> {
        const foundUser = await this.userRepository.findOne({
            where: {email}
        })
        if (!foundUser) return Promise.resolve(false);
        return Promise.resolve(true);
    }

    async phoneExist(phone: string, currentUserId: any): Promise<boolean> {
        const foundUser = await this.userRepository.findOne({
            where: {phone}
        })
        if (!foundUser) return Promise.resolve(false);
        if (foundUser.id == currentUserId) return Promise.resolve(false);
        return Promise.resolve(true);
    }

    async updateUser(id: typeof User.prototype.id, user: User, currentUserId: string): Promise<User> {
        const foundUser = await this.userRepository.findOne({
            where: {id}
        });

        if (!foundUser) {
            throw new HttpErrors.NotFound('user not found.');
        }
        // check if phone number is in used
        if (await this.phoneExist(user?.phone as any, user.id) && !(user.id && currentUserId)) {
            throw new HttpErrors.NotFound('Phone number is already taken.');
        }

        // foundUser.dateOfBirth = user.dateOfBirth ?? foundUser.dateOfBirth;
        // foundUser.firstName = user.firstName ?? foundUser.firstName;
        // foundUser.lastName = user.lastName ?? foundUser.lastName;
        // foundUser.nickName = user.nickName ?? foundUser.nickName;
        // foundUser.otherName = user.otherName ?? foundUser.otherName;
        // foundUser.username = user.username ?? foundUser.username
        // foundUser.username = user.username ?? foundUser.username
        // foundUser.phone = user.phone ?? foundUser.phone
        // foundUser.gender = user.gender ?? foundUser.gender

        await this.userRepository.update(foundUser);
        return this.convertToUserView(foundUser);
    }

    async getUsers(filter?: Filter<User>): Promise<User[]> {
        const foundUsers = await this.userRepository.find(filter) ?? [];
        // strip sensitive data
        return Promise.resolve(this.convertToUsersView(foundUsers));
    }

}
