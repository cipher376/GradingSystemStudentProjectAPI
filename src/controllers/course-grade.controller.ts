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
  Course,
  Grade,
} from '../models';
import {CourseRepository} from '../repositories';

export class CourseGradeController {
  constructor(
    @repository(CourseRepository) protected courseRepository: CourseRepository,
  ) { }

  @get('/courses/{id}/grades', {
    responses: {
      '200': {
        description: 'Array of Course has many Grade',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Grade)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Grade>,
  ): Promise<Grade[]> {
    return this.courseRepository.grades(id).find(filter);
  }

  @post('/courses/{id}/grades', {
    responses: {
      '200': {
        description: 'Course model instance',
        content: {'application/json': {schema: getModelSchemaRef(Grade)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Course.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grade, {
            title: 'NewGradeInCourse',
            exclude: ['id'],
            optional: ['courseId']
          }),
        },
      },
    }) grade: Omit<Grade, 'id'>,
  ): Promise<Grade> {
    return this.courseRepository.grades(id).create(grade);
  }

  @patch('/courses/{id}/grades', {
    responses: {
      '200': {
        description: 'Course.Grade PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grade, {partial: true}),
        },
      },
    })
    grade: Partial<Grade>,
    @param.query.object('where', getWhereSchemaFor(Grade)) where?: Where<Grade>,
  ): Promise<Count> {
    return this.courseRepository.grades(id).patch(grade, where);
  }

  @del('/courses/{id}/grades', {
    responses: {
      '200': {
        description: 'Course.Grade DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Grade)) where?: Where<Grade>,
  ): Promise<Count> {
    return this.courseRepository.grades(id).delete(where);
  }
}
