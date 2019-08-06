import fetch from 'dva/fetch';
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

let authRoutes = null;

function ergodicRoutes(routes, authKey, authority) {
  routes.forEach(element => {
    if (element.path === authKey) {
      Object.assign(element.authority, authority || []);
    } else if (element.routes) {
      ergodicRoutes(element.routes, authKey, authority);
    }
    return element;
  });
}

export function patchRoutes(routes) {
  Object.keys(authRoutes).map(authKey =>
    ergodicRoutes(routes, authKey, authRoutes[authKey].authority)
  );
  window.g_routes = routes;
}

export function render(oldRender) {
  authRoutes = {};
  oldRender();
}
// export function render(oldRender) {
//   setTimeout(() => {
//     authRoutes = {'/form/advanced-form': { authority: ['admin', 'user'] }};
//     oldRender();
//   },0)
// }