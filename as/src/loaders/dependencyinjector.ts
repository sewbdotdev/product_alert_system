import { Container } from 'typedi';
import { cacheConnection } from './cache'

export default () => {
  try {
    Container.set('cacheConnection', cacheConnection)
  } catch (e) {
    console.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
