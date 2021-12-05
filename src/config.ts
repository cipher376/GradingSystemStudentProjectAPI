import path from 'path';
import {ApplicationConfig} from '.';

const originsWhitelist = [
  'http://localhost:8100',      //this is my front-end url for development
  'http://localhost',      //this is my front-end url for development
  'http://localhost:42001',      //this is my front-end url for development
  'https://localhost:8100',      //this is my front-end url for development
  'https://localhost',      //this is my front-end url for development
  '*'
];


export const APP_CONFIG: ApplicationConfig =
{
  fileStorageDirectory: path.join(__dirname, '../files'),
  rest: {
    port: +(process.env.PORT ?? 3001),
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
  cors: {
    origin: (origin: string, callback: any) => {
      const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
      callback(null, isWhitelisted);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    optionsSuccessStatus: 204,
    maxAge: 86400,
    credentials: true,
    exposedHeaders: ['Content-Length', 'Cache-Control', 'Content-Language', 'Content-Type', 'Expires',
      'Last-Modified', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Credentials']
  }
};


export const PASSWORD_MINIMUM_LENGTH = 8;
export const PASSWORD_MAXIMUM_LENGTH = 50;



