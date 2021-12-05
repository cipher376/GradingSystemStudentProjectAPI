import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {logInvocation} from '@loopback/logging';
import {
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getJsonSchemaRef,
  getModelSchemaRef, HttpErrors, param,
  post,
  Request, requestBody,
  RestBindings
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import axios from 'axios';
import _ from 'lodash';
import {uid} from 'uid';
import {
  FileServerApiConfig, OPERATION_STATE, PasswordHasherBindings, RESET_REQUEST_TYPE,
  TokenServiceBindings, UserServiceBindings
} from '../keys';
import {Password, Photo, ResetRequest, User} from '../models';
import {SignUpData} from '../models/sign-up-data.model';
import {PasswordRepository, ResetRequestRepository, UserRepository} from '../repositories';
import {validateCredentials} from '../services';
import {BcryptHasher} from '../services/hash.password';
import {Credentials, MyJWTService, MyUserService} from '../services/jwt-authentication';
import {MyMailerBindings} from '../services/mailing/keys';
import {EmailMessage, MyMailer} from '../services/mailing/nodemail.service';
import {HostServerConfig} from './../keys';
import {Profile} from './../models/profile.model';
import {PhotoRepository} from './../repositories/photo.repository';
const applyFilter = require('loopback-filters');


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    // @inject('service.hasher')
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    // @inject('service.user.service')
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,

    // @inject('service.jwt.service')
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: MyJWTService,


    @repository(PasswordRepository)
    public passwordRepository: PasswordRepository,

    @repository(ResetRequestRepository)
    public resetRequestRepository: ResetRequestRepository,

    @inject(MyMailerBindings.MY_MAILER_SERVICE)
    public myMailerService: MyMailer,


    @repository(PhotoRepository)
    public photoRepository: PhotoRepository,


    @inject(RestBindings.Http.REQUEST) private request: Request,

    @inject(FileServerApiConfig.FILE_SERVER_API_HOST)
    private fileServerHost: string,
  ) { }



  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(SignUpData)
        }
      }
    }
  })
  // @logInvocation()
  async signup(@requestBody(
    {
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpData,
            {
              includeRelations: false,
              exclude: [],
              optional: []
            })
        },
      },
    }
  ) userData: SignUpData) {
    console.log('error');
    validateCredentials(_.pick(userData as any, ['email', 'phone', 'password']));
    // check if user exist
    const isUser = await this.userService.userExist(_.pick(userData as any, ['email', 'phone', 'password']));

    console.log(userData)
    if (isUser) {
      // prevent registration
      throw new HttpErrors.Conflict('Email or Phone is taken!')
    }
    // save password hash
    const hash = await this.hasher.hashPassword((userData as any).password as string);
    const user = new User();
    user.email = userData.email;
    user.phone = userData.phone;

    const savedUser = await this.userRepository.create(user);
    if (savedUser.id) {
      const password = {
        hash,
        dateCreated: (new Date(Date.now())).toDateString(),
        dateModified: (new Date(Date.now())).toDateString(),
        userId: savedUser.id,
        modifiedBy: savedUser.id
      } as Password;

      if ((await this.passwordRepository.create(password)).id) {
        // update user policies
        // (await this.enforcer).addGroupingPolicy(...[`u${savedUser?.id}`, 'authUser']).then(_ => {
        // }).catch(error => {
        //   console.debug(error);
        // })
      }

      let profile = new Profile();
      profile.firstName = userData.firstName;
      profile.lastName = userData.lastName;
      profile.otherName = userData.otherName;

      profile = await this.userRepository.profile(savedUser.id).create(profile);
      savedUser.profile = profile;
    }

    // send email to user

    // send reset link to email
    const contactPageUrl = `${HostServerConfig.DOMAIN_OR_IP}/main/pages/about`;
    const appName = 'Kejettia.com'

    const resetEmail: EmailMessage = {
      from: 'hello@kejettia.com',
      text: '',
      to: savedUser?.email,
      subject: 'Registration successful',
      html: `
      <html>
      <head>
      <title>Registration successful</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style type="text/css">
        /* FONTS */
        @media screen {
          @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
          }

          @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
          }

          @font-face {
            font-family: 'Lato';
            font-style: italic;
            font-weight: 400;
            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
          }

          @font-face {
            font-family: 'Lato';
            font-style: italic;
            font-weight: 700;
            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
          }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }

        table,
        td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }

        img {
          -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }

        table {
          border-collapse: collapse !important;
        }

        body {
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }

      </style>
      </head>

      <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

      <!-- HIDDEN PREHEADER TEXT -->
      <div
        style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Looks like your account needs verification.
      </div>

      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
          <td bgcolor="#ff431a" align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="480">
              <tr>
                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                  <a href="www.kejettia.com" target="_blank">
                    <img alt="Logo" src="${HostServerConfig.DOMAIN_OR_IP}/assets/images/logo-footer.svg" width="300" height="100"
                      style="display: block;  font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;"
                      border="0">
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- HERO -->
        <tr>
          <td bgcolor="#ff431a" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480">
              <tr>
                <td bgcolor="#ffffff" align="center" valign="top"
                  style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                  <h1 style="font-size: 32px; font-weight: 400; margin: 0;">Your registration with kejettia was successful. </h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- COPY BLOCK -->
        <tr>
          <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480">
              <tr>
                <td bgcolor="#ffffff" align="left">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" style="border-radius: 3px;" bgcolor="#ff431a">
                              <!-- <p>Your registration with Kejettia was successful. </p> -->
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- COPY CALLOUT -->

        <!-- SUPPORT CALLOUT -->
        <tr>
          <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480">
              <!-- HEADLINE -->
              <tr>
                <td bgcolor="#FFC0B3" align="center"
                  style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                  <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                  <p style="margin: 0;"><a href="${contactPageUrl}" target="_blank"
                      style="color: #E62A00;">We&rsquo;re
                      here, ready to talk</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480">

              <!-- PERMISSION REMINDER -->
              <tr>
                <td bgcolor="#f4f4f4" align="left"
                  style="padding: 10px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
                  <p style="margin: 0;">You received this email because you registered on kejettia e-commerce site. If you did not, <a
                      href="${contactPageUrl}" target="_blank" style="color: #111111; font-weight:
                      700;">please contact us or ignore.</a>.</p>
                </td>
              </tr>

              <!-- ADDRESS -->
              <tr>
                <td bgcolor="#f4f4f4" align="left"
                  style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
                  <p style="margin: 0;">${appName ?? 'Devtek engineering ltd.'} (Ghana)</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      </body>
      </html>
      `,
    }
    await this.myMailerService.sendMail(resetEmail);
    // console.log(savedUser);
    return savedUser;
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  @logInvocation()
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<{token: string}> {
    validateCredentials(_.pick(credentials, ['email', 'phone', 'password']));
    // make sure user exist,password should be valid
    const user = await this.userService.verifyCredentials(credentials).catch(error => console.log(error));
    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid email or password');
    }
    // console.log(user);
    const userProfile = this.userService.convertToUserProfile(user as User);
    // console.log(userProfile);

    const token = await this.jwtService.generateToken(userProfile);

    // check if user is deactivated
    return Promise.resolve({token: token});
  }



  @get('/logout', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  @authenticate("jwt")
  @logInvocation()
  async logout(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<UserProfile> {
    // this.jwtService.expiresSecret;
    currentUser.password = undefined;
    return Promise.resolve(currentUser);
  }


  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  @authenticate("jwt")
  // @authorize(ACL_USER['me'])
  @logInvocation()
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<UserProfile> {
    console.log(currentUser);
    return Promise.resolve(currentUser);
  }

  @get('/users/my-profile', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  @authenticate("jwt")
  // @authorize(ACL_USER['my-profile'])
  @logInvocation()
  async myProfile(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<User> {

    // console.log(this.request);
    // clear the sensitive fields
    const user = await this.findById(currentUser.id);

    // gather other user related information

    await this.userRepository.profile(currentUser.id).get().then(profile => {
      user.profile = profile;
    }, error => {
      console.debug(error);
    });

    await this.userRepository.profilePhoto(currentUser.id).get().then(ph => {
      user.profilePhoto = ph;
    }, error => {
      // console.debug(error);
    });
    await this.userRepository.address(currentUser.id).get().then(add => {
      user.address = add;
    }, error => {
      console.debug(error);
    })
    return Promise.resolve(user);
  }


  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate("jwt")
  // @authorize(ACL_USER['find-by-id'])
  @logInvocation()
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    try {
      console.log(filter);
      const user: User = await this.userRepository.findById(id, filter);
      // gather other user related information

      await this.userRepository.profile(user.id).get().then(profile => {
        user.profile = profile;
      }, error => {
        console.debug(error);
      });

      await this.userRepository.profilePhoto(user.id).get().then(ph => {
        user.profilePhoto = ph;
      }, error => {
        console.debug(error);
      });

      await this.userRepository.address(user.id).get().then(add => {
        user.address = add;
      }, error => {
        console.debug(error);
      })
      return Promise.resolve(this.userService.convertToUserView(user));
    } catch (error) {
      console.log(error);
      throw new HttpErrors.NotFound('User not found')
    }
  }



  // @patch('/users/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'User PATCH success',
  //     },
  //   },
  // })
  // @authenticate("jwt")
  // // @authorize(ACL_USER['update-by-id'])
  // @logInvocation()
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @inject(AuthenticationBindings.CURRENT_USER)
  //   currentUser: UserProfile,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  // ): Promise<User> {
  //   // console.log(currentUser)
  //   // clear the sensitive fields
  //   const returnUser = await this.userService.updateUser(id, user, currentUser.id);
  //   return returnUser;
  // }





  @get('/users-search/{searchKey}', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate("jwt")
  // @authorize(ACL_USER['list-all'])
  @logInvocation()
  async searchExtensive(
    @param.path.string('searchKey') searchKey: string,
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {

    let users: User[] = await this.userRepository.find({
      include: [{
        relation: 'address'
      },
      {
        relation: 'profile'
      },
      {
        relation: 'profilePhoto',
        // scope: {
        //   where: {
        //     or: [{profile: true}, {flag: true}, {coverImage: true}]
        //   }
        // }
      },
      ]
    });

    if (searchKey === 'all') {
      return applyFilter(users, filter);
    }

    const keys: string[] = [];
    let tempKeys: string[] = [];
    let foundUsers: {user: User, score: number}[] = [];


    // build keys or search terms
    tempKeys = searchKey.split(' ');
    tempKeys.push(searchKey);

    // remove duplicates
    keys.push(searchKey);
    tempKeys.forEach(key => {
      key = key.toLowerCase().trim();
      if (!keys.includes(key)) {
        keys.push(key);
      }
    })
    console.log(filter);

    users.forEach(user => {
      const foundUser: {user: User, score: number} = {user: user, score: 0};
      for (const key of keys) {
        if (user?.profile?.firstName?.toLowerCase()?.trim()?.search(key) > -1) {
          foundUser.score += 5.8;
        }
        if (user?.profile?.lastName?.toLowerCase()?.trim()?.search(key) > -1) {
          foundUser.score += 5.8;
        }
        if ((user?.profile?.otherName) ?? ''.toLowerCase()?.trim()?.search(key) > -1) {
          foundUser.score += 5.8;
        }
        if ((user?.profile?.nickName) ?? ''.toLowerCase()?.trim()?.search(key) > -1) {
          foundUser.score += 4.0;
        }
        if ((user?.phone ?? '').toLowerCase()?.trim()?.search(key) > -1) {
          foundUser.score += 5.9;
        }
        if (user?.email?.toLowerCase()?.trim()?.search(key) > -1) {
          foundUser.score += 6;
        }
        if ((user?.address?.latLng ?? '')?.toLowerCase().trim().search(key) > -1) {
          foundUser.score += 5.8;
        }
        if ((user?.address?.street ?? '').toLowerCase().trim().search(key) > -1) {
          foundUser.score += 4.3;
        }
        if ((user?.address?.suburb ?? '').toLowerCase().trim().search(key) > -1) {
          foundUser.score += 4.3;
        }
        if (user?.address?.city?.toLowerCase().trim().search(key) > -1) {
          foundUser.score += 4.3;
        }
        if (user?.address?.state?.toLowerCase().trim().search(key) > -1) {
          foundUser.score += 3.9;
        }
        if (user?.address?.country?.toLowerCase().trim().search(key) > -1) {
          foundUser.score += 3.9;
        }
        if ((user?.address?.postCode ?? '').toLowerCase().trim().search(key) > -1) {
          foundUser.score += 3.9;
        }
        if ((user?.profile?.gender) ?? ''.toLowerCase().trim().search(key) > -1) {
          foundUser.score += 3.1;
        }
      }

      // check if user had a score
      if (foundUser.score > 0) {
        foundUsers.push(foundUser);
      }

      foundUsers = foundUsers.sort((us1, us2) => {
        if (us1.score < us2.score) {
          return 1;
        } else if (us1.score > us2.score) {
          return -1;
        } else {
          return 0; // equall
        }
      });
    })
    // applying filter to allow paging from front end
    users = [];
    foundUsers = applyFilter(foundUsers, filter);
    foundUsers.forEach(fs => {
      users.push(fs.user);
    })
    return users;

  }



  ////////////////////ADMIN ENDPOINTS//////////////////////////

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate("jwt")
  // @authorize(ACL_USER['count'])
  @logInvocation()
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<number> {
    return (await this.userRepository.count(where)).count
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate("jwt")
  // @authorize(ACL_USER['list-all'])
  @logInvocation()
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    // console.log(filter);
    if (!filter) {
      filter = {

      }
    }
    filter.include = [
      {relation: 'profilePhoto'},
      {relation: 'address'},
      {relation: 'profile'}
    ]

    console.log(filter);
    const users = await this.userService.getUsers(filter);
    return users;
  }


  @get('/users/app/{appId}', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate("jwt")
  // @authorize(ACL_USER['list-all'])
  @logInvocation()
  async findByApp(
    @param.path.string('appId') appId: string,
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    // console.log(filter);
    const filt = filter ?? {} as any;

    // including user configs to allow
    // sorting users by apps
    let incl: any = filt.include;
    if (incl && Array.isArray(incl)) {
      incl.push(
        ...[{relation: 'userConfigs'},
        {relation: 'profile'}, {relation: 'address'},
        {relation: 'profilePhoto'}]

      );
    } else if (incl) { // include is not an array but object
      incl = [...incl, ...[{relation: 'profile'}, {relation: 'address'}, {relation: 'profilePhoto'}]];
    } else {
      incl = [{relation: 'userConfigs'}, {relation: 'profile'}, {relation: 'address'}, {relation: 'profilePhoto'}];
    }
    filt.include = incl;

    console.log(filt);
    const users = await this.userService.getUsers(filt);

    // console.log(users);
    // filter for the app
    const selectedUsers: User[] = [];
    users?.forEach(user => {
      const configs = user.userConfigs;
      let found = 0;
      configs?.forEach(cfg => {
        if ((cfg?.action)?.toLowerCase()?.startsWith('app') && cfg?.value?.indexOf(appId) > -1) {
          //user  belongs to the specified application
          // now clear the config object
          user.userConfigs = [];
          found = 1;
        }
      })
      if (found == 1) {
        selectedUsers.push(user);
      }
    })
    // console.log(selectedUsers);
    return selectedUsers;
  }




  @post('/create-many', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            type: 'object'
          },
        },
      }
    }
  })
  @authenticate("jwt")
  // @authorize(ACL_USER['create-many'])
  @logInvocation()
  async createMany(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            "items": getModelSchemaRef(User, {includeRelations: false})
          }
        },
      },
    }) users: SignUpData[]) {
    console.log(users);
    const res: string[] = [];
    const errors: string[] = [];
    for (const u of users) {
      try {
        const savedUser = await this.signup(u);
        res.push(savedUser.id as string);
      } catch (error) {
        errors.push(error);
      }
    }
    return {res, errors};
  }


  @post('/users/{id}/profile-photo', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Photo)}},
      },
    },
  })
  @authenticate("jwt")
  @logInvocation()
  async createProfilePhoto(
    @param.path.string('id') id: typeof User.prototype.id,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Photo, {
            title: 'NewPhotoInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) photo: Omit<Photo, 'id'>,
  ): Promise<Photo> {
    try {
      await this.clearUserProfilePhotos(id as string, currentUser).catch(e => {
        console.log(e);
      })
    } catch (e) {
      console.log(e);
    } finally {
      return this.userRepository.profilePhoto(id).create(photo);
    }

  }


  @get('/users/{id}/delete-profile-photo', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @authenticate("jwt")
  @logInvocation()
  async clearUserProfilePhotos(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ) {
    console.log('Clearing photo');
    if (id !== currentUser?.id) { // owner ship
      return HttpErrors.Forbidden;
    }
    const photo = await this.userRepository.profilePhoto(currentUser.id).get();
    console.log(photo);
    if (photo) {
      try {
        // if successful, then delete from database
        const url = `${this.fileServerHost}/file/${photo.fileId}`;
        axios.delete(url, {
          headers: this.request.headers,
        }).catch(error => {
          console.log(error);
        })
      } catch (error) {
        console.log(error);
      }
      const result = await this.userRepository.profilePhoto(currentUser?.id).delete();
      console.log('Deleting');
      console.log(result);
      return {status: OPERATION_STATE.success, code: 200};
    }
  }

  /*******************************************************************
   ************* RESETS AND AUTHENTICATION****************************
   *******************************************************************/
  /***
   * change password
   */
  @post('/users/change-password', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @logInvocation()
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(String, {partial: true}),
        },
      },
    })
    passObject: {password: string, token: string}
  ): Promise<any> {
    // console.log(JSON.stringify(passObject))
    // validate token
    if (!passObject?.password || !passObject?.token) {
      return {status: OPERATION_STATE.failed}
    }

    const reset = await this.resetRequestRepository.findOne({where: {resetToken: passObject.token}});
    if (reset?.id) {
      // validation is true
      // check for expiry
      // console.log(reset.dateCreated);
      const startTime = new Date(reset.dateCreated);
      const now = new Date(Date.now());
      // console.log(startTime);
      // console.log(now);

      // calculate the elapsed time in minutes
      let diff = (now.getTime() - startTime.getTime()) / 1000;
      diff /= 60;
      const elapsedTime = Math.abs(Math.round(diff)) // time in minutes
      // console.log(elapsedTime);
      // console.log(reset.expiredTimeInMin);

      if (reset.expiredTimeInMin < elapsedTime) {
        // token has expired
        console.log('Password has expired')
        return false;
      }

      // update and save the reset object
      reset.dateModified = new Date(Date.now()).toISOString();
      reset.state = OPERATION_STATE.success


      // Now change the password
      const password = await this.passwordRepository.findOne({where: {userId: reset.userId}});
      if (!password) {
        // User does not exit
        console.log('User does not exist')

        return {status: OPERATION_STATE.failed};
      }

      // console.log(password)
      // hash the new password
      const hash = await this.hasher.hashPassword(passObject.password);
      password.hash = hash;
      // console.log(password)


      //update the password
      await this.passwordRepository.updateById(password.id, password);

      // update reset state
      reset.expiredTimeInMin = (reset.expiredTimeInMin - elapsedTime); // help to control the number of retries
      await this.resetRequestRepository.updateById(reset.id, reset);
      return {status: OPERATION_STATE.success};

    }
    // console.log('Invalid token!')
    return {status: OPERATION_STATE.failed};
  }


  /***********************************************************
  ******************Request password reset********************
  ************************************************************/

  @post('/users/reset-password', {
    responses: {
      '201': {
        description: 'User PATCH success',
      },
    },
  })
  @logInvocation()
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpData, {partial: true}),
        },
      },
    })
    data: SignUpData,
  ): Promise<any> {
    // clear the sensitive fields
    const token = uid(128);
    console.log(token);
    console.log(data);
    const user = await this.userRepository.findOne({where: {email: data.email}});
    if (user) {
      let reset = new ResetRequest();
      reset.requestType = RESET_REQUEST_TYPE.password;
      reset.dateCreated = new Date(Date.now()).toISOString();
      reset.dateModified = new Date(Date.now()).toISOString();
      reset.expiredTimeInMin = 30 // in minutes
      reset.resetToken = token;
      reset.userId = user.id as string;
      reset.state = OPERATION_STATE.pending;
      reset = await this.resetRequestRepository.create(reset);
      console.log(reset);
      const resetUrl = `${HostServerConfig.DOMAIN_OR_IP}/main/pages/change-password;token=${token}`;
      // send reset link to email
      const resetEmail: EmailMessage = {
        from: data?.app?.appSMTPEmail as any,
        to: data.email, //"bar@example.com, baz@example.com"
        subject: 'Password reset link',
        text: `Copy this link and paste in your browser: ${resetUrl}`,
        html: `<div><a href="${resetUrl}" target="_">Reset password</a></div>
<html>
<head>
  <title>${data?.app?.name} password reset</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <style type="text/css">
    /* FONTS */
    @media screen {
      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
      }

      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
      }

      @font-face {
        font-family: 'Lato';
        font-style: italic;
        font-weight: 400;
        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
      }

      @font-face {
        font-family: 'Lato';
        font-style: italic;
        font-weight: 700;
        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
      }
    }

    /* CLIENT-SPECIFIC STYLES */
    body,
    table,
    td,
    a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    /* RESET STYLES */
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }

    table {
      border-collapse: collapse !important;
    }

    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }

    /* iOS BLUE LINKS */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* ANDROID CENTER FIX */
    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }

  </style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

  <!-- HIDDEN PREHEADER TEXT -->
  <div
    style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Looks like your account needs verification.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- LOGO -->
    <tr>
      <td bgcolor="#ff431a" align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <tr>
            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
              <a href="#" target="_blank">
                <img alt="Logo" src="${data?.app?.logoUrl}" width="300" height="100"
                  style="display: block;  font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;"
                  border="0">
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- HERO -->
    <tr>
      <td bgcolor="#ff431a" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <tr>
            <td bgcolor="#ffffff" align="center" valign="top"
              style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
              <h1 style="font-size: 32px; font-weight: 400; margin: 0;">Want to reset your password?</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- COPY BLOCK -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <!-- COPY -->
          <tr>
            <td bgcolor="#ffffff" align="left"
              style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">Click the link below to reset the password.</p>
            </td>
          </tr>
          <!-- BULLETPROOF BUTTON -->
          <tr>
            <td bgcolor="#ffffff" align="left">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 3px;" bgcolor="#ff431a">
                          <a href="${resetUrl}" target="_blank"
                            style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #ff431a; display: inline-block;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- COPY CALLOUT -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <!-- HEADLINE -->
          <tr>
            <td bgcolor="#36384A" align="left"
              style="padding: 40px 30px 20px 30px; color: #ffffff; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <h2 style="font-size: 24px; font-weight: 400; margin: 0;">Unable to click on the button above?</h2>
            </td>
          </tr>
          <tr>
            <td bgcolor="#36384A" align="left"
              style="padding: 0px 30px 20px 30px; color: #979BB4; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">Copy and paste the link below in the address bar of your browser (Chrome, Firefox,
                Safari Or
                Opera).</p>
            </td>
          </tr>
          <!-- COPY -->
          <tr>
            <td bgcolor="#36384A" align="left"
              style="padding: 0px 30px 20px 30px; color: #979BB4; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">${resetUrl}</p>
            </td>
          </tr>
          <!-- COPY -->
          <tr>
            <!-- <td bgcolor="#111111" align="left"
              style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;"><a href="" target="_blank" style="color: #7c72dc;">See how easy it
                  is to get started</a></p>
            </td> -->
          </tr>
        </table>
      </td>
    </tr>

    <!-- SUPPORT CALLOUT -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <!-- HEADLINE -->
          <tr>
            <td bgcolor="#FFC0B3" align="center"
              style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
              <p style="margin: 0;"><a href="${data?.app?.contactPageUrl}" target="_blank"
                  style="color: #E62A00;">We&rsquo;re
                  here, ready to talk</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">

          <!-- PERMISSION REMINDER -->
          <tr>
            <td bgcolor="#f4f4f4" align="left"
              style="padding: 10px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
              <p style="margin: 0;">You received this email because you requested a password reset. If you did not, <a
                  href="${data?.app?.contactPageUrl}" target="_blank" style="color: #111111; font-weight:
                  700;">please contact us or ignore.</a>.</p>
            </td>
          </tr>

          <!-- ADDRESS -->
          <tr>
            <td bgcolor="#f4f4f4" align="left"
              style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
              <p style="margin: 0;">${data?.app?.name ?? 'Devtek engineering ltd.'} (Ghana)</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }
      await this.myMailerService.sendMail(resetEmail);
      return {status: OPERATION_STATE.success};

    }
    return {status: OPERATION_STATE.failed};

  }

  /***********************************************************
  ******************Email verification********************
  ************************************************************/

  @post('/users/email-verification-request', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @logInvocation()
  async emailVerificationRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpData, {partial: true}),
        },
      },
    })
    data: SignUpData,
  ): Promise<any> {
    const token = uid(128);
    const user = await this.userRepository.findOne({where: {email: data.email}});
    if (user) {
      user.emailVerificationToken = token;

      // update user object
      await this.userRepository.save(user);

      const resetUrl = `${HostServerConfig.DOMAIN_OR_IP}/main/pages/verify-email;token=${token}`;

      // send the token to the user
      const resetEmail: EmailMessage = {
        from: data?.app?.appSMTPEmail as any,
        to: data.email, //"emailToVerify@example.com"
        subject: 'Email verification',
        text: `Copy this link and paste in your browser: ${resetUrl}`,
        html: `<div><a href="${resetUrl}" target="_">Verify email</a></div>
<html>
<head>
  <title>${data?.app?.name} - verify email</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <style type="text/css">
    /* FONTS */
    @media screen {
      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
      }

      @font-face {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
      }

      @font-face {
        font-family: 'Lato';
        font-style: italic;
        font-weight: 400;
        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
      }

      @font-face {
        font-family: 'Lato';
        font-style: italic;
        font-weight: 700;
        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
      }
    }

    /* CLIENT-SPECIFIC STYLES */
    body,
    table,
    td,
    a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    /* RESET STYLES */
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }

    table {
      border-collapse: collapse !important;
    }

    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }

    /* iOS BLUE LINKS */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* ANDROID CENTER FIX */
    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }

  </style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

  <!-- HIDDEN PREHEADER TEXT -->
  <div
    style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Looks like your account needs verification.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- LOGO -->
    <tr>
      <td bgcolor="#ff431a" align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <tr>
            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
              <a href="#" target="_blank">
                <img alt="Logo" src="${data?.app?.logoUrl}" width="300" height="100"
                  style="display: block;  font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;"
                  border="0">
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- HERO -->
    <tr>
      <td bgcolor="#ff431a" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <tr>
            <td bgcolor="#ffffff" align="center" valign="top"
              style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
              <h1 style="font-size: 32px; font-weight: 400; margin: 0;">Do you want to verify your email?</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- COPY BLOCK -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <!-- COPY -->
          <tr>
            <td bgcolor="#ffffff" align="left"
              style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">Click the link below to verify your email.</p>
            </td>
          </tr>
          <!-- BULLETPROOF BUTTON -->
          <tr>
            <td bgcolor="#ffffff" align="left">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 3px;" bgcolor="#ff431a">
                          <a href="${resetUrl}" target="_blank"
                            style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #ff431a; display: inline-block;">
                            Verify email
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- COPY CALLOUT -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <!-- HEADLINE -->
          <tr>
            <td bgcolor="#36384A" align="left"
              style="padding: 40px 30px 20px 30px; color: #ffffff; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <h2 style="font-size: 24px; font-weight: 400; margin: 0;">Unable to click on the button above?</h2>
            </td>
          </tr>
          <tr>
            <td bgcolor="#36384A" align="left"
              style="padding: 0px 30px 20px 30px; color: #979BB4; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">Copy and paste the link below in the address bar of your browser (Chrome, Firefox,
                Safari Or
                Opera).</p>
            </td>
          </tr>
          <!-- COPY -->
          <tr>
            <td bgcolor="#36384A" align="left"
              style="padding: 0px 30px 20px 30px; color: #979BB4; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">${resetUrl}</p>
            </td>
          </tr>
          <!-- COPY -->
          <tr>
            <!-- <td bgcolor="#111111" align="left"
              style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;"><a href="" target="_blank" style="color: #7c72dc;">See how easy it
                  is to get started</a></p>
            </td> -->
          </tr>
        </table>
      </td>
    </tr>

    <!-- SUPPORT CALLOUT -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">
          <!-- HEADLINE -->
          <tr>
            <td bgcolor="#FFC0B3" align="center"
              style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
              <p style="margin: 0;"><a href="${data?.app?.contactPageUrl}" target="_blank"
                  style="color: #E62A00;">We&rsquo;re
                  here, ready to talk</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480">

          <!-- PERMISSION REMINDER -->
          <tr>
            <td bgcolor="#f4f4f4" align="left"
              style="padding: 10px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
              <p style="margin: 0;">You received this because it's set for verification. you don't expect this email, <a
                  href="${data?.app?.contactPageUrl}" target="_blank" style="color: #111111; font-weight:
                  700;">please contact us or ignore.</a>.</p>
            </td>
          </tr>

          <!-- ADDRESS -->
          <tr>
            <td bgcolor="#f4f4f4" align="left"
              style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
              <p style="margin: 0;">${data?.app?.name}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }
      this.myMailerService.sendMail(resetEmail);
      return {status: OPERATION_STATE.success};

    }
    return {status: OPERATION_STATE.failed};

  }


  @get('/users/verifyEmail/{token}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @logInvocation()
  async verifyEmail(
    @param.path.string('token') token: string,
  ): Promise<any> {

    const user = await this.userRepository.findOne({where: {emailVerificationToken: token}});
    if (user) {
      user.emailVerificationToken = ''; // clear token
      user.emailVerified = true;
      this.userRepository.save(user);
      return {status: OPERATION_STATE.success};
    }

    return {status: OPERATION_STATE.failed};
  }


  /***********************************************************
******************Phone number verification********************
************************************************************/
  @post('/users/phone-verification-request', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @logInvocation()
  async phoneVerificationRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpData, {partial: true}),
        },
      },
    })
    data: SignUpData,
  ): Promise<any> {
    const token = Math.floor(100000 + Math.random() * 900000).toString(); // six random code
    console.log(token);
    const user = await this.userRepository.findOne({where: {email: data.email}});
    if (user) {
      user.phoneVerificationToken = token;

      // update user object
      await this.userRepository.save(user)

      // send the token to the user's phone
      const body = `${data.app?.name}  verification code is  ${token}`;
      if (data.phone) {
        return {status: OPERATION_STATE.success};
      }
    }
    return {status: OPERATION_STATE.failed};
  }



  @post('/users/verifyPhone', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @logInvocation()
  async verifyPhone(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpData, {partial: true}),
        },
      },
    })
    data: SignUpData,
  ): Promise<any> {

    const user = await this.userRepository.findOne({where: {and: [{phoneVerificationToken: data.token}, {email: data.email}]}});
    if (user) {
      user.phoneVerificationToken = ''; // clear token
      user.phoneVerified = true;
      if (await this.userRepository.save(user))
        return {status: OPERATION_STATE.success};
    }

    return {status: OPERATION_STATE.failed};
  }


  @get('/users/{id}/delete', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {}},
      },
    },
  })
  async deleteUser(
    @param.path.string('id') id: typeof User.prototype.id
  ) {
    try {
      await this.userRepository.delete(new User({id}))
      return {status: OPERATION_STATE.success};
    } catch (error) {
      throw new HttpErrors.Forbidden('Deleting user failed');
    }
  }




}


