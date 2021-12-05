import {Entity, model, property} from '@loopback/repository';

@model()
export class Authentication extends Entity {
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
  email: string;

  @property({
    type: 'number',
    required: true,
  })
  retryCount: number;

  @property({
    type: 'string',
    required: true,
  })
  state: string;

  @property({
    type: 'date',
    required: true,
  })
  lastLoggedIn: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'string',
  })
  data?: string;

  @property({
    type: 'string',
  })
  clientIP?: string;

  @property({
    type: 'string',
  })
  clientDevice?: string;

  @property({
    type: 'string',
    required: true,
  })
  provider: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<Authentication>) {
    super(data);
  }
}

export interface AuthenticationRelations {
  // describe navigational properties here
}

export type AuthenticationWithRelations = Authentication & AuthenticationRelations;
