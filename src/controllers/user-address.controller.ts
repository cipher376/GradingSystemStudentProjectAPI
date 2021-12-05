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
  Address, User
} from '../models';
import {UserRepository} from '../repositories';

export class UserAddressController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/address', {
    responses: {
      '200': {
        description: 'User has one Address',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Address),
          },
        },
      },
    },
  })
  @logInvocation()
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Address>,
  ): Promise<Address> {
    return this.userRepository.address(id).get(filter);
  }

  @post('/users/{id}/address', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Address)}},
      },
    },
  })
  @logInvocation()
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {
            title: 'NewAddressInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) address: Omit<Address, 'id'>,
  ): Promise<Address> {
    return this.userRepository.address(id).create(address);
  }

  @patch('/users/{id}/address', {
    responses: {
      '200': {
        description: 'User.Address PATCH success count',
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
          schema: getModelSchemaRef(Address, {partial: true}),
        },
      },
    })
    address: Partial<Address>,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.userRepository.address(id).patch(address, where);
  }



  @del('/users/{id}/address', {
    responses: {
      '200': {
        description: 'User.Address DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @logInvocation()
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Address)) where?: Where<Address>,
  ): Promise<Count> {
    return this.userRepository.address(id).delete(where);
  }
}
