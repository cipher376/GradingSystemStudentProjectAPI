import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Student} from './student.model';

@model()
export class AcademicRecord extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  certificateUrl?: string;

  @property({
    type: 'string',
  })
  transcriptUrl?: string;

  @property({
    type: 'string',
    required: true,
  })
  schoolName: string;

  @property({
    type: 'string',
    required: true,
  })
  programme: string;

  @property({
    type: 'date',
  })
  yearOfCompletion?: string;

  @property({
    type: 'date',
    required: true,
  })
  yearOfCommencement: string;

  @property({
    type: 'number',
    required: true,
  })
  cgpa: number;

  @belongsTo(() => Student)
  studentId: string;

  constructor(data?: Partial<AcademicRecord>) {
    super(data);
  }
}

export interface AcademicRecordRelations {
  // describe navigational properties here
}

export type AcademicRecordWithRelations = AcademicRecord & AcademicRecordRelations;
