import {Entity, hasMany, model, property, belongsTo} from '@loopback/repository';
import {CourseProgrammeThrough} from './course-programme-through.model';
import {Grade} from './grade.model';
import {Programme} from './programme.model';
import {Lecturer} from './lecturer.model';

@model()
export class Course extends Entity {
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
    type: 'number',
    required: true
  })
  creditHours: number;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @hasMany(() => Grade)
  grades: Grade[];


  @hasMany(() => Programme, {through: {model: () => CourseProgrammeThrough}})
  programmes: Programme[];

  @belongsTo(() => Lecturer)
  lecturerId: string;

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
}

export type CourseWithRelations = Course & CourseRelations;
