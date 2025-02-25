export const Routes = {
  SITE: {
    HOME: '/',
    POST: '/quiz/',
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    USERS: '/users/',
    _500: '/500/',
  },
  API: {
    USERS: '/api/users/',
  },
} as const;

// ----------- redirects getServerSideProps

export const Redirects = {
  NOT_FOUND: {
    notFound: true,
  },
  _500: {
    redirect: {
      permanent: false,
      destination: Routes.SITE._500,
    },
  },
  LOGIN: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.LOGIN,
    },
  },
  HOME: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.HOME,
    },
  },
} as const;
