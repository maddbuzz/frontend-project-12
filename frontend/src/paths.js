const apiPath = '/api/v1';

export default {
  signupApiPath: () => [apiPath, 'signup'].join('/'),
  loginApiPath: () => [apiPath, 'login'].join('/'),
  dataApiPath: () => [apiPath, 'data'].join('/'),
  chatPagePath: () => '/',
  loginPagePath: () => '/login',
  signupPagePath: () => '/signup',
};
