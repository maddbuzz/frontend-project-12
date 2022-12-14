const apiPath = '/api/v1';

export default {
  signupPath: () => [apiPath, 'signup'].join('/'),
  loginPath: () => [apiPath, 'login'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
};
