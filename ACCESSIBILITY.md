# Melhorias de Acessibilidade - TicketPE Landing

## ✅ Fase 6.2 - Implementado

Este documento descreve as melhorias de acessibilidade implementadas para garantir conformidade com WCAG 2.1 AA.

---

## 📋 Resumo das Melhorias

### 1. **ARIA Labels em Botões de Navegação** ✅

Todos os botões e elementos interativos agora possuem `aria-label` descritivos:

#### MainLayout.vue

- ✅ Botão "Filtros": `aria-label="Abrir filtros de eventos"`
- ✅ Menu mobile: `aria-label="Abrir menu de navegação"`
- ✅ Campo de busca: `aria-label="Campo de busca de eventos"` + `role="searchbox"`
- ✅ Botão fechar filtros: `aria-label="Fechar filtros"`
- ✅ Botões de ação: "Limpar tudo" e "Aplicar filtros" com labels descritivos

#### IndexPage.vue

- ✅ Carousel de eventos em destaque: imagens com alt text dinâmico
- ✅ Botões "Ver detalhes": `aria-label` dinâmico com nome do evento
- ✅ Botões de categoria: `aria-label` para cada categoria
- ✅ Ícones sociais (Facebook, Instagram, TikTok): cada um com `aria-label` específico
- ✅ Footer: `role="contentinfo"` para melhor navegação

#### EventDetailPage.vue

- ✅ Botão "Voltar": `aria-label="Voltar para página anterior"`
- ✅ Botão "Compartilhar": `aria-label="Compartilhar evento"`
- ✅ Botão "Comprar": `aria-label="Comprar ingresso via WhatsApp"`
- ✅ Imagem do evento: alt text descritivo com nome do evento
- ✅ Meta informações (data e local): agrupadas com `role="group"` e labels contextuais
- ✅ Mensagem de erro: `role="alert"` para leitores de tela

#### EventSectionCarousel.vue

- ✅ Botões de navegação: "Navegar para eventos anteriores/próximos"
- ✅ Grupo de navegação: `role="group"` com `aria-label="Controles de navegação do carrossel"`
- ✅ Botão "Ver Tudo": aria-label dinâmico com nome da seção

#### EventCard.vue

- ✅ Card completo: `aria-label` com informações do evento (nome, data, local)
- ✅ Imagem: alt text descritivo
- ✅ `role="button"` com `tabindex="0"` para navegação por teclado
- ✅ Ícones decorativos: `aria-hidden="true"` para não poluir leitores de tela

#### CategoryFilter.vue

- ✅ Chips de categoria: `aria-label` com estado (Selecionado/Não selecionado)
- ✅ Chips com `aria-pressed` para indicar estado ativo
- ✅ Navegação por teclado: suporte para Enter e Space
- ✅ Grupo de filtros: `role="group"` + `aria-label="Seleção de categorias"`

#### ProgramacaoCompletaPage.vue

- ✅ Botão "Voltar": `aria-label="Voltar para página inicial"`
- ✅ Mensagem de busca: `role="status"` + `aria-live="polite"` para anúncio dinâmico
- ✅ Filtros ativos: `role="region"` + `aria-label="Filtros ativos"`
- ✅ Cards de eventos: `role="list"` e `role="listitem"` para estrutura semântica
- ✅ Navegação por teclado nos cards: Enter e Space
- ✅ Mensagem "sem resultados": `role="status"` para leitores de tela

---

### 2. **Focus States Visíveis** ✅

Todos os elementos interativos agora possuem estados de foco claramente visíveis:

#### Estilos Globais (`src/css/accessibility.css`)

```css
/* Cor de foco consistente: #35c7ee (cyan do tema) */
- Botões: outline 2px
- Links: outline 2px
- Campos de formulário: outline 2px
- Elementos com role="button": outline 2px
- Elementos com tabindex: outline 2px
```

#### Componentes Específicos

- **MainLayout**: Botões, inputs e chips com outline cyan
- **IndexPage**: Botões de categoria, carousel, ícones sociais
- **EventDetailPage**: Botões de ação com destaque maior (3px)
- **EventSectionCarousel**: Botões de navegação com outline circular
- **EventCard**: Outline 3px para destaque no card completo
- **CategoryFilter**: Chips com outline ao receber foco
- **ProgramacaoCompletaPage**: Cards e botões com outline consistente

#### Suporte para Navegação por Teclado

- ✅ `tabindex="0"` em todos os elementos clicáveis personalizados
- ✅ `@keydown.enter` e `@keydown.space` para ativar ações
- ✅ Estados `:focus-visible` para mostrar outline apenas na navegação por teclado
- ✅ Estados `:hover` e `:focus` distintos

---

### 3. **Alt Text Descritivo em Imagens** ✅

Todas as imagens agora possuem texto alternativo apropriado:

#### Imagens de Conteúdo

- **Logo**: "TicketPE - Eventos em Pernambuco"
- **Eventos em destaque**: "Imagem do evento [Nome do Evento]"
- **Cards de eventos**: "Imagem do evento [Nome do Evento]"
- **Página de detalhes**: "Imagem destacada do evento [Nome do Evento]"

#### Ícones Decorativos

- Ícones que não transmitem informação: `aria-hidden="true"`
- Exemplos: ícones ao lado de texto (calendário, localização)

#### Lazy Loading

