import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {IdentityDbDataSource} from '../datasources';
import {
  Address, Admin, Authentication, Lecturer, Password,

  Photo, Profile,
  ResetRequest, Role, Student, User, UserRelations
} from '../models';
import {AddressRepository} from './address.repository';
import {AdminRepository} from './admin.repository';
import {AuthenticationRepository} from './authentication.repository';
import {LecturerRepository} from './lecturer.repository';
import {PasswordRepository} from './password.repository';
import {PhotoRepository} from './photo.repository';
import {ProfileRepository} from './profile.repository';
import {ResetRequestRepository} from './reset-request.repository';
import {RoleRepository} from './role.repository';
import {StudentRepository} from './student.repository';

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

  public readonly role: HasOneRepositoryFactory<Role, typeof User.prototype.id>;

  public readonly student: HasOneRepositoryFactory<Student, typeof User.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource,
    @repository.getter('PasswordRepository') protected passwordRepositoryGetter: Getter<PasswordRepository>,
    @repository.getter('ProfileRepository') protected profileRepositoryGetter: Getter<ProfileRepository>,
    @repository.getter('AddressRepository') protected addressRepositoryGetter: Getter<AddressRepository>,
    @repository.getter('PhotoRepository') protected photoRepositoryGetter: Getter<PhotoRepository>,
    @repository.getter('ResetRequestRepository') protected resetRequestRepositoryGetter: Getter<ResetRequestRepository>,
    @repository.getter('AuthenticationRepository') protected authenticationRepositoryGetter: Getter<AuthenticationRepository>,
    @repository.getter('LecturerRepository') protected lecturerRepositoryGetter: Getter<LecturerRepository>,
    @repository.getter('AdminRepository') protected adminRepositoryGetter: Getter<AdminRepository>,
    @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('StudentRepository') protected studentRepositoryGetter: Getter<StudentRepository>,
  ) {
    super(User, dataSource);
    this.student = this.createHasOneRepositoryFactoryFor('student', studentRepositoryGetter);
    this.registerInclusionResolver('student', this.student.inclusionResolver);
    this.role = this.createHasOneRepositoryFactoryFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
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
