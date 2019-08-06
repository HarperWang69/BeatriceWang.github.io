import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/user",
    "redirect": "/user/login",
    "exact": true,
    "_title": "antdp",
    "_title_default": "antdp"
  },
  {
    "path": "/",
    "redirect": "/account",
    "exact": true,
    "_title": "antdp",
    "_title_default": "antdp"
  },
  {
    "path": "/user",
    "component": require('../../layouts/UserLayout').default,
    "routes": [
      {
        "path": "/user/login",
        "component": require('../User/Login').default,
        "exact": true,
        "_title": "antdp",
        "_title_default": "antdp"
      },
      {
        "component": () => React.createElement(require('C:/Users/admin/Desktop/SVN/TBH/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true }),
        "_title": "antdp",
        "_title_default": "antdp"
      }
    ],
    "_title": "antdp",
    "_title_default": "antdp"
  },
  {
    "path": "/",
    "component": require('../../layouts/BasicLayout').default,
    "Routes": [require('../Authorized').default],
    "authority": [
      "",
      "男",
      "女"
    ],
    "routes": [
      {
        "path": "/account",
        "name": "人员管理",
        "icon": "icon-account",
        "component": require('../Account/Account').default,
        "exact": true,
        "_title": "antdp",
        "_title_default": "antdp"
      },
      {
        "path": "/grid",
        "name": "网格管理",
        "icon": "icon-grid",
        "component": require('../Grid/Grid').default,
        "exact": true,
        "_title": "antdp",
        "_title_default": "antdp"
      },
      {
        "path": "/event",
        "name": "事件管理",
        "icon": "icon-event",
        "component": require('../Event/Event').default,
        "exact": true,
        "_title": "antdp",
        "_title_default": "antdp"
      },
      {
        "name": "异常页",
        "icon": "warning",
        "path": "/exception",
        "hideInMenu": true,
        "routes": [
          {
            "path": "/exception/403",
            "name": "not-permission",
            "component": require('../Exception/403').default,
            "exact": true,
            "_title": "antdp",
            "_title_default": "antdp"
          },
          {
            "path": "/exception/404",
            "name": "not-find",
            "component": require('../Exception/404').default,
            "exact": true,
            "_title": "antdp",
            "_title_default": "antdp"
          },
          {
            "path": "/exception/500",
            "name": "server-error",
            "component": require('../Exception/500').default,
            "exact": true,
            "_title": "antdp",
            "_title_default": "antdp"
          },
          {
            "component": () => React.createElement(require('C:/Users/admin/Desktop/SVN/TBH/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true }),
            "_title": "antdp",
            "_title_default": "antdp"
          }
        ],
        "_title": "antdp",
        "_title_default": "antdp"
      },
      {
        "component": () => React.createElement(require('C:/Users/admin/Desktop/SVN/TBH/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true }),
        "_title": "antdp",
        "_title_default": "antdp"
      }
    ],
    "_title": "antdp",
    "_title_default": "antdp"
  },
  {
    "component": () => React.createElement(require('C:/Users/admin/Desktop/SVN/TBH/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true }),
    "_title": "antdp",
    "_title_default": "antdp"
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
