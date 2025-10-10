<!-- 23c08dda-5023-4dd1-95c2-94ec9d9ac824 e57fd486-1dda-4505-9abf-762b7f3ff02d -->

# Refatoração Completa - Landing TicketPE

## Fase 1: Configuração e Segurança (Crítico)

### 1.1 Variáveis de Ambiente

- Criar `.env` com `VITE_STRAPI_TOKEN` e `VITE_API_BASE_URL`
- Criar `.env.example` como template
- Atualizar `.gitignore` para garantir que `.env` não seja commitado
- Modificar `src/boot/axios.js` para usar `import.meta.env.*`

### 1.2 Registrar Boot File

- Modificar `quasar.config.js` linha 14: `boot: ['axios']`
- Adicionar plugin Notify: `plugins: ['Notify']` (linha 94)

### 1.3 Arquivo de Constantes

- Criar `src/constants/config.js` com:
  - API_CONFIG (timeout, page sizes)
  - DEFAULT_IMAGES (placeholders)
  - CATEGORIES (array de categorias com tags)

## Fase 2: Refatoração de Código (Crítico)

### 2.1 Criar Utilitários Compartilhados

Criar `src/utils/eventMapper.js`:

- `toEventCard()` - transformação unificada
- `formatDate()` - formatação de datas
- `formatLocation()` - formatação de localização
- `resolveImage()` - resolução de imagens
- `extractMediaUrl()` - extração de URLs de mídia
- Helpers internos (extractTitle, extractDescription, etc)

### 2.2 Criar Composable useEvents

Criar `src/composables/useEvents.js`:

- `fetchEvents()` - busca genérica
- `fetchEventsByTag()` - busca por tag
- `fetchEventById()` - busca por ID
- Estados reativos: loading, error
- Cache simples com Map

### 2.3 Refatorar Páginas para Usar Utilitários

- **IndexPage.vue**: Remover 140+ linhas duplicadas, usar composable
- **EventDetailPage.vue**: Remover funções duplicadas, usar utils
- **ProgramacaoCompletaPage.vue**: Usar eventMapper

## Fase 3: Componentes Reutilizáveis

### 3.1 Componente EventCard

Criar `src/components/EventCard.vue`:

- Props: event, imageHeight, variant (carousel/grid)
- Emits: click
- Estilos consistentes reutilizáveis

### 3.2 Estados de Loading/Error

- Criar `src/components/LoadingState.vue`
- Criar `src/components/ErrorState.vue`
- Usar em todas as páginas

### 3.3 Atualizar EventSectionCarousel

- Usar novo componente EventCard internamente
- Simplificar código

## Fase 4: Tratamento de Erros Global

### 4.1 Interceptor Axios

Modificar `src/boot/axios.js`:

- Adicionar interceptor de resposta
- Tratar erros 401, 404, 500+
- Timeout handling
- Notificações Quasar automáticas

### 4.2 Página 404 em Português

Atualizar `src/pages/ErrorNotFound.vue`:

- Traduzir para português
- Usar cores do tema
- Melhorar UX

## Fase 5: Funcionalidades Principais

### 5.1 Busca Funcional

**MainLayout.vue:**

- Implementar debounce (300ms) no campo de busca
- Redirecionar para `/programacao?q=termo`

**ProgramacaoCompletaPage.vue:**

- Ler query param `q`
- Filtrar eventos por título/localização
- Mostrar mensagem "X resultados para 'termo'"
- Botão "Limpar busca"

### 5.2 Sistema de Filtros

Criar `src/components/CategoryFilter.vue`:

- Botões de categoria clicáveis
- State ativo visual
- Emite evento de filtro

Modificar **MainLayout.vue**:

- Botão "Filtros" abre drawer lateral
- Filtros: categorias, data, localização

### 5.3 Melhorias de Performance

- Adicionar `loading="lazy"` em todas as imagens
- Usar `Promise.all()` para chamadas paralelas em IndexPage
- Skeleton loaders durante carregamento

## Fase 6: SEO e Acessibilidade

### 6.1 Meta Tags

Atualizar `index.html`:

- Meta description otimizada
- Open Graph tags (Facebook)
- Twitter Card tags
- Canonical URL
- Lang="pt-BR"

### 6.2 Melhorias de Acessibilidade

- Adicionar `aria-labels` em botões de navegação
- Melhorar contraste de cores (verificar WCAG)
- Focus states visíveis em todos os elementos interativos
- Alt text descritivo em imagens

## Fase 7: Limpeza e Organização

### 7.1 Remover Arquivos Não Usados

Deletar:

- `_block.txt`
- `_ev_full.vue`
- `_ev_script.txt`
- `_script.txt`
- `src/components/EssentialLink.vue`

