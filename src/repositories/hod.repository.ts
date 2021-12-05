import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {Hod, HodRelations, Programme, User} from '../models';
import {IdentityDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProgrammeRepository} from './programme.repository';
import {UserRepository} from './user.repository';

export class HodRepository extends DefaultCrudRepository<
  Hod,
  typeof Hod.prototype.id,
  HodRelations
> {

  public readonly programme: BelongsToAccessor<Programme, typeof Hod.prototype.id>;

  public readonly user: HasOneRepositoryFactory<User, typeof Hod.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource, @repository.getter('ProgrammeRepository') protected programmeRepositoryGetter: Getter<ProgrammeRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Hod, dataSource);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.programme = this.createBelongsToAccessorFor('programme', programmeRepositoryGetter,);
    this.registerInclusionResolver('programme', this.programme.inclusionResolver);
  }
}
