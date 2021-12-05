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
  Course,
} from '../models';
import {LecturerRepository} from '../repositories';

export class LecturerCourseController {
  constructor(
    @repository(LecturerRepository) protected lecturerRepository: LecturerRepository,
  ) { }

  @get('/lecturers/{id}/courses', {
    responses: {
      '200': {
        description: 'Array of Lecturer has many Course',
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
    return this.lecturerRepository.courses(id).find(filter);
  }

  @post('/lecturers/{id}/courses', {
    responses: {
      '200': {
        description: 'Lecturer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Course)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Lecturer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {
            title: 'NewCourseInLecturer',
            exclude: ['id'],
            optional: ['lecturerId']
          }),
        },
      },
    }) course: Omit<Course, 'id'>,
  ): Promise<Course> {
    return this.lecturerRepository.courses(id).create(course);
  }

  @patch('/lecturers/{id}/courses', {
    responses: {
      '200': {
        description: 'Lecturer.Course PATCH success count',
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
    return this.lecturerRepository.courses(id).patch(course, where);
  }

  @del('/lecturers/{id}/courses', {
    responses: {
      '200': {
        description: 'Lecturer.Course DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Course)) where?: Where<Course>,
  ): Promise<Count> {
    return this.lecturerRepository.courses(id).delete(where);
  }
}
