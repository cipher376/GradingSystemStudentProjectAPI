import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

/***********Enable for remote server */
// const config = {
//   name: 'identityDb',
//   connector: 'mongodb',
//   url: 'mongodb://kejettia:' + encodeURIComponent('m^7W7dN#LPqE^*^F-z9beaKd_Ajj848x&sSn^^Fd') + '@172.18.0.2:27017/MainIdentityDb?authSource=admin&authMechanism=SCRAM-SHA-1',
// };


/**********Enable for local server***** */
const config = {
  name: 'identityDb',
  connector: 'mongodb',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'MainIdentityDb',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class IdentityDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'identityDb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.identityDb', {optional: true})
    dsConfig: object = config,
  ) {
    // console.log(dsConfig);
    super(dsConfig);
  }
}