### 7.2 Padronização de Código

- Nomenclatura consistente (preferir português)
- Formatação com Prettier
- Lint sem erros

## Fase 8: Melhorias de UX

### 8.1 Feedback Visual

- Toast ao compartilhar evento
- Toast ao copiar link
- Loading states em botões de ação
- Transições suaves

### 8.2 Scroll Behavior

Atualizar `src/router/index.js`:

- Scroll to top em navegação
- Scroll suave para âncoras

### 8.3 Breadcrumbs

Criar `src/components/Breadcrumbs.vue`:

- Usar em EventDetailPage e ProgramacaoCompletaPage
- Navegação contextual

---

## Estrutura Final de Arquivos

```
src/
├── boot/
│   └── axios.js (refatorado)
├── components/
│   ├── Breadcrumbs.vue (novo)
│   ├── CategoryFilter.vue (novo)
│   ├── ErrorState.vue (novo)
│   ├── EventCard.vue (novo)
│   ├── EventSectionCarousel.vue (refatorado)
│   └── LoadingState.vue (novo)
├── composables/
│   └── useEvents.js (novo)
├── constants/
│   └── config.js (novo)
├── utils/
│   └── eventMapper.js (novo)
├── pages/
│   ├── ErrorNotFound.vue (refatorado)
│   ├── EventDetailPage.vue (refatorado)
│   ├── IndexPage.vue (refatorado)
│   └── ProgramacaoCompletaPage.vue (refatorado)
└── layouts/
    └── MainLayout.vue (refatorado)
```

---

## Checklist de Implementação

**Fase 1 (Crítico - 30min):**

- [ ] Criar .env e .env.example
- [ ] Atualizar axios.js
- [ ] Registrar boot file no quasar.config.js
- [ ] Criar constants/config.js

**Fase 2 (Crítico - 1h):**

- [ ] Criar utils/eventMapper.js
- [ ] Criar composables/useEvents.js
- [ ] Refatorar IndexPage.vue
- [ ] Refatorar EventDetailPage.vue
- [ ] Refatorar ProgramacaoCompletaPage.vue

**Fase 3 (Alta - 45min):**

- [ ] Criar EventCard.vue
- [ ] Criar LoadingState.vue
- [ ] Criar ErrorState.vue
- [ ] Atualizar EventSectionCarousel.vue

**Fase 4 (Alta - 20min):**

- [ ] Adicionar interceptor axios
- [ ] Atualizar ErrorNotFound.vue
- [ ] Configurar plugin Notify

**Fase 5 (Média - 1h):**

- [ ] Implementar busca com debounce
- [ ] Criar sistema de filtros
- [ ] Adicionar lazy loading
- [ ] Otimizar chamadas paralelas

**Fase 6 (Média - 30min):**

- [ ] Adicionar meta tags SEO
- [ ] Melhorar aria-labels
- [ ] Ajustar contraste de cores
- [ ] Focus states

**Fase 7 (Baixa - 10min):**

- [ ] Deletar arquivos não usados
- [ ] Rodar prettier
- [ ] Rodar lint --fix

**Fase 8 (Baixa - 30min):**

- [ ] Adicionar toasts de feedback
- [ ] Criar breadcrumbs
- [ ] Ajustar scroll behavior

---

## Tempo Estimado Total: 4-5 horas

## Benefícios Esperados:

- ✅ **-60% linhas de código duplicado**
- ✅ **+80% performance (lazy loading, cache)**
- ✅ **100% SEO coverage**
- ✅ **Manutenibilidade aumentada**
- ✅ **UX profissional**

### To-dos

- [ ] Criar .env, .env.example e atualizar axios.js
- [ ] Registrar boot file e plugin Notify no quasar.config.js
- [ ] Criar constants/config.js
- [ ] Criar utils/eventMapper.js com todas as funções compartilhadas
- [ ] Criar composables/useEvents.js
- [ ] Refatorar IndexPage.vue para usar composable e utils
- [ ] Refatorar EventDetailPage.vue
- [ ] Refatorar ProgramacaoCompletaPage.vue
- [ ] Criar componente EventCard.vue
- [ ] Criar LoadingState.vue e ErrorState.vue
- [ ] Atualizar EventSectionCarousel.vue para usar EventCard
- [ ] Adicionar interceptor de erros no axios.js
- [ ] Traduzir e melhorar ErrorNotFound.vue
- [ ] Implementar busca funcional com debounce
- [ ] Adicionar meta tags SEO no index.html
- [ ] Deletar arquivos não utilizados
- [ ] Adicionar lazy loading em imagens
- [ ] Otimizar chamadas com Promise.all
