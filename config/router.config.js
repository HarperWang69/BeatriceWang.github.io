/**
 * path 配置浏览器访问的页面链接，小驼峰命名
 * component 配置路由模块路径，大驼峰命名
 */ 
export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['','男','女'],
    routes: [
      { path: '/', redirect: '/account' },
      // {
      //   path: '/dashboard',
      //   name: '平台主页',
      //   icon: 'dashboard',
      //   component: './Dashboard/index',
      // },
      {
        path: '/account',
        name: '人员管理',
        icon: 'icon-account',
        component: './Account/Account',
      },
      {
        path: '/grid',
        name: '网格管理',
        icon: 'icon-grid',
        component: './Grid/Grid',
      },
      {
        path: '/event',
        name: '事件管理',
        icon: 'icon-event',
        component: './Event/Event',
      },
      {
        name: '异常页',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
        ],
      },
    ],
  },

];
