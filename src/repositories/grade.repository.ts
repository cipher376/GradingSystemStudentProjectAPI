import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Grade, GradeRelations, Student, Course} from '../models';
import {IdentityDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StudentRepository} from './student.repository';
import {CourseRepository} from './course.repository';

export class GradeRepository extends DefaultCrudRepository<
  Grade,
  typeof Grade.prototype.id,
  GradeRelations
> {

  public readonly student: BelongsToAccessor<Student, typeof Grade.prototype.id>;

  public readonly course: BelongsToAccessor<Course, typeof Grade.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource, @repository.getter('StudentRepository') protected studentRepositoryGetter: Getter<StudentRepository>, @repository.getter('CourseRepository') protected courseRepositoryGetter: Getter<CourseRepository>,
  ) {
    super(Grade, dataSource);
    this.course = this.createBelongsToAccessorFor('course', courseRepositoryGetter,);
    this.registerInclusionResolver('course', this.course.inclusionResolver);
    this.student = this.createBelongsToAccessorFor('student', studentRepositoryGetter,);
    this.registerInclusionResolver('student', this.student.inclusionResolver);
  }
}
