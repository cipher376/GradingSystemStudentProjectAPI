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
  Programme,
  Hod,
} from '../models';
import {ProgrammeRepository} from '../repositories';

export class ProgrammeHodController {
  constructor(
    @repository(ProgrammeRepository) protected programmeRepository: ProgrammeRepository,
  ) { }

  @get('/programmes/{id}/hod', {
    responses: {
      '200': {
        description: 'Programme has one Hod',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Hod),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Hod>,
  ): Promise<Hod> {
    return this.programmeRepository.hod(id).get(filter);
  }

  @post('/programmes/{id}/hod', {
    responses: {
      '200': {
        description: 'Programme model instance',
        content: {'application/json': {schema: getModelSchemaRef(Hod)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Programme.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Hod, {
            title: 'NewHodInProgramme',
            exclude: ['id'],
            optional: ['programmeId']
          }),
        },
      },
    }) hod: Omit<Hod, 'id'>,
  ): Promise<Hod> {
    return this.programmeRepository.hod(id).create(hod);
  }

  @patch('/programmes/{id}/hod', {
    responses: {
      '200': {
        description: 'Programme.Hod PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Hod, {partial: true}),
        },
      },
    })
    hod: Partial<Hod>,
    @param.query.object('where', getWhereSchemaFor(Hod)) where?: Where<Hod>,
  ): Promise<Count> {
    return this.programmeRepository.hod(id).patch(hod, where);
  }

  @del('/programmes/{id}/hod', {
    responses: {
      '200': {
        description: 'Programme.Hod DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Hod)) where?: Where<Hod>,
  ): Promise<Count> {
    return this.programmeRepository.hod(id).delete(where);
  }
}
