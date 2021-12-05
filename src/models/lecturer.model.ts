import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Course} from './course.model';
import {User} from './user.model';

@model()
export class Lecturer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @hasMany(() => Course)
  courses: Course[];

  @hasOne(() => User)
  user: User;

  constructor(data?: Partial<Lecturer>) {
    super(data);
  }
}

export interface LecturerRelations {
  // describe navigational properties here
}

export type LecturerWithRelations = Lecturer & LecturerRelations;
