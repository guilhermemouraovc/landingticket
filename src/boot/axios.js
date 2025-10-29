import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'
import { API_CONFIG, ERROR_MESSAGES } from 'src/constants/config'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-type': 'application/json',
  },
})
//INTERCEPTADOR DE RESPOSTA
api.interceptors.request.use(
  //SUCESSO
  (response) => response,
  //ERRO
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.error?.message || error.message
    const config = error?.config

    if (import.meta.env.DEV) {
      console.group('Erro na requisição')
      console.error('Status:', status)
      console.error('Mensagem: ', message)
      console.error('URL:', config?.url)
      console.error('Erro completo:', error)
      console.groupEnd()
    }

    let notificationMessage = ERROR_MESSAGES.generic
    let notificationColor = 'negative'
    let notificationIcon = 'error'

    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        notificationMessage = ERROR_MESSAGES.timeout
        notificationIcon = 'access_time'
      } else {
        notificationMessage = ERROR_MESSAGES.networkError
        notificationIcon = 'wifi_off'
      }
    } else {
      switch (status) {
        case 400:
          notificationMessage = 'Requisição inválida. Verifique os dados enviados.'
          break

        case 401:
          notificationMessage = ERROR_MESSAGES.unauthorized
          notificationIcon = 'lock'
          break

        case 403:
          notificationMessage = 'Você não tem permissão para acessar este recurso.'
          notificationIcon = 'block'
          break

        case 404:
          notificationMessage = ERROR_MESSAGES.notFound
          notificationIcon = 'block'
          break

        case 408:
          notificationMessage = ERROR_MESSAGES.timeout
          notificationIcon = 'access_time'
          break

        case 429:
          notificationMessage = 'Muitas requisições. Aguarde um momento e tente novamente.'
          notificationIcon = 'warning'
          notificationColor = 'warning'
          break

        case 500:
        case 502:
        case 503:
        case 504:
          notificationMessage = ERROR_MESSAGES.serverError
          notificationIcon = 'cloud_off'
          break

        default:
          notificationMessage = message || ERROR_MESSAGES.generic
      }
    }

    if (!config?.silent) {
      Notify.create({
        type: notificationColor,
        message: notificationMessage,
        icon: notificationIcon,
        position: 'top',
        timeout: 4000,
        actions: [
          {
            label: 'Fechar',
            color: 'white',
            handler: () => {},
          },
        ],
      })
    }
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

  app.config.globalProperties.$notify = Notify
})

export { axios, api }
