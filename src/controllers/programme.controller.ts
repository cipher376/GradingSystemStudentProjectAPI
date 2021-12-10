import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Programme} from '../models';
import {ProgrammeRepository} from '../repositories';

export class ProgrammeController {
  constructor(
    @repository(ProgrammeRepository)
    public programmeRepository : ProgrammeRepository,
  ) {}

  @post('/programmes', {
    responses: {
      '200': {
        description: 'Programme model instance',
        content: {'application/json': {schema: getModelSchemaRef(Programme)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Programme, {
            title: 'NewProgramme',
            exclude: ['id'],
          }),
        },
      },
    })
    programme: Omit<Programme, 'id'>,
  ): Promise<Programme> {
    return this.programmeRepository.create(programme);
  }

  @get('/programmes/count', {
    responses: {
      '200': {
        description: 'Programme model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Programme) where?: Where<Programme>,
  ): Promise<Count> {
    return this.programmeRepository.count(where);
  }

  @get('/programmes', {
    responses: {
      '200': {
        description: 'Array of Programme model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Programme, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Programme) filter?: Filter<Programme>,
  ): Promise<Programme[]> {
    return this.programmeRepository.find(filter);
  }

  @patch('/programmes', {
    responses: {
      '200': {
        description: 'Programme PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Programme, {partial: true}),
        },
      },
    })
    programme: Programme,
    @param.where(Programme) where?: Where<Programme>,
  ): Promise<Count> {
    return this.programmeRepository.updateAll(programme, where);
  }

  @get('/programmes/{id}', {
    responses: {
      '200': {
        description: 'Programme model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Programme, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Programme, {exclude: 'where'}) filter?: FilterExcludingWhere<Programme>
  ): Promise<Programme> {
    return this.programmeRepository.findById(id, filter);
  }

  @patch('/programmes/{id}', {
    responses: {
      '204': {
        description: 'Programme PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Programme, {partial: true}),
        },
      },
    })
    programme: Programme,
  ): Promise<void> {
    await this.programmeRepository.updateById(id, programme);
  }

  @put('/programmes/{id}', {
    responses: {
      '204': {
        description: 'Programme PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() programme: Programme,
  ): Promise<void> {
    await this.programmeRepository.replaceById(id, programme);
  }

  @del('/programmes/{id}', {
    responses: {
      '204': {
        description: 'Programme DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.programmeRepository.deleteById(id);
  }
}
