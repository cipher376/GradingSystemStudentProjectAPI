import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {Course, CourseRelations, Grade, Programme, CourseProgrammeThrough, Lecturer} from '../models';
import {IdentityDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {GradeRepository} from './grade.repository';
import {CourseProgrammeThroughRepository} from './course-programme-through.repository';
import {ProgrammeRepository} from './programme.repository';
import {LecturerRepository} from './lecturer.repository';

export class CourseRepository extends DefaultCrudRepository<
  Course,
  typeof Course.prototype.id,
  CourseRelations
> {

  public readonly grades: HasManyRepositoryFactory<Grade, typeof Course.prototype.id>;

  public readonly programmes: HasManyThroughRepositoryFactory<Programme, typeof Programme.prototype.id,
          CourseProgrammeThrough,
          typeof Course.prototype.id
        >;

  public readonly lecturer: BelongsToAccessor<Lecturer, typeof Course.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource, @repository.getter('GradeRepository') protected gradeRepositoryGetter: Getter<GradeRepository>, @repository.getter('CourseProgrammeThroughRepository') protected courseProgrammeThroughRepositoryGetter: Getter<CourseProgrammeThroughRepository>, @repository.getter('ProgrammeRepository') protected programmeRepositoryGetter: Getter<ProgrammeRepository>, @repository.getter('LecturerRepository') protected lecturerRepositoryGetter: Getter<LecturerRepository>,
  ) {
    super(Course, dataSource);
    this.lecturer = this.createBelongsToAccessorFor('lecturer', lecturerRepositoryGetter,);
    this.registerInclusionResolver('lecturer', this.lecturer.inclusionResolver);
    this.programmes = this.createHasManyThroughRepositoryFactoryFor('programmes', programmeRepositoryGetter, courseProgrammeThroughRepositoryGetter,);
    this.registerInclusionResolver('programmes', this.programmes.inclusionResolver);
    this.grades = this.createHasManyRepositoryFactoryFor('grades', gradeRepositoryGetter,);
    this.registerInclusionResolver('grades', this.grades.inclusionResolver);
  }
}
