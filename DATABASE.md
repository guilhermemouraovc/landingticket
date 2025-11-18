# Documentação do Banco de Dados

Este documento descreve a estrutura do banco de dados utilizado pela plataforma LandingTicket, hospedado no Supabase.

## 📋 Visão Geral

O banco de dados é composto por 4 tabelas principais que gerenciam eventos, tags, imagens e seus relacionamentos:

- **events** - Armazena informações dos eventos
- **tags** - Armazena categorias/tags para classificação de eventos
- **event_tags** - Tabela de relacionamento muitos-para-muitos entre eventos e tags
- **event_images** - Armazena imagens associadas aos eventos

## 📊 Diagrama de Relacionamentos

```markdown:/Users/guilhermemourao/Desktop/landing-ticket/landingticket/DATABASE.md
<code_block_to_apply_changes_from>
```

events (1) ────< (N) event_tags (N) >─── (1) tags
│
│ (1)
│
└───< (N) event_images

````

## 📑 Tabelas

### 1. `events`

Tabela principal que armazena todas as informações dos eventos.

#### Campos

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | `uuid` | Identificador único do evento | PRIMARY KEY, DEFAULT `gen_random_uuid()` |
| `title` | `text` | Título do evento | NOT NULL |
| `description` | `text` | Descrição completa do evento | NULL |
| `highlight` | `text` | Campo para marcar eventos em destaque (ex: "sim", "SIM", "true", "1") | NULL |
| `additional_info` | `text` | Informações adicionais sobre o evento | NULL |
| `start_date` | `timestamp with time zone` | Data e hora de início do evento | NULL |
| `end_date` | `timestamp with time zone` | Data e hora de término do evento | NULL |
| `location` | `text` | Local do evento (endereço específico) | NULL |
| `city` | `text` | Cidade onde o evento ocorre | NULL |
| `state` | `text` | Estado onde o evento ocorre | NULL |
| `whatsapp` | `text` | Número de WhatsApp para contato | DEFAULT `'+5581998471385'` |
| `whatsapp_message` | `text` | Mensagem padrão para WhatsApp | NULL |
| `share_url` | `text` | URL para compartilhamento do evento | NULL |
| `price` | `numeric` | Preço do ingresso | NULL |
| `price_installments` | `integer` | Número de parcelas disponíveis | NULL |
| `installment_value` | `numeric` | Valor de cada parcela | NULL |
| `currency` | `character varying` | Moeda (padrão: BRL) | DEFAULT `'BRL'` |
| `created_at` | `timestamp with time zone` | Data de criação do registro | DEFAULT `now()` |
| `updated_at` | `timestamp with time zone` | Data da última atualização | DEFAULT `now()` |

#### Observações

- O campo `highlight` é usado para identificar eventos em destaque na homepage
- O campo `whatsapp` tem um valor padrão, mas pode ser sobrescrito por evento
- Datas podem ser nulas para eventos sem data definida
- Preços são opcionais e podem incluir informações de parcelamento

#### Exemplo de Uso

```sql
-- Buscar eventos em destaque
SELECT * FROM events
WHERE highlight IN ('sim', 'SIM', 'true', '1')
ORDER BY start_date ASC;

-- Buscar eventos futuros
SELECT * FROM events
WHERE start_date >= CURRENT_DATE
ORDER BY start_date ASC;
````

---

### 2. `tags`

Tabela que armazena as categorias/tags utilizadas para classificar eventos.

#### Campos

| Campo        | Tipo                       | Descrição                                              | Constraints                              |
| ------------ | -------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| `id`         | `uuid`                     | Identificador único da tag                             | PRIMARY KEY, DEFAULT `gen_random_uuid()` |
| `name`       | `text`                     | Nome da tag (ex: "Carnaval", "Reveillon", "Festivais") | NOT NULL, UNIQUE                         |
| `slug`       | `text`                     | Slug da tag para URLs (ex: "carnaval", "reveillon")    | NOT NULL, UNIQUE                         |
| `created_at` | `timestamp with time zone` | Data de criação do registro                            | DEFAULT `now()`                          |

#### Observações

- Tanto `name` quanto `slug` são únicos
- O `slug` é usado para URLs amigáveis e filtros
- Tags comuns incluem: Carnaval, Reveillon, Festivais, São João, Open Bar, etc.

#### Exemplo de Uso

```sql
-- Listar todas as tags
SELECT * FROM tags ORDER BY name ASC;

