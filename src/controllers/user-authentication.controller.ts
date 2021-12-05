// import {logInvocation} from '@loopback/logging';
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
//   Authentication, User
// } from '../models';
// import {UserRepository} from '../repositories';

// export class UserAuthenticationController {
//   constructor(
//     @repository(UserRepository) protected userRepository: UserRepository,
//   ) { }

//   @get('/users/{id}/authentications', {
//     responses: {
//       '200': {
//         description: 'Array of User has many Authentication',
//         content: {
//           'application/json': {
//             schema: {type: 'array', items: getModelSchemaRef(Authentication)},
//           },
//         },
//       },
//     },
//   })
//   @logInvocation()
//   async find(
//     @param.path.string('id') id: string,
//     @param.query.object('filter') filter?: Filter<Authentication>,
//   ): Promise<Authentication[]> {
//     return this.userRepository.authentications(id).find(filter);
//   }

//   @post('/users/{id}/authentications', {
//     responses: {
//       '200': {
//         description: 'User model instance',
//         content: {'application/json': {schema: getModelSchemaRef(Authentication)}},
//       },
//     },
//   })
//   @logInvocation()
//   async create(
//     @param.path.string('id') id: typeof User.prototype.id,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Authentication, {
//             title: 'NewAuthenticationInUser',
//             exclude: ['id'],
//             optional: ['userId']
//           }),
//         },
//       },
//     }) authentication: Omit<Authentication, 'id'>,
//   ): Promise<Authentication> {
//     return this.userRepository.authentications(id).create(authentication);
//   }

//   @patch('/users/{id}/authentications', {
//     responses: {
//       '200': {
//         description: 'User.Authentication PATCH success count',
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
//           schema: getModelSchemaRef(Authentication, {partial: true}),
//         },
//       },
//     })
//     authentication: Partial<Authentication>,
//     @param.query.object('where', getWhereSchemaFor(Authentication)) where?: Where<Authentication>,
//   ): Promise<Count> {
//     return this.userRepository.authentications(id).patch(authentication, where);
//   }

//   @del('/users/{id}/authentications', {
//     responses: {
//       '200': {
//         description: 'User.Authentication DELETE success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   @logInvocation()
//   async delete(
//     @param.path.string('id') id: string,
//     @param.query.object('where', getWhereSchemaFor(Authentication)) where?: Where<Authentication>,
//   ): Promise<Count> {
//     return this.userRepository.authentications(id).delete(where);
//   }
// }
