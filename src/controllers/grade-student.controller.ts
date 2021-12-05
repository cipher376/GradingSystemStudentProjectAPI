import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Grade,
  Student,
} from '../models';
import {GradeRepository} from '../repositories';

export class GradeStudentController {
  constructor(
    @repository(GradeRepository)
    public gradeRepository: GradeRepository,
  ) { }

  @get('/grades/{id}/student', {
    responses: {
      '200': {
        description: 'Student belonging to Grade',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Student)},
          },
        },
      },
    },
  })
  async getStudent(
    @param.path.string('id') id: typeof Grade.prototype.id,
  ): Promise<Student> {
    return this.gradeRepository.student(id);
  }
}
