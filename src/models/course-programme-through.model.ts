import {Entity, model, property} from '@loopback/repository';

@model()
export class CourseProgrammeThrough extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  programmeId?: string;

  @property({
    type: 'string',
  })
  courseId?: string;

  constructor(data?: Partial<CourseProgrammeThrough>) {
    super(data);
  }
}

export interface CourseProgrammeThroughRelations {
  // describe navigational properties here
}

export type CourseProgrammeThroughWithRelations = CourseProgrammeThrough & CourseProgrammeThroughRelations;
