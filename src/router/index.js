import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/pages/PageHome'
import ThreadShow from '@/pages/PageThreadShow'
import Forum from '@/pages/PageForum'
import Category from '@/pages/PageCategory'
import Profile from '@/pages/PageProfile'
import ThreadCreate from '@/pages/PageThreadCreate'
import ThreadEdit from '@/pages/PageThreadEdit'
import Register from '@/pages/PageRegister'
import SignIn from '@/pages/PageSignIn'
import NotFound from '@/pages/PageNotFound'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    // The order of routes is important, if this routre was below /thread/:id it wouldn't work
    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: {edit: true},
      meta: {requiresAuth: true}
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {requiresGuest: true}
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: {requiresGuest: true}
    },
    {
      path: '/logout',
      name: 'SignOut',
      meta: {requiresAuth: true},
      beforeEnter (to, from, next) {
        store.dispatch('auth/signOut')
          .then(() => next({name: 'Home'}))
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  console.log(`🚦 navigating to ${to.name} from ${from.name}`)

  store.dispatch('auth/initAuthentication')
    .then(user => {
      // to check all nested routes if they require auth, for example if we have nester route under /me
      if (to.matched.some(route => route.meta.requiresAuth)) {
        if (user) {
          next()
        } else {
          next({name: 'SignIn', query: {redirectTo: to.path}})
        }
      } else if (to.matched.some(route => route.meta.requiresGuest)) {
        if (!user) {
          next()
        } else {
          next({name: 'Home'})
        }
      } else {
        next()
      }
    })
})
export default router
