import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class SignUpData extends Model {
  // Define well-known properties here
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 50,
      minLength: 5,
    },
  })
  email: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 50,
      minLength: 1,
    },
  })
  userName?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 50,
      minLength: 1,
    },
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 50,
      minLength: 1,
    },
  })
  lastName: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 50,
      minLength: 0,
    },
  })
  otherName?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 50,
      minLength: 1,
    },
  })
  password: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 20,
      minLength: 7,
    },
  })
  phone?: string;

  app?: {
    name: string; // Application that the user issued the request from
    logoUrl: string;
    appSMTPEmail: string; // Email address of the application
    contactPageUrl: string;
  }
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SignUpData>) {
    super(data);
  }
}

export interface SignUpDataRelations {
  // describe navigational properties here
}

export type SignUpDataWithRelations = SignUpData & SignUpDataRelations;
