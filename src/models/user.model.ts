import {belongsTo, Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Address} from './address.model';
import {Admin} from './admin.model';
import {Authentication} from './authentication.model';
import {Lecturer} from './lecturer.model';
import {Password} from './password.model';
import {Photo} from './photo.model';
import {Profile} from './profile.model';
import {ResetRequest} from './reset-request.model';
import {Role} from './role.model';
import {Student} from './student.model';
import {UserConfig} from './user-config.model';
import {UserIdentity} from './user-identity.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 50,
      minLength: 5,
    },
  })
  email: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 20,
      minLength: 7,
    },
  })
  phone?: string;

  @property({
    type: 'boolean',
    default: false
  })
  emailVerified?: boolean;

  @property({
    type: 'boolean',
    default: false
  })
  phoneVerified?: boolean;

  @property({
    type: 'string',
  })
  realm?: string;

  @property({
    type: 'string',
  })
  emailVerificationToken?: string;

  @property({
    type: 'string',
  })
  phoneVerificationToken?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  remember?: boolean;

  @property({
    type: 'array',
    itemType: 'string',
  })
  application?: string[];

  @hasOne(() => Password)
  password: Password;

  @hasOne(() => Profile)
  profile: Profile;

  @hasOne(() => Address)
  address: Address;

  @hasMany(() => UserConfig)
  userConfigs: UserConfig[];

  @hasOne(() => Photo)
  profilePhoto: Photo;

  @hasMany(() => ResetRequest)
  resetRequests: ResetRequest[];

  @hasMany(() => Authentication)
  authentications: Authentication[];

  @hasOne(() => UserIdentity)
  userIdentity: UserIdentity;
  @belongsTo(() => Lecturer)
  lecturerId: string;

  @property({
    type: 'string',
  })
  hodId?: string;

  @belongsTo(() => Admin)
  adminId: string;

  @hasOne(() => Role)
  role: Role;

  @belongsTo(() => Student)
  studentId: string;

  @hasOne(() => Student)
  student: Student;
  [prop: string]: unknown;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