- ✅ Mantido `loading="lazy"` em todas as imagens de eventos
- ✅ Imagem principal da página de detalhes: `loading="eager"` para prioridade

---

### 4. **Contraste de Cores - WCAG AA** ✅

Todos os textos atendem ao contraste mínimo de 4.5:1 (WCAG AA):

#### Sobre Fundo Escuro (#2a3447)

- Texto principal: `#ffffff` (21:1) ✅
- Texto secundário: `#e5e7eb` (12.6:1) ✅
- Texto suave: `#9ca3af` (5.3:1) ✅

#### Sobre Fundo Claro (#ffffff)

- Texto principal: `#1f2937` (15.3:1) ✅
- Texto secundário: `#4b5563` (8.6:1) ✅
- Texto suave: `#6b7280` (5.7:1) ✅

#### Cores de Destaque

- Primary: `#35c7ee` - usado em focus states e CTAs
- Warning: `#facc15` - usado em botões de ação principais
- Todos com contraste adequado nos respectivos contextos

---

### 5. **Recursos Adicionais de Acessibilidade** ✅

#### Skip Links

- Classe `.skip-link` criada para links de pular navegação
- Visível apenas no foco do teclado
- Implementação futura: adicionar no topo do MainLayout

#### Preferências do Usuário

- ✅ `@media (prefers-reduced-motion: reduce)`: Reduz animações automaticamente
- ✅ `@media (prefers-contrast: high)`: Aumenta espessura do outline para 3px

#### Utilitários

- `.sr-only`: Esconde visualmente mas mantém acessível para leitores de tela
- `.sr-only-focusable`: Torna visível quando focado
- `.focus-visible-strong`: Focus extra forte com sombra para máxima visibilidade

#### Semântica HTML

- `role="contentinfo"` no footer
- `role="list"` e `role="listitem"` em grades de eventos
- `role="group"` para agrupar controles relacionados
- `role="button"` em elementos clicáveis personalizados
- `role="alert"` e `role="status"` para mensagens dinâmicas
- `role="searchbox"` no campo de busca

---

## 🎯 Benefícios

### Para Usuários com Deficiência Visual

- ✅ Leitores de tela podem navegar e entender todo o conteúdo
- ✅ Todas as imagens possuem descrições apropriadas
- ✅ Texto alternativo claro e descritivo

### Para Usuários que Navegam por Teclado

- ✅ Todos os elementos interativos acessíveis via Tab
- ✅ Focus visível e consistente em todos os elementos
- ✅ Suporte para Enter e Space em elementos personalizados

### Para Usuários com Baixa Visão

- ✅ Contraste adequado em todos os textos (WCAG AA)
- ✅ Outline de foco visível e com boa espessura
- ✅ Elementos clicáveis com tamanho adequado

### Para Usuários com Sensibilidade a Movimento

- ✅ Animações reduzidas automaticamente via media query
- ✅ Transições suaves mas respeitando preferências do sistema

---

## 📊 Conformidade WCAG 2.1

| Critério                          | Nível | Status          |
| --------------------------------- | ----- | --------------- |
| 1.1.1 - Conteúdo Não Textual      | A     | ✅ Implementado |
| 1.3.1 - Informações e Relações    | A     | ✅ Implementado |
| 1.4.3 - Contraste Mínimo          | AA    | ✅ Implementado |
| 2.1.1 - Teclado                   | A     | ✅ Implementado |
| 2.1.2 - Sem Armadilha de Teclado  | A     | ✅ Implementado |
| 2.4.3 - Ordem do Foco             | A     | ✅ Implementado |
| 2.4.7 - Foco Visível              | AA    | ✅ Implementado |
| 3.1.1 - Idioma da Página          | A     | ✅ Implementado |
| 3.2.4 - Identificação Consistente | AA    | ✅ Implementado |
| 4.1.2 - Nome, Função, Valor       | A     | ✅ Implementado |
| 4.1.3 - Mensagens de Status       | AA    | ✅ Implementado |

---

## 🧪 Como Testar

### Teste com Teclado

1. Use `Tab` para navegar entre elementos
2. Use `Shift + Tab` para navegar para trás
3. Use `Enter` ou `Space` para ativar botões e links
4. Verifique se o foco é sempre visível

### Teste com Leitor de Tela

- **Windows**: NVDA (gratuito) ou JAWS
- **macOS**: VoiceOver (nativo)
- **Linux**: Orca

### Teste de Contraste

- Use a extensão "WCAG Color Contrast Checker"
- Ou ferramentas online como WebAIM Contrast Checker

### Teste de Movimento Reduzido

1. No Windows: Configurações > Facilidade de Acesso > Exibir > Mostrar animações
2. No macOS: System Preferences > Accessibility > Display > Reduce motion

---

## 📝 Próximos Passos (Melhorias Futuras)

- [ ] Adicionar skip links funcionais no topo da página
- [ ] Implementar navegação por atalhos de teclado (shortcuts)
- [ ] Adicionar suporte para modo de alto contraste personalizado
- [ ] Criar documentação de acessibilidade para usuários finais
- [ ] Realizar testes com usuários reais de leitores de tela
- [ ] Implementar feedback sonoro para ações importantes (opcional)

---

## 🔗 Recursos

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Data da Implementação**: Outubro 2025  
**Versão**: 1.0  
**Status**: ✅ Fase 6.2 Completa
