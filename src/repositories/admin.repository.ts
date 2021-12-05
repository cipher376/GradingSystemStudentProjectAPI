import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {Admin, AdminRelations, User} from '../models';
import {IdentityDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class AdminRepository extends DefaultCrudRepository<
  Admin,
  typeof Admin.prototype.id,
  AdminRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof Admin.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Admin, dataSource);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
