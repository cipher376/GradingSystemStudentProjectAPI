import {BindingKey} from '@loopback/core';
import {MyMailer} from './nodemail.service';


export namespace MyMailerBindings {
  export const MY_MAILER_SERVICE = BindingKey.create<MyMailer>('services.my.mailer.service',)
}
