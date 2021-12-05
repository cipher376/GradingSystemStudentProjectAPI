import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  User,
  Admin,
} from '../models';
import {UserRepository} from '../repositories';

export class UserAdminController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/admin', {
    responses: {
      '200': {
        description: 'Admin belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Admin)},
          },
        },
      },
    },
  })
  async getAdmin(
    @param.path.string('id') id: typeof User.prototype.id,
  ): Promise<Admin> {
    return this.userRepository.admin(id);
  }
}
