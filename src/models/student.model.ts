import {belongsTo, Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {AcademicRecord} from './academic-record.model';
import {Grade} from './grade.model';
import {Programme} from './programme.model';
import {User} from './user.model';

@model()
export class Student extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isComplete: boolean;


  @hasOne(() => User)
  user: User;

  @hasMany(() => AcademicRecord)
  academicRecords: AcademicRecord[];

  @belongsTo(() => Programme)
  programmeId: string;

  @hasMany(() => Grade)
  grades: Grade[];

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
