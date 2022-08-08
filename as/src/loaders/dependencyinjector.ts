import { Container } from 'typedi';
import { cacheConnection } from './cache'
import defaultEmailClient from './emailClient';

export default () => {
  try {
    Container.set('cacheConnection', cacheConnection)
    Container.set('defaultEmailClient', defaultEmailClient)
    return
  } catch (e) {
    console.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
