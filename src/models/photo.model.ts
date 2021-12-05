import {Entity, model, property} from '@loopback/repository';

@model()
export class Photo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  mimeType?: string;

  @property({
    type: 'string',
    required: true,
  })
  source: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  thumbnail?: string;

  @property({
    type: 'string'
  })
  displayAs: string;

  @property({
    type: 'date',
  })
  dateCreated?: string;

  @property({
    type: 'number',
  })
  size?: number;



  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
    required: true
  })
  fileId?: string;

  constructor(data?: Partial<Photo>) {
    super(data);
  }
}

export interface PhotoRelations {
  // describe navigational properties here
}

export type PhotoWithRelations = Photo & PhotoRelations;
