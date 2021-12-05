import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Student} from './student.model';
import {Course} from './course.model';

@model()
export class Grade extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  value: number;

  @belongsTo(() => Student)
  studentId: string;

  @belongsTo(() => Course)
  courseId: string;

  constructor(data?: Partial<Grade>) {
    super(data);
  }
}

export interface GradeRelations {
  // describe navigational properties here
}

export type GradeWithRelations = Grade & GradeRelations;
