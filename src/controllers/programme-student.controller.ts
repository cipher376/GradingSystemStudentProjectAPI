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
  Student,
} from '../models';
import {ProgrammeRepository} from '../repositories';

export class ProgrammeStudentController {
  constructor(
    @repository(ProgrammeRepository) protected programmeRepository: ProgrammeRepository,
  ) { }

  @get('/programmes/{id}/students', {
    responses: {
      '200': {
        description: 'Array of Programme has many Student',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Student)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Student>,
  ): Promise<Student[]> {
    return this.programmeRepository.students(id).find(filter);
  }

  @post('/programmes/{id}/students', {
    responses: {
      '200': {
        description: 'Programme model instance',
        content: {'application/json': {schema: getModelSchemaRef(Student)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Programme.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudentInProgramme',
            exclude: ['id'],
            optional: ['programmeId']
          }),
        },
      },
    }) student: Omit<Student, 'id'>,
  ): Promise<Student> {
    return this.programmeRepository.students(id).create(student);
  }

  @patch('/programmes/{id}/students', {
    responses: {
      '200': {
        description: 'Programme.Student PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Partial<Student>,
    @param.query.object('where', getWhereSchemaFor(Student)) where?: Where<Student>,
  ): Promise<Count> {
    return this.programmeRepository.students(id).patch(student, where);
  }

  @del('/programmes/{id}/students', {
    responses: {
      '200': {
        description: 'Programme.Student DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Student)) where?: Where<Student>,
  ): Promise<Count> {
    return this.programmeRepository.students(id).delete(where);
  }
}
