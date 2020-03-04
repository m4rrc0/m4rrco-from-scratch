// import Home from './pages/Home'
// import About from './pages/About'
// import Template from './templates/index'

export default [
  {
    path: '/',
    name: 'Home',
    component: 'templates/index',
    data: {
      text: 'Home Page',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: 'templates/index',
    data: {
      text: 'About Page',
    },
  },
]
