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
  Course,
  Programme
} from '../models';
import {CourseRepository} from '../repositories';

export class CourseProgrammeController {
  constructor(
    @repository(CourseRepository) protected courseRepository: CourseRepository,
  ) { }

  @get('/courses/{id}/programmes', {
    responses: {
      '200': {
        description: 'Array of Course has many Programme through CourseProgrammeThrough',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Programme)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Programme>,
  ): Promise<Programme[]> {
    return this.courseRepository.programmes(id).find(filter);
  }

  @post('/courses/{id}/programmes', {
    responses: {
      '200': {
        description: 'create a Programme model instance',
        content: {'application/json': {schema: getModelSchemaRef(Programme)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Course.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Programme, {
            title: 'NewProgrammeInCourse',
            exclude: ['id'],
          }),
        },
      },
    }) programme: Omit<Programme, 'id'>,
  ): Promise<Programme> {
    return this.courseRepository.programmes(id).create(programme);
  }

  @patch('/courses/{id}/programmes', {
    responses: {
      '200': {
        description: 'Course.Programme PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Programme, {partial: true}),
        },
      },
    })
    programme: Partial<Programme>,
    @param.query.object('where', getWhereSchemaFor(Programme)) where?: Where<Programme>,
  ): Promise<Count> {
    return this.courseRepository.programmes(id).patch(programme, where);
  }

  @del('/courses/{id}/programmes', {
    responses: {
      '200': {
        description: 'Course.Programme DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Programme)) where?: Where<Programme>,
  ): Promise<Count> {
    return this.courseRepository.programmes(id).delete(where);
  }
}
