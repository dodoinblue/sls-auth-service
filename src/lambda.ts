import serverless, { Handler } from 'serverless-http';
import server from './app';

export const handler = async (evt, ctx, callback) => {
  const app = await server;
  const wrapper = serverless(app);
  return wrapper(evt, ctx);
};
