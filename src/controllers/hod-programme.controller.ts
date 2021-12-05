import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Hod,
  Programme,
} from '../models';
import {HodRepository} from '../repositories';

export class HodProgrammeController {
  constructor(
    @repository(HodRepository)
    public hodRepository: HodRepository,
  ) { }

  @get('/hods/{id}/programme', {
    responses: {
      '200': {
        description: 'Programme belonging to Hod',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Programme)},
          },
        },
      },
    },
  })
  async getProgramme(
    @param.path.string('id') id: typeof Hod.prototype.id,
  ): Promise<Programme> {
    return this.hodRepository.programme(id);
  }
}
