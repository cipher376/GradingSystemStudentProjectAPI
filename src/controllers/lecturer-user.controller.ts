import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Lecturer,
  User,
} from '../models';
import {LecturerRepository} from '../repositories';

export class LecturerUserController {
  constructor(
    @repository(LecturerRepository) protected lecturerRepository: LecturerRepository,
  ) { }

  @get('/lecturers/{id}/user', {
    responses: {
      '200': {
        description: 'Lecturer has one User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User> {
    return this.lecturerRepository.user(id).get(filter);
  }

  @post('/lecturers/{id}/user', {
    responses: {
      '200': {
        description: 'Lecturer model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Lecturer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInLecturer',
            exclude: ['id'],
            optional: ['lecturerId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.lecturerRepository.user(id).create(user);
  }

  @patch('/lecturers/{id}/user', {
    responses: {
      '200': {
        description: 'Lecturer.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.lecturerRepository.user(id).patch(user, where);
  }

  @del('/lecturers/{id}/user', {
    responses: {
      '200': {
        description: 'Lecturer.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.lecturerRepository.user(id).delete(where);
  }
}
