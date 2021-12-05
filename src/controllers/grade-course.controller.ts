// import {
//   repository,
// } from '@loopback/repository';
// import {
//   param,
//   get,
//   getModelSchemaRef,
// } from '@loopback/rest';
// import {
//   Grade,
//   Course,
// } from '../models';
// import {GradeRepository} from '../repositories';

// export class GradeCourseController {
//   constructor(
//     @repository(GradeRepository)
//     public gradeRepository: GradeRepository,
//   ) { }

//   @get('/grades/{id}/course', {
//     responses: {
//       '200': {
//         description: 'Course belonging to Grade',
//         content: {
//           'application/json': {
//             schema: {type: 'array', items: getModelSchemaRef(Course)},
//           },
//         },
//       },
//     },
//   })
//   async getCourse(
//     @param.path.string('id') id: typeof Grade.prototype.id,
//   ): Promise<Course> {
//     return this.gradeRepository.course(id);
//   }
// }
