import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdentityDbDataSource} from '../datasources';
import {ResetRequest, ResetRequestRelations} from '../models';

export class ResetRequestRepository extends DefaultCrudRepository<
  ResetRequest,
  typeof ResetRequest.prototype.id,
  ResetRequestRelations
> {
  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource,
  ) {
    super(ResetRequest, dataSource);
  }
}
