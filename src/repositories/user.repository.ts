import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository, BelongsToAccessor} from '@loopback/repository';
import {IdentityDbDataSource} from '../datasources';
import {
  Address, Authentication, Password,

  Photo, Profile,
  ResetRequest, User, UserRelations, Lecturer, Admin} from '../models';
import {AddressRepository} from './address.repository';
import {AuthenticationRepository} from './authentication.repository';
import {PasswordRepository} from './password.repository';
import {PhotoRepository} from './photo.repository';
import {ProfileRepository} from './profile.repository';
import {ResetRequestRepository} from './reset-request.repository';
import {LecturerRepository} from './lecturer.repository';
import {AdminRepository} from './admin.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly password: HasOneRepositoryFactory<Password, typeof User.prototype.id>;

  public readonly profile: HasOneRepositoryFactory<Profile, typeof User.prototype.id>;

  public readonly address: HasOneRepositoryFactory<Address, typeof User.prototype.id>;

  public readonly profilePhoto: HasOneRepositoryFactory<Photo, typeof User.prototype.id>;

  public readonly resetRequests: HasManyRepositoryFactory<ResetRequest, typeof User.prototype.id>;

  public readonly authentications: HasManyRepositoryFactory<Authentication, typeof User.prototype.id>;

  public readonly lecturer: BelongsToAccessor<Lecturer, typeof User.prototype.id>;

  public readonly admin: BelongsToAccessor<Admin, typeof User.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource,
    @repository.getter('PasswordRepository') protected passwordRepositoryGetter: Getter<PasswordRepository>,
    @repository.getter('ProfileRepository') protected profileRepositoryGetter: Getter<ProfileRepository>,
    @repository.getter('AddressRepository') protected addressRepositoryGetter: Getter<AddressRepository>,
    @repository.getter('PhotoRepository') protected photoRepositoryGetter: Getter<PhotoRepository>,
    @repository.getter('ResetRequestRepository') protected resetRequestRepositoryGetter: Getter<ResetRequestRepository>,
    @repository.getter('AuthenticationRepository') protected authenticationRepositoryGetter: Getter<AuthenticationRepository>, @repository.getter('LecturerRepository') protected lecturerRepositoryGetter: Getter<LecturerRepository>, @repository.getter('AdminRepository') protected adminRepositoryGetter: Getter<AdminRepository>,
  ) {
    super(User, dataSource);
    this.admin = this.createBelongsToAccessorFor('admin', adminRepositoryGetter,);
    this.registerInclusionResolver('admin', this.admin.inclusionResolver);
    this.lecturer = this.createBelongsToAccessorFor('lecturer', lecturerRepositoryGetter,);
    this.registerInclusionResolver('lecturer', this.lecturer.inclusionResolver);
    this.authentications = this.createHasManyRepositoryFactoryFor('authentications', authenticationRepositoryGetter,);
    this.registerInclusionResolver('authentications', this.authentications.inclusionResolver);
    this.resetRequests = this.createHasManyRepositoryFactoryFor('resetRequests', resetRequestRepositoryGetter,);
    this.registerInclusionResolver('resetRequests', this.resetRequests.inclusionResolver);
    this.profilePhoto = this.createHasOneRepositoryFactoryFor('profilePhoto', photoRepositoryGetter);
    this.registerInclusionResolver('profilePhoto', this.profilePhoto.inclusionResolver);
    this.address = this.createHasOneRepositoryFactoryFor('address', addressRepositoryGetter);
    this.registerInclusionResolver('address', this.address.inclusionResolver);
    this.profile = this.createHasOneRepositoryFactoryFor('profile', profileRepositoryGetter);
    this.registerInclusionResolver('profile', this.profile.inclusionResolver);
    this.password = this.createHasOneRepositoryFactoryFor('password', passwordRepositoryGetter);
  }
}
