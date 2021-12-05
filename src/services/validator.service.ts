import {HttpErrors} from '@loopback/rest';
import * as isEmail from 'isemail';
import {PASSWORD_MAXIMUM_LENGTH, PASSWORD_MINIMUM_LENGTH} from './../config';
import {Credentials} from './jwt-authentication/user.service';

export function validateCredentials(credentials: Credentials) {

  if (!credentials.email && !credentials.phone) { // if both emaill and phone number is empty
    throw new HttpErrors.UnprocessableEntity('invalid email or Phone number');
  }

  // if phone is empty and email is not valid
  if (!credentials.phone && !isEmail.validate(credentials?.email as any)) {
    throw new HttpErrors.UnprocessableEntity('invalid Email');
  }

  if ((credentials.password as string).length < PASSWORD_MINIMUM_LENGTH) {
    throw new HttpErrors.UnprocessableEntity('password length should be greater than 8')
  }
  if ((credentials.password as string).length >= PASSWORD_MAXIMUM_LENGTH) {
    throw new HttpErrors.UnprocessableEntity('password length should NOT be more than 50')
  }
}
