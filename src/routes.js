// import Home from './pages/Home'
// import About from './pages/About'
// import Template from './templates/index'

export default [
  {
    path: '/',
    name: 'Home',
    component: 'pages/index',
    data: {
      url: '/',
      text: 'Home Page',
    },
  },
  {
    path: '/about/',
    name: 'About',
    component: 'pages/index',
    data: {
      url: '/about/',
      text: 'About Page',
    },
  },
]
