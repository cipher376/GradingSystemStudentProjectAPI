import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Student,
  Programme,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentProgrammeController {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/programme', {
    responses: {
      '200': {
        description: 'Programme belonging to Student',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Programme)},
          },
        },
      },
    },
  })
  async getProgramme(
    @param.path.string('id') id: typeof Student.prototype.id,
  ): Promise<Programme> {
    return this.studentRepository.programme(id);
  }
}
