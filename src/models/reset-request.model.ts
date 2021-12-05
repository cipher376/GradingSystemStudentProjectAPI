import {Entity, model, property} from '@loopback/repository';
import {OPERATION_STATE, RESET_REQUEST_TYPE} from './../keys';

@model()
export class ResetRequest extends Entity {
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
  resetToken: string;

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
  state: OPERATION_STATE;

  @property({
    type: 'number',
    required: true,
  })
  expiredTimeInMin: number;

  @property({
    type: 'string',
    required: true,
  })
  requestType: RESET_REQUEST_TYPE;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<ResetRequest>) {
    super(data);
  }
}

export interface ResetRequestRelations {
  // describe navigational properties here
}

export type ResetRequestWithRelations = ResetRequest & ResetRequestRelations;
