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
  Student,
  AcademicRecord,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentAcademicRecordController {
  constructor(
    @repository(StudentRepository) protected studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/academic-records', {
    responses: {
      '200': {
        description: 'Array of Student has many AcademicRecord',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(AcademicRecord)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<AcademicRecord>,
  ): Promise<AcademicRecord[]> {
    return this.studentRepository.academicRecords(id).find(filter);
  }

  @post('/students/{id}/academic-records', {
    responses: {
      '200': {
        description: 'Student model instance',
        content: {'application/json': {schema: getModelSchemaRef(AcademicRecord)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AcademicRecord, {
            title: 'NewAcademicRecordInStudent',
            exclude: ['id'],
            optional: ['studentId']
          }),
        },
      },
    }) academicRecord: Omit<AcademicRecord, 'id'>,
  ): Promise<AcademicRecord> {
    return this.studentRepository.academicRecords(id).create(academicRecord);
  }

  @patch('/students/{id}/academic-records', {
    responses: {
      '200': {
        description: 'Student.AcademicRecord PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AcademicRecord, {partial: true}),
        },
      },
    })
    academicRecord: Partial<AcademicRecord>,
    @param.query.object('where', getWhereSchemaFor(AcademicRecord)) where?: Where<AcademicRecord>,
  ): Promise<Count> {
    return this.studentRepository.academicRecords(id).patch(academicRecord, where);
  }

  @del('/students/{id}/academic-records', {
    responses: {
      '200': {
        description: 'Student.AcademicRecord DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(AcademicRecord)) where?: Where<AcademicRecord>,
  ): Promise<Count> {
    return this.studentRepository.academicRecords(id).delete(where);
  }
}
