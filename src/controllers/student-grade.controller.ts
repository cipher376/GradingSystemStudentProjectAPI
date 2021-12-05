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
  Grade,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentGradeController {
  constructor(
    @repository(StudentRepository) protected studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/grades', {
    responses: {
      '200': {
        description: 'Array of Student has many Grade',
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
    return this.studentRepository.grades(id).find(filter);
  }

  @post('/students/{id}/grades', {
    responses: {
      '200': {
        description: 'Student model instance',
        content: {'application/json': {schema: getModelSchemaRef(Grade)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grade, {
            title: 'NewGradeInStudent',
            exclude: ['id'],
            optional: ['studentId']
          }),
        },
      },
    }) grade: Omit<Grade, 'id'>,
  ): Promise<Grade> {
    return this.studentRepository.grades(id).create(grade);
  }

  @patch('/students/{id}/grades', {
    responses: {
      '200': {
        description: 'Student.Grade PATCH success count',
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
    return this.studentRepository.grades(id).patch(grade, where);
  }

  @del('/students/{id}/grades', {
    responses: {
      '200': {
        description: 'Student.Grade DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Grade)) where?: Where<Grade>,
  ): Promise<Count> {
    return this.studentRepository.grades(id).delete(where);
  }
}
