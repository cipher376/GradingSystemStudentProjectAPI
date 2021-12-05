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
  Lecturer,
} from '../models';
import {UserRepository} from '../repositories';

export class UserLecturerController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/lecturer', {
    responses: {
      '200': {
        description: 'Lecturer belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Lecturer)},
          },
        },
      },
    },
  })
  async getLecturer(
    @param.path.string('id') id: typeof User.prototype.id,
  ): Promise<Lecturer> {
    return this.userRepository.lecturer(id);
  }
}
