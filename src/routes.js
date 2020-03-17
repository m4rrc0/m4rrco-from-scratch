// import Home from './pages/Home'
// import About from './pages/About'
// import Template from './templates/index'

export default [
  {
    path: '/tests/spa/one/',
    name: 'SPA: Test one',
    component: '_pages/tests/spa/index',
    props: {
      // url: "/tests/spa/one/" // automatically taken from path
    },
  },
  {
    path: '/tests/spa/',
    name: 'SPA: Page index',
    component: '_pages/tests/spa/index',
  },
  {
    path: '/',
    name: 'index',
    component: '_pages/index',
    options: { noJS: true },
  },
];
