# ⚡ Quick Start - Área Admin (5 minutos)

Guia ultra rápido para colocar a área administrativa funcionando.

---

## 1️⃣ Criar Usuário Admin (2 min)

### No Supabase Dashboard:

1. **Authentication** > **Users** > **Add user**
2. Preencha:
   - Email: `seu@email.com`
   - Password: `suasenha123`
   - Auto Confirm: **Yes**
3. Clique no usuário criado > **User Metadata** > **Edit**
4. Cole e salve:
```json
{"role":"admin","is_admin":true}
```

---

## 2️⃣ Configurar Permissões (2 min)

### No Supabase Dashboard:

1. **SQL Editor** > **New query**
2. Copie TODO o conteúdo do arquivo `supabase_rls_policies.sql`
3. Cole e clique em **Run**
4. Aguarde o sucesso ✅

---

## 3️⃣ Testar (1 min)

### No terminal:
```bash
npm run dev
```

### No navegador:
1. Acesse: `http://localhost:9000/#/login`
2. Entre com o email/senha criado
3. Crie um evento de teste

---

## ✅ Pronto!

Área admin funcionando em: `http://localhost:9000/#/admin`

### 📖 Precisa de mais detalhes?

- **CHECKLIST_SUPABASE.md** - Checklist passo a passo
- **SUPABASE_AUTH_SETUP.md** - Guia completo
- **ADMIN_README.md** - Documentação da área admin

---

## 🆘 Não funcionou?

### Login não funciona
→ Verifique o metadata do usuário

### Não consegue criar eventos
→ Execute o script SQL novamente

### Outros problemas
→ Consulte `SUPABASE_AUTH_SETUP.md` seção Troubleshooting