-- Buscar tag por slug
SELECT * FROM tags WHERE slug = 'carnaval';
```

---

### 3. `event_tags`

Tabela de relacionamento muitos-para-muitos entre eventos e tags. Permite que um evento tenha múltiplas tags e uma tag seja associada a múltiplos eventos.

#### Campos

| Campo      | Tipo   | Descrição    | Constraints                             |
| ---------- | ------ | ------------ | --------------------------------------- |
| `event_id` | `uuid` | ID do evento | PRIMARY KEY, FOREIGN KEY → `events(id)` |
| `tag_id`   | `uuid` | ID da tag    | PRIMARY KEY, FOREIGN KEY → `tags(id)`   |

#### Observações

- Chave primária composta por `(event_id, tag_id)`
- Garante que um evento não tenha a mesma tag duplicada
- Permite relacionamento muitos-para-muitos

#### Exemplo de Uso

```sql
-- Buscar todas as tags de um evento
SELECT t.* FROM tags t
INNER JOIN event_tags et ON t.id = et.tag_id
WHERE et.event_id = 'uuid-do-evento';

-- Buscar todos os eventos de uma tag
SELECT e.* FROM events e
INNER JOIN event_tags et ON e.id = et.event_id
WHERE et.tag_id = 'uuid-da-tag';
```

---

### 4. `event_images`

Tabela que armazena imagens associadas aos eventos.

#### Campos

| Campo         | Tipo                       | Descrição                                | Constraints                              |
| ------------- | -------------------------- | ---------------------------------------- | ---------------------------------------- |
| `id`          | `uuid`                     | Identificador único da imagem            | PRIMARY KEY, DEFAULT `gen_random_uuid()` |
| `event_id`    | `uuid`                     | ID do evento ao qual a imagem pertence   | FOREIGN KEY → `events(id)`               |
| `url`         | `text`                     | URL da imagem                            | NOT NULL                                 |
| `alt_text`    | `text`                     | Texto alternativo para acessibilidade    | NULL                                     |
| `is_primary`  | `boolean`                  | Indica se é a imagem principal do evento | DEFAULT `false`                          |
| `order_index` | `integer`                  | Ordem de exibição das imagens            | DEFAULT `0`                              |
| `image_type`  | `text`                     | Contexto de uso da imagem: 'card', 'detail', ou 'both' | NULL                          |
| `created_at`  | `timestamp with time zone` | Data de criação do registro              | DEFAULT `now()`                          |

#### Observações

- Um evento pode ter múltiplas imagens
- A imagem com `is_primary = true` é usada como imagem principal
- Se não houver imagem primária, a primeira imagem disponível é usada
- O `order_index` permite ordenar as imagens
- O `alt_text` é importante para acessibilidade (WCAG 2.1)
- O `image_type` permite definir onde a imagem será exibida:
  - `'card'`: Apenas nos cards de carrossel
  - `'detail'`: Apenas na página de detalhes do evento
  - `'both'` ou `NULL`: Em ambos os contextos (padrão para compatibilidade)

#### Exemplo de Uso

```sql
-- Buscar imagem principal de um evento
SELECT * FROM event_images
WHERE event_id = 'uuid-do-evento'
  AND is_primary = true
LIMIT 1;

-- Buscar todas as imagens de um evento ordenadas
SELECT * FROM event_images
WHERE event_id = 'uuid-do-evento'
ORDER BY is_primary DESC, order_index ASC;

-- Buscar primeira imagem disponível (primária ou não)
SELECT * FROM event_images
WHERE event_id = 'uuid-do-evento'
ORDER BY is_primary DESC, order_index ASC, created_at ASC
LIMIT 1;

-- Buscar imagem para usar em cards (carrossel)
SELECT * FROM event_images
WHERE event_id = 'uuid-do-evento'
  AND (image_type = 'card' OR image_type = 'both' OR image_type IS NULL)
  AND is_primary = true
