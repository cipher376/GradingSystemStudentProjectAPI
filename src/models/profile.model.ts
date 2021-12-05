import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Profile extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  // Define well-known properties here
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
  username: string | undefined;


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
    jsonSchema: {
      maxLength: 10,
      minLength: 0,
    },
  })
  gender?: string;


  @property({
    type: 'date',
  })
  dateOfBirth?: string;


  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 200,
      minLength: 0,
    },
  })
  about?: string;

  @property({
    type: 'string',
  })
  userId?: string;
  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 50,
      minLength: 0,
    },
  })
  nickName?: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Profile>) {
    super(data);
  }
}

export interface ProfileRelations {
  // describe navigational properties here
}

export type ProfileWithRelations = Profile & ProfileRelations;
