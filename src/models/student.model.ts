import {Entity, model, property, hasOne, hasMany, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {AcademicRecord} from './academic-record.model';
import {Programme} from './programme.model';
import {Grade} from './grade.model';

@model()
export class Student extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @hasOne(() => User)
  user: User;

  @hasMany(() => AcademicRecord)
  academicRecords: AcademicRecord[];

  @belongsTo(() => Programme)
  programmeId: string;

  @hasMany(() => Grade)
  grades: Grade[];

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
