<template>
  <div class="flex flex-center bg-grey-1" style="min-height: 100vh">
    <div class="q-pa-md" style="width: 100%; max-width: 400px">
      <q-card class="q-pa-lg">
        <q-card-section class="text-center">
          <div class="text-h4 q-mb-md">Área Administrativa</div>
          <div class="text-subtitle2 text-grey-7">Faça login para continuar</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleLogin" class="q-gutter-md">
            <q-input
              v-model="email"
              type="email"
              label="Email"
              outlined
              :rules="[val => !!val || 'Email é obrigatório', val => /.+@.+\..+/.test(val) || 'Email inválido']"
              :disable="loading"
              autofocus
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="Senha"
              outlined
              :rules="[val => !!val || 'Senha é obrigatória']"
              :disable="loading"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div v-if="error" class="text-negative q-mt-sm">
              {{ error }}
            </div>

            <div class="row justify-center q-mt-lg">
              <q-btn
                type="submit"
                label="Entrar"
                color="primary"
                size="lg"
                :loading="loading"
                :disable="loading"
                style="min-width: 200px"
              />
            </div>

            <div class="row justify-center q-mt-md">
              <q-btn
                flat
                label="Voltar para o site"
                color="grey"
                @click="$router.push('/')"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from 'src/composables/useAuth'

const router = useRouter()
const { login, loading, error, isAuthenticated, checkAdminPermission } = useAuth()

const email = ref('')
const password = ref('')
const isPwd = ref(true)

onMounted(async () => {
  // Se já estiver autenticado e for admin, redireciona para home
  if (isAuthenticated.value) {
    const hasPermission = await checkAdminPermission()
    if (hasPermission) {
      router.push('/')
    }
  }
})

async function handleLogin() {
  try {
    await login(email.value, password.value)
    // Redireciona para a home ao invés de /admin
    router.push('/')
  } catch (err) {
    // Erro já é tratado no composable
    console.error('Erro no login:', err)
  }
}
</script>

<style scoped>
.q-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
</style>
