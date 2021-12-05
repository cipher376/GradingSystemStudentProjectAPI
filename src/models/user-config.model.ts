import {Entity, model, property} from '@loopback/repository';

@model()
export class UserConfig extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true
  })
  action: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<UserConfig>) {
    super(data);
  }
}

export interface UserConfigRelations {
  // describe navigational properties here
}

export type UserConfigWithRelations = UserConfig & UserConfigRelations;
