import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {TokenServiceBindings} from '../../keys';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class MyJWTService {
  // @inject('authentication.jwt.secret')
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public jwtSecret: string;

  @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
  public expiresSecret: string;

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error while generating token :userProfile is null'
      )
    }
    let token = '';
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.expiresSecret
      });
      return token;
    } catch (err) {
      throw new HttpErrors.Unauthorized(
        `error generating token ${err}`
      )
    }
  }

  async verifyToken(token: string): Promise<UserProfile> {

    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token:'token' is null`
      )
    };

    let userProfile: UserProfile;
    try {
      const decryptedToken = await verifyAsync(token, this.jwtSecret);

      userProfile = Object.assign(
        {[securityId]: '', id: '', name: '', email: '', phone: ''},
        {[securityId]: decryptedToken.id, id: decryptedToken.id, name: decryptedToken.name, email: decryptedToken.email, phone: decryptedToken.phone}
      );
    }
    catch (err) {
      throw new HttpErrors.Unauthorized(`Error verifying token:${err.message}`)
    }
    return userProfile;
  }
}

