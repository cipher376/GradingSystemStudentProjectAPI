// import {
//   Count,
//   CountSchema,
//   Filter,
//   repository,
//   Where
// } from '@loopback/repository';
// import {
//   del,
//   get,
//   getModelSchemaRef,
//   getWhereSchemaFor,
//   param,
//   patch,
//   post,
//   requestBody
// } from '@loopback/rest';
// import {
//   ResetRequest, User
// } from '../models';
// import {UserRepository} from '../repositories';

// export class UserResetRequestController {
//   constructor(
//     @repository(UserRepository) protected userRepository: UserRepository,
//   ) { }

//   @get('/users/{id}/reset-requests', {
//     responses: {
//       '200': {
//         description: 'Array of User has many ResetRequest',
//         content: {
//           'application/json': {
//             schema: {type: 'array', items: getModelSchemaRef(ResetRequest)},
//           },
//         },
//       },
//     },
//   })
//   @logInvocation()
//   async find(
//     @param.path.string('id') id: string,
//     @param.query.object('filter') filter?: Filter<ResetRequest>,
//   ): Promise<ResetRequest[]> {
//     return this.userRepository.resetRequests(id).find(filter);
//   }

//   @post('/users/{id}/reset-requests', {
//     responses: {
//       '200': {
//         description: 'User model instance',
//         content: {'application/json': {schema: getModelSchemaRef(ResetRequest)}},
//       },
//     },
//   })
//   @logInvocation()
//   async create(
//     @param.path.string('id') id: typeof User.prototype.id,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(ResetRequest, {
//             title: 'NewResetRequestInUser',
//             exclude: ['id'],
//             optional: ['userId']
//           }),
//         },
//       },
//     }) resetRequest: Omit<ResetRequest, 'id'>,
//   ): Promise<ResetRequest> {
//     return this.userRepository.resetRequests(id).create(resetRequest);
//   }

//   @patch('/users/{id}/reset-requests', {
//     responses: {
//       '200': {
//         description: 'User.ResetRequest PATCH success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   @logInvocation()
//   async patch(
//     @param.path.string('id') id: string,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(ResetRequest, {partial: true}),
//         },
//       },
//     })
//     resetRequest: Partial<ResetRequest>,
//     @param.query.object('where', getWhereSchemaFor(ResetRequest)) where?: Where<ResetRequest>,
//   ): Promise<Count> {
//     return this.userRepository.resetRequests(id).patch(resetRequest, where);
//   }

//   @del('/users/{id}/reset-requests', {
//     responses: {
//       '200': {
//         description: 'User.ResetRequest DELETE success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   @logInvocation()
//   async delete(
//     @param.path.string('id') id: string,
//     @param.query.object('where', getWhereSchemaFor(ResetRequest)) where?: Where<ResetRequest>,
//   ): Promise<Count> {
//     return this.userRepository.resetRequests(id).delete(where);
//   }
// }
