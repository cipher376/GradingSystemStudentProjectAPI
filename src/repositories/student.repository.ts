import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {Student, StudentRelations, User, AcademicRecord, Programme, Grade} from '../models';
import {IdentityDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';
import {AcademicRecordRepository} from './academic-record.repository';
import {ProgrammeRepository} from './programme.repository';
import {GradeRepository} from './grade.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof Student.prototype.id>;

  public readonly academicRecords: HasManyRepositoryFactory<AcademicRecord, typeof Student.prototype.id>;

  public readonly programme: BelongsToAccessor<Programme, typeof Student.prototype.id>;

  public readonly grades: HasManyRepositoryFactory<Grade, typeof Student.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('AcademicRecordRepository') protected academicRecordRepositoryGetter: Getter<AcademicRecordRepository>, @repository.getter('ProgrammeRepository') protected programmeRepositoryGetter: Getter<ProgrammeRepository>, @repository.getter('GradeRepository') protected gradeRepositoryGetter: Getter<GradeRepository>,
  ) {
    super(Student, dataSource);
    this.grades = this.createHasManyRepositoryFactoryFor('grades', gradeRepositoryGetter,);
    this.registerInclusionResolver('grades', this.grades.inclusionResolver);
    this.programme = this.createBelongsToAccessorFor('programme', programmeRepositoryGetter,);
    this.registerInclusionResolver('programme', this.programme.inclusionResolver);
    this.academicRecords = this.createHasManyRepositoryFactoryFor('academicRecords', academicRecordRepositoryGetter,);
    this.registerInclusionResolver('academicRecords', this.academicRecords.inclusionResolver);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
