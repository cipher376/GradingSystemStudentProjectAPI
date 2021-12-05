import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {
  FileServerApiConfig, PasswordHasherBindings, TokenServiceBindings,
  TokenServiceConstants, UserServiceBindings
} from './keys';
import {MySequence} from './sequence';
import {BcryptHasher} from './services/hash.password';
import {MyJWTService, MyJWTStrategy, MyUserService, SECURITY_SCHEME_SPEC} from './services/jwt-authentication';
import {MyMailerBindings} from './services/mailing/keys';
import {MyMailer} from './services/mailing/nodemail.service';





export {ApplicationConfig};

export class GradingSystemBackend extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // setup binding
    this.setupBinding(options);

    // Add security spec
    this.addSecuritySpec();

    // Set up the custom sequence
    this.sequence(MySequence);

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, MyJWTStrategy);


    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }


  setupBinding(options: ApplicationConfig): void {
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher).inScope(BindingScope.SERVER).inScope(BindingScope.APPLICATION);
    this.bind(PasswordHasherBindings.ROUNDS).to(10).inScope(BindingScope.SERVER).inScope(BindingScope.APPLICATION);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService).inScope(BindingScope.SERVER);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(MyJWTService).inScope(BindingScope.SERVER);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE).inScope(BindingScope.SERVER)
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE).inScope(BindingScope.SERVER);
    this.bind(MyMailerBindings.MY_MAILER_SERVICE).toClass(MyMailer).inScope(BindingScope.SERVER).inScope(BindingScope.SINGLETON);
    this.bind(FileServerApiConfig.FILE_SERVER_API_HOST).to(FileServerApiConfig.FILE_SERVER_API_HOST_VALUE).inScope(BindingScope.SERVER);



    /** configure passport  */
    // this.bind(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(
    //   MyUserService,
    // );
    // // passport strategies
    // this.add(createBindingFromClass(FacebookOauth, {key: 'facebookStrategy'}));
    // // this.add(createBindingFromClass(GoogleOauth, {key: 'googleStrategy'}));
    // // this.add(createBindingFromClass(CustomOauth2, {key: 'oauth2Strategy'}));
    // // passport express middleware
    // this.add(
    //   createBindingFromClass(FacebookOauth2ExpressMiddleware, {
    //     key: 'facebookStrategyMiddleware',
    //   }),
    // );
    // // this.add(
    // //   createBindingFromClass(GoogleOauth2ExpressMiddleware, {
    // //     key: 'googleStrategyMiddleware',
    // //   }),
    // // );
    // // this.add(
    // //   createBindingFromClass(CustomOauth2ExpressMiddleware, {
    // //     key: 'oauth2StrategyMiddleware',
    // //   }),
    // // );
    // // LoopBack 4 style authentication strategies
    // this.add(createBindingFromClass(LocalAuthStrategy));
    // // this.add(createBindingFromClass(FaceBookOauth2Authorization));
    // // this.add(createBindingFromClass(GoogleOauth2Authorization));
    // // this.add(createBindingFromClass(Oauth2AuthStrategy));
    // this.add(createBindingFromClass(SessionStrategy));
    // this.add(createBindingFromClass(BasicStrategy));

    // Express style middleware interceptors
    // this.bind('passport-init-mw').to(toInterceptor(passport.initialize()));
    // this.bind('passport-session-mw').to(toInterceptor(passport.session()));
    // this.bind('passport-facebook').toProvider(FacebookOauthInterceptor);
    // this.bind('passport-google').toProvider(GoogleOauthInterceptor);
    // this.bind('passport-oauth2').toProvider(CustomOauth2Interceptor);
    // this.bind('set-session-user').toProvider(SessionAuth);

    // this.bind('facebookOAuth2Options').to(options.facebookOptions);
    // this.bind('googleOAuth2Options').to(options.googleOptions);
    // this.bind('customOAuth2Options').to(options.oauth2Options);
  }


  addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'Grading system backend API',
        version: '0.0.0',
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [
        {
          // secure all endpoints with 'jwt'
          jwt: [],
        },
      ],
      servers: [{url: '/'}],
    });
  }
}


