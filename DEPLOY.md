# Guia de Deploy - LandingTicket

Este documento contém instruções passo a passo para fazer deploy do projeto LandingTicket na Vercel.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Projeto configurado localmente
- Variáveis de ambiente do Supabase configuradas

## 🚀 Deploy na Vercel

### Opção 1: Deploy via Dashboard da Vercel (Recomendado)

1. **Acesse a Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub/GitLab/Bitbucket

2. **Importe o Projeto**
   - Clique em "Add New..." → "Project"
   - Selecione o repositório do LandingTicket
   - Clique em "Import"

3. **Configuração do Projeto**
   - **Framework Preset**: Deixe como "Other" ou "Vite"
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `npm install`

4. **Configurar Variáveis de Ambiente**
   - Na seção "Environment Variables", adicione:
     ```
     VITE_SUPABASE_URL=sua_url_do_supabase
     VITE_SUPABASE_KEY=sua_chave_anon_do_supabase
     ```
   - Clique em "Add" para cada variável
   - ⚠️ **Importante**: Certifique-se de usar o prefixo `VITE_` nas variáveis

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar (geralmente 2-5 minutos)

6. **Verificar Deploy**
   - Após o deploy, você receberá uma URL (ex: `landingticket.vercel.app`)
   - Teste a aplicação acessando a URL
   - Verifique se todas as funcionalidades estão funcionando

### Opção 2: Deploy via Vercel CLI

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login na Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Siga as instruções interativas
   - Quando solicitado, configure as variáveis de ambiente

4. **Deploy de Produção**
   ```bash
   vercel --prod
   ```

## 🔧 Configuração de Variáveis de Ambiente na Vercel

### Via Dashboard

1. Acesse o projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
4. Selecione os ambientes (Production, Preview, Development)
5. Clique em **Save**

### Via CLI

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_KEY
```

### Verificar Variáveis Configuradas

```bash
vercel env ls
```

## 🔍 Troubleshooting Comum

### Erro: "Variável de ambiente não está definida"

**Causa**: Variáveis de ambiente não configuradas ou com nome incorreto.

**Solução**:
1. Verifique se as variáveis estão configuradas na Vercel
2. Certifique-se de que usam o prefixo `VITE_`
3. Faça um novo deploy após adicionar as variáveis

### Erro: "Build failed"

**Causa**: Erros de build ou dependências faltando.

**Solução**:
1. Teste o build localmente: `npm run build`
2. Verifique os logs de build na Vercel
3. Certifique-se de que todas as dependências estão no `package.json`

### Erro: "404 Not Found" em rotas

**Causa**: Configuração de rewrites incorreta.

**Solução**:
1. Verifique se o arquivo `vercel.json` está na raiz do projeto
2. Confirme que o `outputDirectory` está correto (`dist/spa`)
3. Verifique se as rotas estão configuradas corretamente

### Página não carrega ou mostra erro

**Causa**: Problemas com variáveis de ambiente ou Supabase.

**Solução**:
1. Verifique se as variáveis de ambiente estão corretas
2. Teste a conexão com o Supabase
3. Verifique os logs do console do navegador
4. Confirme que as credenciais do Supabase estão corretas

### Build muito lento

**Causa**: Dependências grandes ou configuração não otimizada.

**Solução**:
1. Verifique se o cache está sendo usado
2. Considere usar `.vercelignore` para excluir arquivos desnecessários
3. Otimize as dependências (já configurado no projeto)

## ✅ Checklist Pré-Deploy

Antes de fazer o deploy, verifique:

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Arquivo `.env` não está commitado (está no `.gitignore`)
- [ ] Build local funciona: `npm run build`
- [ ] Arquivo `vercel.json` está na raiz do projeto
- [ ] Arquivo `robots.txt` está em `public/robots.txt`
- [ ] Meta tags estão usando o domínio de produção correto
- [ ] Código foi testado localmente
- [ ] Nenhum console.log de produção está ativo
- [ ] Imagens e assets estão otimizados
- [ ] SEO está configurado corretamente

## 📝 Comandos Úteis

```bash
# Build local
npm run build

# Testar build localmente
npx http-server dist/spa -p 8080

# Verificar variáveis de ambiente
vercel env ls

# Ver logs do deploy
vercel logs

# Fazer deploy de produção
vercel --prod

# Verificar configuração do projeto
vercel inspect
```

## 🔄 Atualizações e Re-deploy

Após fazer alterações no código:

1. **Commit e Push**
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push
   ```

2. **Deploy Automático**
   - Se configurado, a Vercel fará deploy automaticamente
   - Ou execute: `vercel --prod`

3. **Verificar Deploy**
   - Acompanhe o build na dashboard da Vercel
   - Teste a aplicação após o deploy

## 🌐 Domínios Personalizados

Para adicionar um domínio personalizado:

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Aguarde a verificação (pode levar algumas horas)

## 📚 Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Quasar Framework Docs](https://quasar.dev)
- [Vue.js Docs](https://vuejs.org)
- [Supabase Docs](https://supabase.com/docs)

## 🆘 Suporte

Se encontrar problemas não listados aqui:

1. Verifique os logs de build na Vercel
2. Consulte a documentação da Vercel
3. Verifique os issues do projeto no GitHub
4. Entre em contato com a equipe de desenvolvimento

---

**Última atualização**: Dezembro 2024

