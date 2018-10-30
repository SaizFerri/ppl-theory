import { variables } from './variables';

export const environment = {
  production: true,
  firebase: {
    apiKey: variables.apiKey,
    authDomain: variables.authDomain,
    databaseURL: variables.databaseURL,
    projectId: variables.projectId,
    storageBucket: variables.storageBucket,
    messagingSenderId: variables.messagingSenderId
  }
};
