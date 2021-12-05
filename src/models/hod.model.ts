import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Programme} from './programme.model';
import {User} from './user.model';

@model()
export class Hod extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Programme)
  programmeId: string;

  @hasOne(() => User)
  user: User;

  constructor(data?: Partial<Hod>) {
    super(data);
  }
}

export interface HodRelations {
  // describe navigational properties here
}

export type HodWithRelations = Hod & HodRelations;
