import {Entity, model, property} from '@loopback/repository';

@model()
export class Password extends Entity {

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
  hash: string;

  @property({
    type: 'date',
    required: true,
  })
  dateCreated: string;

  @property({
    type: 'date',
    required: true,
  })
  dateModified: string;

  @property({
    type: 'string',
    required: true,
  })
  modifiedBy: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<Password>) {
    super(data);
  }
}

export interface PasswordRelations {
  // describe navigational properties here
}

export type PasswordWithRelations = Password & PasswordRelations;
