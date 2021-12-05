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
  Hod,
  User,
} from '../models';
import {HodRepository} from '../repositories';

export class HodUserController {
  constructor(
    @repository(HodRepository) protected hodRepository: HodRepository,
  ) { }

  @get('/hods/{id}/user', {
    responses: {
      '200': {
        description: 'Hod has one User',
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
    return this.hodRepository.user(id).get(filter);
  }

  @post('/hods/{id}/user', {
    responses: {
      '200': {
        description: 'Hod model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Hod.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInHod',
            exclude: ['id'],
            optional: ['hodId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.hodRepository.user(id).create(user);
  }

  @patch('/hods/{id}/user', {
    responses: {
      '200': {
        description: 'Hod.User PATCH success count',
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
    return this.hodRepository.user(id).patch(user, where);
  }

  @del('/hods/{id}/user', {
    responses: {
      '200': {
        description: 'Hod.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.hodRepository.user(id).delete(where);
  }
}
