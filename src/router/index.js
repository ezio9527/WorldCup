import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/home/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'all',
          name: 'all',
          component: () => import('@views/home/all/IndexView.vue')
        },
        {
          path: 'progress',
          name: 'progress',
          component: () => import('@views/home/progress/IndexView.vue')
        },
        {
          path: 'end',
          name: 'end',
          component: () => import('@views/home/end/IndexView.vue')
        },
        {
          path: 'record',
          name: 'record',
          component: () => import('@views/home/record/IndexView.vue')
        },
        {
          path: 'wallet',
          name: 'wallet',
          component: () => import('@views/home/wallet/IndexView.vue')
        }
      ]
    },
    {
      path: '/bet',
      name: 'bet',
      component: () => import('@views/bet/IndexView.vue'),
      props: (route) => ({
        distance: {
          id: route.query.id,
          aTeamName: route.query.a,
          bTeamName: route.query.b,
          time: route.query.t
        }
      })
    },
    {
      // 404
      path: '/:pathMatch(.*)*',
      redirect: '/home/today'
    }
  ]
})

export default router
