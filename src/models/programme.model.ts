import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {CourseProgrammeThrough} from './course-programme-through.model';
import {Course} from './course.model';
import {Hod} from './hod.model';
import {Student} from './student.model';

@model()
export class Programme extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  faculty: string;

  @property({
    type: 'number',
    required: true,
  })
  numberYears: number;

  @hasMany(() => Student)
  students: Student[];

  @hasMany(() => Course, {through: {model: () => CourseProgrammeThrough}})
  courses: Course[];

  @hasOne(() => Hod)
  hod: Hod;

  constructor(data?: Partial<Programme>) {
    super(data);
  }
}

export interface ProgrammeRelations {
  // describe navigational properties here
}

export type ProgrammeWithRelations = Programme & ProgrammeRelations;
