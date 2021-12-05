import {logInvocation} from '@loopback/logging';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Profile, User
} from '../models';
import {UserRepository} from '../repositories';

export class UserProfileController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/profile', {
    responses: {
      '200': {
        description: 'User has one Profile',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Profile),
          },
        },
      },
    },
  })
  @logInvocation()
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Profile>,
  ): Promise<Profile> {
    return this.userRepository.profile(id).get(filter);
  }

  @post('/users/{id}/profile', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Profile)}},
      },
    },
  })
  @logInvocation()
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profile, {
            title: 'NewProfileInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) profile: Omit<Profile, 'id'>,
  ): Promise<Profile> {
    return this.userRepository.profile(id).create(profile);
  }

  @patch('/users/{id}/profile', {
    responses: {
      '200': {
        description: 'User.Profile PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @logInvocation()
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profile, {partial: true}),
        },
      },
    })
    profile: Partial<Profile>,
    @param.query.object('where', getWhereSchemaFor(Profile)) where?: Where<Profile>,
  ): Promise<Count> {
    return this.userRepository.profile(id).patch(profile, where);
  }

  @del('/users/{id}/profile', {
    responses: {
      '200': {
        description: 'User.Profile DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @logInvocation()
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Profile)) where?: Where<Profile>,
  ): Promise<Count> {
    return this.userRepository.profile(id).delete(where);
  }
}
