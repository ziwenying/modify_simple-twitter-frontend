import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import UserFollowList from '../views/UserFollowList.vue'
import User from '../views/User.vue'
import NotFound from '../views/NotFound.vue'
import store from './../store'
import { Toast } from './../utils/helpers'
import cookies from "vue-cookies";


Vue.use(VueRouter)

const authorizeIsAdmin = (to, from, next) => {
  const currentUser = store.state.currentUser
  if (currentUser && currentUser.role !== 'admin') {
    next('not-found')
    return
  }
  next()
}


const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LogIn.vue')
  },
  {
    path: '/signup',
    name: 'sign-up',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/users/:id/edit',
    name: 'setting',
    component: () => import('../views/Setting.vue'),
  },
  {
    path: '/main/',
    name: 'main',
    redirect: '/main/mainpage',
    component: Main,
    children: [
      {
        name: 'main-page',
        path: 'mainpage',
        component: () => import('../views/MainPage'),
      },
      {
        name: 'reply-list',
        path: 'replylist/:id',
        component: () => import('../views/ReplyList'),
      },
    ]
  },
  {
    path: '/users/:id/followlist/',
    name: 'user-follow-list',
    redirect: '/users/:id/followlist/followers',
    component: UserFollowList,
    children: [
      {
        name: 'user-followers',
        path: 'followers',
        component: () => import('../views/UserFollowers'),
      },
      {
        name: 'user-followings',
        path: 'followings',
        component: () => import('../views/UserFollowings'),
      },
    ]
  },
  {
    path: '/users/:id',
    name: 'user',
    redirect: '/users/:id/tweets',
    component: User,
    children: [
      {
        name: 'main-tweets',
        path: 'tweets',
        component: () => import('../views/MainTweets'),
      },
      {
        name: 'replies',
        path: 'replies',
        component: () => import('../views/Replies'),
      },
      {
        name: 'liked-tweets',
        path: 'liked',
        component: () => import('../views/likedTweets'),
      },
    ]
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/AdminLogin.vue')
  },
  {
    path: '/admin/tweets',
    name: 'admin-tweets',
    component: () => import('../views/AdminTweets.vue'),
    beforeEnter: authorizeIsAdmin  // 進入前驗證是否為管理員, 不是就直接導向not-found
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/AdminUsers.vue'),
    beforeEnter: authorizeIsAdmin
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]

const router = new VueRouter({
  routes
})

// get currentUser
router.beforeEach(async (to, from, next) => {
  // get token from cookie
  const token = cookies.get('token');
  // these pages don't need authenticated
  const pathWithoutAuthenticated = ['login', 'admin-login', 'sign-up']

  if (!token && !pathWithoutAuthenticated.includes(to.name)) {
    next('/login')
    return
  }
  // admin can visit
  const adminCanVisit = ['admin-tweets', 'admin-users', 'login', 'admin-login', 'sign-up']
  if (token) {
    // use dispatch call Vuex(function in actions)
    let { isAuthenticated, role } = await store.dispatch('fetchCurrentUser')

    if (isAuthenticated && role === 'user') {
      // authenticated fail
      if (!isAuthenticated && to.name !== 'login') {
        Toast.fire({
          icon: 'warning',
          title: '請先進行登入'
        })
        next('/login')
        return
      } else if (isAuthenticated && to.name === 'login' || isAuthenticated && to.name === 'sign-up') {
        // authenticated success
        next('/main/mainpage')
        return
      }
    } else if (isAuthenticated && role === 'admin') {
      // authenticated fail
      if (!isAuthenticated && to.name !== 'admin-login') {
        Toast.fire({
          icon: 'warning',
          title: '請先進行登入'
        })
        next('/admin/login')
        return
      } else if (isAuthenticated && to.name === 'admin-login') {
        // authenticated success
        next('/admin/tweets')
        return
      } else if (isAuthenticated && !adminCanVisit.includes(to.name)) {
        Toast.fire({
          icon: 'warning',
          title: '您無權訪問此頁面，請登入'
        })
        next('/login')
      }
    }
  }
  next()
})

// get topPopular
router.beforeEach(async (to, from, next) => {
  // pages need topPopular
  const needTopPopular = ['main-page', 'reply-list', 'user-followers', 'user-followings', 'main-tweets', 'replies', 'liked-tweets']
  // get token from cookie
  const token = cookies.get('token');
  if (token) {
    let { role } = await store.dispatch('fetchCurrentUser')
    if (role === 'user' && needTopPopular.includes(to.name)) {
      await store.dispatch('fetchPopular')
    }
  }
  next()
})

export default router
