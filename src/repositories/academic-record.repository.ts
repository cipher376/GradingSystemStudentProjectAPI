import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {AcademicRecord, AcademicRecordRelations, Student} from '../models';
import {IdentityDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StudentRepository} from './student.repository';

export class AcademicRecordRepository extends DefaultCrudRepository<
  AcademicRecord,
  typeof AcademicRecord.prototype.id,
  AcademicRecordRelations
> {

  public readonly student: BelongsToAccessor<Student, typeof AcademicRecord.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource, @repository.getter('StudentRepository') protected studentRepositoryGetter: Getter<StudentRepository>,
  ) {
    super(AcademicRecord, dataSource);
    this.student = this.createBelongsToAccessorFor('student', studentRepositoryGetter,);
    this.registerInclusionResolver('student', this.student.inclusionResolver);
  }
}
