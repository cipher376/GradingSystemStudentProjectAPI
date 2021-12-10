import {
  repository
} from '@loopback/repository';
import {
  del, getModelSchemaRef, param, post, requestBody
} from '@loopback/rest';
import {CourseProgrammeThrough} from '../models';
import {CourseProgrammeThroughRepository} from '../repositories';

export class CourseProgrammeThroughController {
  constructor(
    @repository(CourseProgrammeThroughRepository)
    public courseProgrammeThroughRepository: CourseProgrammeThroughRepository,
  ) { }

  @post('/course-programme-throughs', {
    responses: {
      '200': {
        description: 'CourseProgrammeThrough model instance',
        content: {'application/json': {schema: getModelSchemaRef(CourseProgrammeThrough)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CourseProgrammeThrough, {
            title: 'NewCourseProgrammeThrough',
            exclude: ['id'],
          }),
        },
      },
    })
    courseProgrammeThrough: Omit<CourseProgrammeThrough, 'id'>,
  ): Promise<CourseProgrammeThrough> {
    return this.courseProgrammeThroughRepository.create(courseProgrammeThrough);
  }

  // @get('/course-programme-throughs/count', {
  //   responses: {
  //     '200': {
  //       description: 'CourseProgrammeThrough model count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async count(
  //   @param.where(CourseProgrammeThrough) where?: Where<CourseProgrammeThrough>,
  // ): Promise<Count> {
  //   return this.courseProgrammeThroughRepository.count(where);
  // }

  // @get('/course-programme-throughs', {
  //   responses: {
  //     '200': {
  //       description: 'Array of CourseProgrammeThrough model instances',
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'array',
  //             items: getModelSchemaRef(CourseProgrammeThrough, {includeRelations: true}),
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(CourseProgrammeThrough) filter?: Filter<CourseProgrammeThrough>,
  // ): Promise<CourseProgrammeThrough[]> {
  //   return this.courseProgrammeThroughRepository.find(filter);
  // }

  // @patch('/course-programme-throughs', {
  //   responses: {
  //     '200': {
  //       description: 'CourseProgrammeThrough PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(CourseProgrammeThrough, {partial: true}),
  //       },
  //     },
  //   })
  //   courseProgrammeThrough: CourseProgrammeThrough,
  //   @param.where(CourseProgrammeThrough) where?: Where<CourseProgrammeThrough>,
  // ): Promise<Count> {
  //   return this.courseProgrammeThroughRepository.updateAll(courseProgrammeThrough, where);
  // }

  // @get('/course-programme-throughs/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'CourseProgrammeThrough model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(CourseProgrammeThrough, {includeRelations: true}),
  //         },
  //       },
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(CourseProgrammeThrough, {exclude: 'where'}) filter?: FilterExcludingWhere<CourseProgrammeThrough>
  // ): Promise<CourseProgrammeThrough> {
  //   return this.courseProgrammeThroughRepository.findById(id, filter);
  // }

  // @patch('/course-programme-throughs/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'CourseProgrammeThrough PATCH success',
  //     },
  //   },
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(CourseProgrammeThrough, {partial: true}),
  //       },
  //     },
  //   })
  //   courseProgrammeThrough: CourseProgrammeThrough,
  // ): Promise<void> {
  //   await this.courseProgrammeThroughRepository.updateById(id, courseProgrammeThrough);
  // }

  // @put('/course-programme-throughs/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'CourseProgrammeThrough PUT success',
  //     },
  //   },
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() courseProgrammeThrough: CourseProgrammeThrough,
  // ): Promise<void> {
  //   await this.courseProgrammeThroughRepository.replaceById(id, courseProgrammeThrough);
  // }

  @del('/course-programme-throughs/{id}', {
    responses: {
      '204': {
        description: 'CourseProgrammeThrough DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.courseProgrammeThroughRepository.deleteById(id);
  }
}
