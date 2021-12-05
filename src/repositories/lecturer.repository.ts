import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {Lecturer, LecturerRelations, Course, User} from '../models';
import {IdentityDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CourseRepository} from './course.repository';
import {UserRepository} from './user.repository';

export class LecturerRepository extends DefaultCrudRepository<
  Lecturer,
  typeof Lecturer.prototype.id,
  LecturerRelations
> {

  public readonly courses: HasManyRepositoryFactory<Course, typeof Lecturer.prototype.id>;

  public readonly user: HasOneRepositoryFactory<User, typeof Lecturer.prototype.id>;

  constructor(
    @inject('datasources.identityDb') dataSource: IdentityDbDataSource, @repository.getter('CourseRepository') protected courseRepositoryGetter: Getter<CourseRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Lecturer, dataSource);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.courses = this.createHasManyRepositoryFactoryFor('courses', courseRepositoryGetter,);
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
  }
}
