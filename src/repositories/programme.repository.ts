import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository, HasManyThroughRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {IdentityDbDataSource} from '../datasources';
import {Programme, ProgrammeRelations, Student, Course, CourseProgrammeThrough, Hod} from '../models';
import {StudentRepository} from './student.repository';
import {CourseProgrammeThroughRepository} from './course-programme-through.repository';
import {CourseRepository} from './course.repository';
import {HodRepository} from './hod.repository';

export class ProgrammeRepository extends DefaultCrudRepository<
  Programme,
  typeof Programme.prototype.id,
  ProgrammeRelations
> {

  public readonly students: HasManyRepositoryFactory<Student, typeof Programme.prototype.id>;

  public readonly courses: HasManyThroughRepositoryFactory<Course, typeof Course.prototype.id,
          CourseProgrammeThrough,
          typeof Programme.prototype.id
        >;

  public readonly hod: HasOneRepositoryFactory<Hod, typeof Programme.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource,
    @repository.getter('StudentRepository') protected studentRepositoryGetter: Getter<StudentRepository>, @repository.getter('CourseProgrammeThroughRepository') protected courseProgrammeThroughRepositoryGetter: Getter<CourseProgrammeThroughRepository>, @repository.getter('CourseRepository') protected courseRepositoryGetter: Getter<CourseRepository>, @repository.getter('HodRepository') protected hodRepositoryGetter: Getter<HodRepository>,
  ) {
    super(Programme, dataSource);
    this.hod = this.createHasOneRepositoryFactoryFor('hod', hodRepositoryGetter);
    this.registerInclusionResolver('hod', this.hod.inclusionResolver);
    this.courses = this.createHasManyThroughRepositoryFactoryFor('courses', courseRepositoryGetter, courseProgrammeThroughRepositoryGetter,);
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
    this.students = this.createHasManyRepositoryFactoryFor('students', studentRepositoryGetter,);
    this.registerInclusionResolver('students', this.students.inclusionResolver);
  }
}
