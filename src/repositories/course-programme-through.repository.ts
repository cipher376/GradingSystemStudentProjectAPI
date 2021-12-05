import {DefaultCrudRepository} from '@loopback/repository';
import {CourseProgrammeThrough, CourseProgrammeThroughRelations} from '../models';
import {IdentityDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CourseProgrammeThroughRepository extends DefaultCrudRepository<
  CourseProgrammeThrough,
  typeof CourseProgrammeThrough.prototype.id,
  CourseProgrammeThroughRelations
> {
  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource,
  ) {
    super(CourseProgrammeThrough, dataSource);
  }
}
