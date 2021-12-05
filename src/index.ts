import {ApplicationConfig, GradingSystemBackend} from './application';

export * from './application';
export async function main(options: ApplicationConfig = {}) {
  const app = new GradingSystemBackend(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

function getConfig(): ApplicationConfig {
  // Run the application
  let oauth2Providers;
  // console.log(process.env.OAUTH_PROVIDERS_LOCATION);
  if (process.env.OAUTH_PROVIDERS_LOCATION) {
    oauth2Providers = require(process.env.OAUTH_PROVIDERS_LOCATION);
  } else {
    oauth2Providers = require('@loopback/mock-oauth2-provider');
  }
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
    // apiExplorer: {
    //   disabled: true,
    // },
    facebookOptions: oauth2Providers['facebook-login'],
    googleOptions: oauth2Providers['google-login'],
    oauth2Options: oauth2Providers['oauth2'],
  };
  return config;
}

if (require.main === module) {

  main(getConfig()).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
