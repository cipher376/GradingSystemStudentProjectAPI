import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Course,
  Lecturer,
} from '../models';
import {CourseRepository} from '../repositories';

export class CourseLecturerController {
  constructor(
    @repository(CourseRepository)
    public courseRepository: CourseRepository,
  ) { }

  @get('/courses/{id}/lecturer', {
    responses: {
      '200': {
        description: 'Lecturer belonging to Course',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Lecturer)},
          },
        },
      },
    },
  })
  async getLecturer(
    @param.path.string('id') id: typeof Course.prototype.id,
  ): Promise<Lecturer> {
    return this.courseRepository.lecturer(id);
  }
}
