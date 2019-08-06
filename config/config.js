import pageRouters from './router.config';

// ref: https://umijs.org/config/
export default {
  base: '',
  history: 'hash',
  publicPath: './',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'antdp',
        dll: false,
        hardSource: false,
        routes: {
          exclude: [/components/],
        },
      },
    ],
  ],
  routes: pageRouters,
};