LIMIT 1;

-- Buscar imagem para usar na página de detalhes
SELECT * FROM event_images
WHERE event_id = 'uuid-do-evento'
  AND (image_type = 'detail' OR image_type = 'both' OR image_type IS NULL)
  AND is_primary = true
LIMIT 1;
```

---

## 🔗 Relacionamentos

### Events → Event Tags → Tags

- Um evento pode ter **múltiplas tags** (relacionamento muitos-para-muitos)
- Uma tag pode estar associada a **múltiplos eventos**
- Relacionamento através da tabela `event_tags`

### Events → Event Images

- Um evento pode ter **múltiplas imagens**
- Uma imagem pertence a **um único evento**
- Relacionamento um-para-muitos

## 🔍 Views (Supabase)

O projeto utiliza views do Supabase para otimizar consultas:

### `view_event_cards`

View que agrega dados de eventos para exibição em cards, incluindo:

- Dados do evento
- Imagem principal (`image_url`)
- Tags associadas

### `view_events_by_tag`

View que facilita a busca de eventos por tag, retornando:

- `event_id` - ID do evento
- `tag_name` - Nome da tag

## 📝 Convenções e Boas Práticas

### Datas

- Use `timestamp with time zone` para garantir consistência entre fusos horários
- Sempre defina `start_date` quando possível
- `end_date` é opcional (eventos de um dia só)

### Preços

- Use `numeric` para precisão decimal
- Se `price` for definido, considere preencher `price_installments` e `installment_value`
- Moeda padrão é BRL (Real Brasileiro)

### Imagens

- Sempre defina uma imagem primária (`is_primary = true`) quando possível
- Use `alt_text` para melhorar acessibilidade
- Ordene imagens usando `order_index`
- Use `image_type` para definir contextos específicos:
  - `'card'`: Imagem otimizada para visualização em cards/carrosséis (menor, mais larga)
  - `'detail'`: Imagem otimizada para página de detalhes (maior resolução, mais alta)
  - `'both'` ou `NULL`: Serve para ambos os contextos (recomendado para compatibilidade)

### Tags

- Use slugs em minúsculas e com hífens (ex: "sao-joao", "open-bar")
- Mantenha nomes de tags consistentes
- Um evento pode ter múltiplas tags para melhor categorização

## 🚀 Queries Comuns

### Buscar eventos com todas as informações

```sql
SELECT
  e.*,
  COALESCE(
    (SELECT url FROM event_images
     WHERE event_id = e.id AND is_primary = true
     LIMIT 1),
    (SELECT url FROM event_images
     WHERE event_id = e.id
     ORDER BY order_index ASC
     LIMIT 1)
  ) as image_url,
  ARRAY_AGG(t.name) as tags
FROM events e
LEFT JOIN event_tags et ON e.id = et.event_id
LEFT JOIN tags t ON et.tag_id = t.id
GROUP BY e.id;
```

### Buscar eventos por tag

```sql
SELECT e.*
FROM events e
INNER JOIN event_tags et ON e.id = et.event_id
INNER JOIN tags t ON et.tag_id = t.id
WHERE t.slug = 'carnaval'
ORDER BY e.start_date ASC;
```

### Buscar eventos futuros em destaque

```sql
SELECT e.*
FROM events e
WHERE e.highlight IN ('sim', 'SIM', 'true', '1')
  AND e.start_date >= CURRENT_DATE
ORDER BY e.start_date ASC;
```

## 🔒 Segurança

- O banco utiliza Row Level Security (RLS) do Supabase
- Aplicação frontend usa chave anônima (`anon key`) do Supabase
- Operações de escrita podem requerer autenticação adicional

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Schema do Projeto](./README.md)

---

**Última atualização:** 2024
**Versão do Schema:** 1.0

```

A documentação inclui:
- Visão geral do banco
- Descrição de cada tabela com campos e tipos
- Relacionamentos entre tabelas
- Exemplos de queries
- Convenções e boas práticas
- Referências a views usadas no código

Quer que eu adicione alguma seção específica ou detalhe algum ponto?
```
