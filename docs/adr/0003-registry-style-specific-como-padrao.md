# 0003. Registry style-specific como padrão (Tailwind v4)

Data: 2025-12-17

## Status

✅ **Accepted** (Implementado)

## Contexto

A CLI da Pittaya precisa instalar componentes em projetos do usuário com um sistema de tema consistente e previsível. No Tailwind CSS v4, o caminho recomendado é usar **CSS Variables** (ex.: `:root` e `.dark`) e um bloco `@theme inline` para expor tokens (ex.: `--color-background: var(--background);`).

O Shadcn UI popularizou um modelo de registry que separa:

- **Style** (ex.: `new-york`, `default`) como um item de registry do tipo `registry:style`
- **Componentes** com variações por estilo

No entanto, o objetivo do projeto **não** é depender do código/fonte do Shadcn para os componentes do Pittaya. O repositório `shad_ui/` existe apenas como **inspiração e documentação técnica**.

### Problema

O registry “legacy” da Pittaya (único índice global em `registry/index.json` + `registry/components/*.json`) não tinha um mecanismo padrão para:

- aplicar tema no `init` (Tailwind v4 + cssVars)
- organizar componentes por “style” (permitindo evoluir `new-york`, `default` e futuros estilos)
- manter retrocompatibilidade com projetos existentes

Além disso, o formato dos arquivos instalados precisava continuar respeitando `components.json` e os aliases do projeto do usuário (ex.: `aliases.ui`, `aliases.lib`).

### Requisitos

- O registry **padrão** deve ser **style-specific**: `registry/styles/<style>/...`
- O item `style` deve carregar `cssVars` no formato consumido pela CLI (`theme`, `light`, `dark`)
- O comando `init` deve aplicar as `cssVars` no `globals.css` do projeto (Tailwind v4)
- O comando `add` deve buscar componentes do style escolhido no `components.json`
- Os componentes instalados devem ser **do Pittaya UI**, não do Shadcn

### Alternativas consideradas

#### Alternativa 1: Manter apenas o registry legacy

Continuar usando somente `registry/index.json` e `registry/components/*.json`.

**Pros:**
- ✅ Simples
- ✅ Menos arquivos

**Cons:**
- ❌ Não modela “style” como primitivo
- ❌ Dificulta evolução de temas/estilos
- ❌ Exige lógica especial no `init`/`add` para aplicar tema sem registry de estilo

**Decisão:** ❌ Rejeitada

#### Alternativa 2: Adotar structure style-specific, mas importar componentes do Shadcn

Usar `shad_ui/` como fonte de componentes e publicar no registry.

**Pros:**
- ✅ Acelera bootstrap inicial
- ✅ Componentes já maduros

**Cons:**
- ❌ A Pittaya perderia controle do código fonte dos componentes
- ❌ Risco de divergência e dificuldade de manutenção
- ❌ O objetivo do projeto é ter componentes próprios

**Decisão:** ❌ Rejeitada

#### Alternativa 3: Adotar structure style-specific como padrão, gerando conteúdo a partir do Pittaya UI

Manter o modelo inspirado no Shadcn (apenas como referência) e publicar o registry **a partir do `ui/` da Pittaya**.

**Pros:**
- ✅ Habilita temas por `cssVars` (Tailwind v4) de forma padrão
- ✅ Permite evoluir estilos no futuro sem quebrar a API
- ✅ Mantém controle total do código dos componentes
- ✅ Mantém legacy como fallback

**Cons:**
- ❌ Aumenta a superfície do registry (mais arquivos)
- ❌ Exige sincronização do build do registry com os estilos existentes

**Decisão:** ✅ **Escolhida**

## Decisão

O registry **style-specific** (pasta `registry/styles/<style>`) passa a ser o **padrão** para o projeto.

