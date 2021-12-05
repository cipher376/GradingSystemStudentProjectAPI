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
  Course, Programme
} from '../models';
import {ProgrammeRepository} from '../repositories';

export class ProgrammeCourseController {
  constructor(
    @repository(ProgrammeRepository) protected programmeRepository: ProgrammeRepository,
  ) { }

  @get('/programmes/{id}/courses', {
    responses: {
      '200': {
        description: 'Array of Programme has many Course through CourseProgrammeThrough',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Course)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Course>,
  ): Promise<Course[]> {
    return this.programmeRepository.courses(id).find(filter);
  }

  @post('/programmes/{id}/courses', {
    responses: {
      '200': {
        description: 'create a Course model instance',
        content: {'application/json': {schema: getModelSchemaRef(Course)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Programme.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {
            title: 'NewCourseInProgramme',
            exclude: ['id'],
          }),
        },
      },
    }) course: Omit<Course, 'id'>,
  ): Promise<Course> {
    return this.programmeRepository.courses(id).create(course);
  }

  @patch('/programmes/{id}/courses', {
    responses: {
      '200': {
        description: 'Programme.Course PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {partial: true}),
        },
      },
    })
    course: Partial<Course>,
    @param.query.object('where', getWhereSchemaFor(Course)) where?: Where<Course>,
  ): Promise<Count> {
    return this.programmeRepository.courses(id).patch(course, where);
  }

  @del('/programmes/{id}/courses', {
    responses: {
      '200': {
        description: 'Programme.Course DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Course)) where?: Where<Course>,
  ): Promise<Count> {
    return this.programmeRepository.courses(id).delete(where);
  }
}
