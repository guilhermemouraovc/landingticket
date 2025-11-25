import { ref, computed } from 'vue'
import { supabase } from 'src/utils/supabase'
import { useQuasar } from 'quasar'

// Singleton state - shared across all useAuth() calls
const user = ref(null)
const loading = ref(false)
const error = ref(null)

// Track initialization to avoid duplicate listeners
let isInitialized = false
let initPromise = null

export function useAuth() {
  const $q = useQuasar()
  
  // Função helper para navegação segura
  // Usa window.location para garantir que sempre funciona, mesmo durante inicialização do router
  function navigateTo(path) {
    // Usa window.location que sempre funciona, independente do estado do router
    if (typeof window !== 'undefined') {
      window.location.href = `/#${path}`
    }
  }

  // Verifica se o usuário está autenticado
  const isAuthenticated = computed(() => !!user.value)

  // Verifica se o usuário é admin
  // Você pode verificar através de metadata do usuário ou uma tabela de roles
  const isAdmin = computed(() => {
    if (!user.value) return false
    // Opção 1: Verificar metadata do usuário
    const userMetadata = user.value.user_metadata || {}
    return userMetadata.role === 'admin' || userMetadata.is_admin === true
    
    // Opção 2: Se você tiver uma tabela de usuários, faça uma query aqui
    // return checkUserRole(user.value.id)
  })

  // Inicializa a sessão atual (singleton - only runs once)
  async function initSession() {
    // If already initialized, return immediately
    if (isInitialized) {
      return
    }
    
    // If initialization is in progress, wait for it
    if (initPromise) {
      return initPromise
    }
    
    // Start initialization
    initPromise = (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        user.value = session?.user || null
        
        // Register listener only once
        supabase.auth.onAuthStateChange((_event, session) => {
          user.value = session?.user || null
        })
        
        isInitialized = true
      } catch (err) {
        console.error('Erro ao inicializar sessão:', err)
        error.value = 'Erro ao verificar autenticação'
        // Reset so it can be retried
        initPromise = null
        throw err
      }
    })()
    
    return initPromise
  }
  
  // Get current session without re-initializing
  // Used by navigation guards to check auth state
  async function getSession() {
    // If already initialized, use cached state
    if (isInitialized) {
      return user.value
    }
    
    // Otherwise, initialize first
    await initSession()
    return user.value
  }

  // Login com email e senha
  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const { data, error: e } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (e) throw e

      user.value = data.user

      // Verifica se é admin
      if (!isAdmin.value) {
        await logout()
        throw new Error('Acesso negado. Apenas administradores podem acessar.')
      }

      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!',
        position: 'top',
      })

      return data
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer login'
      error.value = errorMessage
      $q.notify({
        type: 'negative',
        message: errorMessage,
        position: 'top',
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  async function logout() {
    loading.value = true
    try {
      const { error: e } = await supabase.auth.signOut()
      if (e) throw e

      user.value = null
      
      $q.notify({
        type: 'info',
        message: 'Logout realizado com sucesso',
        position: 'top',
      })

      navigateTo('/login')
    } catch (err) {
      error.value = err.message || 'Erro ao fazer logout'
      $q.notify({
        type: 'negative',
        message: error.value,
        position: 'top',
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  // Verifica se o usuário tem permissão de admin
  // Retorna true/false sem navegar (a navegação é feita pelo navigation guard)
  async function checkAdminPermission() {
    if (!user.value) {
      return false
    }

    if (!isAdmin.value) {
      $q.notify({
        type: 'negative',
        message: 'Acesso negado. Apenas administradores podem acessar esta área.',
        position: 'top',
      })
      return false
    }

    return true
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    initSession,
    getSession,
    login,
    logout,
    checkAdminPermission,
  }
}