- Os componentes publicados em `registry/styles/<style>/components/*.json` são gerados **a partir do Pittaya UI**
- O item `style` (tipo `registry:style`) é gerado a partir do `ui/src/app/globals.css`, extraindo:
  - `@theme inline` → `cssVars.theme`
  - `:root` → `cssVars.light`
  - `.dark` → `cssVars.dark`
- O diretório `shad_ui/` é mantido apenas como referência técnica (não é fonte do registry)

### Implementação

- **Registry por estilo**:
  - `cli/scripts/build-registry.ts` gera:
    - `cli/registry/styles/new-york/index.json`
    - `cli/registry/styles/new-york/components/*.json`
    - `cli/registry/styles/default/index.json`
    - `cli/registry/styles/default/components/*.json`
    - `cli/registry/styles/pittaya/index.json`
    - `cli/registry/styles/pittaya/components/*.json`
  - O build recria `components/` por estilo para garantir ausência de resquícios de outras fontes.
  - O build aplica overrides por style ao publicar os componentes:
    - `default` e `new-york` possuem diferenças visuais intencionais (inspiradas no Shadcn UI)
    - `pittaya` adiciona um visual mais arredondado e define `primary` a partir do token `pittaya`

- **Resolução do registry**:
  - `cli/packages/cli/src/utils/registry.ts` busca componentes e índice apenas em `styles/<style>/...`.

- **Aplicação do tema**:
  - `cli/packages/cli/src/utils/style-installer.ts` aplica `cssVars` no CSS do projeto do usuário via PostCSS (Tailwind v4).

### Retrocompatibilidade

- ⚠️ Projetos passam a depender do `components.json` conter o `style` e `tailwind.css` corretos para aplicar o tema.

## Consequências

### Positivas ✅

1. **Padrão consistente para Tailwind v4**
   - Tema e tokens centralizados em `registry:style` com `cssVars`.

2. **Evolução de estilos sem refatorações grandes**
   - Novos estilos podem ser adicionados em `registry/styles/<novo-style>`.

3. **Controle total do código do Pittaya UI**
   - O registry publica componentes próprios; o Shadcn não é dependência do produto.

4. **Compatibilidade preservada**
   - Não aplicável.

### Negativas ❌

1. **Mais arquivos no registry**
   - Mitigação: automação via `npm run build:registry`.

2. **Maior necessidade de disciplina no build do registry**
   - Mitigação: padronizar `build:registry` como etapa obrigatória ao alterar o `ui`.

### Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|------|---------------|---------|-----------|
| Divergência entre `globals.css` do UI e `style.json` do registry | Média | Alto | `build:registry` sempre extrai tokens do `ui/src/app/globals.css` |
| Breaking changes em projetos antigos sem `styles/<style>` disponível | Baixa | Médio | Melhorar mensagens de erro quando o style não existir e documentar migração |

## Métricas de Sucesso

- ✅ `pittaya init` aplica `cssVars` no `globals.css` do projeto (Tailwind v4)
- ✅ `pittaya add` instala componentes do style definido em `components.json`
- ✅ O registry `styles/<style>` não contém `author: shadcn` nem conteúdo importado do Shadcn

## Implementação

- **Arquivos modificados**:
  - `cli/scripts/build-registry.ts`
  - `cli/packages/cli/src/utils/registry.ts`
  - `cli/packages/cli/src/utils/style-installer.ts`
  - `cli/packages/cli/src/commands/init.ts`
  - `cli/packages/cli/src/commands/add.ts`

## Referências

- Shadcn UI (referência técnica): `shad_ui/`
- Tailwind CSS v4: https://tailwindcss.com/docs
- PostCSS: https://postcss.org/

---

**Revisões:**
- 2025-12-17: Decisão aceita e implementada
- 2025-12-17: Adicionado o style `pittaya` e overrides por style ao publicar o registry
- 2025-12-21: Removido o fluxo legacy (`registry/index.json` e `registry/components/*`); somente `registry/styles/<style>`
