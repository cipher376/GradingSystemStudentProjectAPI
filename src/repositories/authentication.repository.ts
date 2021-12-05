import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdentityDbDataSource} from '../datasources';
import {Authentication, AuthenticationRelations} from '../models';

export class AuthenticationRepository extends DefaultCrudRepository<
  Authentication,
  typeof Authentication.prototype.id,
  AuthenticationRelations
> {
  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource,
  ) {
    super(Authentication, dataSource);
  }
}
