import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior(to, from, savedPosition) {
      // Se estamos navegando para uma nova rota (não é um back/forward do browser),
      // sempre vai para o topo
      if (!savedPosition) {
        // Se tem hash, scrolla para o elemento
        if (to.hash) {
          // Reset manual do scroll em ambos os elementos (fix para mobile)
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              document.body.scrollTop = 0
              document.documentElement.scrollTop = 0
            }, 0)
          }
          return {
            el: to.hash,
            behavior: 'smooth',
            top: 80,
          }
        }
        // Caso contrário, vai para o topo
        // Reset manual do scroll em ambos os elementos (fix para mobile)
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
          }, 0)
        }
        return {
          left: 0,
          top: 0,
          behavior: 'instant', // Mudado de 'smooth' para 'instant' para melhor UX no mobile
        }
      }

      // Se é um back/forward do browser, restaura a posição salva
      return {
        ...savedPosition,
        behavior: 'smooth',
      }
    },
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  return Router
})
