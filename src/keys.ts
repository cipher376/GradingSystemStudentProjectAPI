import {TokenService, UserIdentityService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {Profile as PassportProfile} from 'passport';
import {User} from './models/user.model';
import {PasswordHasher} from './services/hash.password';
import {Credentials} from './services/jwt-authentication/user.service';



export namespace TokenServiceConstants {
    export const TOKEN_SECRET_VALUE = '138asda8213QDF%%&&$$$kHKjhjkop1445';
    export const TOKEN_EXPIRES_IN_VALUE = '7h';
}

export namespace TokenServiceBindings {
    export const TOKEN_SECRET = BindingKey.create<string>('authentication.jwt.secret',);
    export const TOKEN_EXPIRES_IN = BindingKey.create<string>('authentication.jwt.expiresIn',);
    export const TOKEN_SERVICE = BindingKey.create<TokenService>('services.jwt.service',);
}

export namespace PasswordHasherBindings {
    export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.hasher',);
    export const ROUNDS = BindingKey.create<number>('services.hasher.rounds',);
}


export namespace UserServiceBindings {
    export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>('services.user.service',)

    export const PASSPORT_USER_IDENTITY_SERVICE = BindingKey.create<
        UserIdentityService<PassportProfile, User>
    >('services.passport.identity');

}





/**
 * Binding key for the storage directory
 */
export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory');


/**
 * Used by Authorization system (casbin)
 */
// export const RESOURCE_ID = BindingKey.create<string>('resourceId');


/***
 * Used by Emailer, SMS sender, Push notification, Node mailer, Amazon aws simple
 * email service
 */


export namespace FileServerApiConfig {
    export const FILE_SERVER_API_PORT_VALUE = '3003';
    // export const FILE_SERVER_API_HOST_VALUE = `http://localhost:${FILE_SERVER_API_PORT_VALUE}`;
    export const FILE_SERVER_API_HOST_VALUE = `http://172.18.0.7:${FILE_SERVER_API_PORT_VALUE}`;

    export const FILE_SERVER_API_HOST = BindingKey.create<string>('file.identity.api.host',);
}

export namespace HostServerConfig {
    export const DOMAIN_OR_IP = 'http://localhost:80/home'; //Front-end application
}


export enum OPERATION_STATE {
    pending = 'pending',
    success = 'success',
    failed = 'failed',
    unknown = 'unknown'
}

export enum RESET_REQUEST_TYPE {
    password = 'password',
    email = 'email',
    phone = 'phone'
}

export enum CONFIG_ACTION {
    locked = 'locked',
    banned = 'banned',
    session = 'session',
    cookie = 'cookie'
}

export enum EXTERNAL_AUTH_PROVIDER {
    facebook = 'facebook',
    google = 'google',
    microsoft = 'microsoft',
    apple = 'apple'
}


