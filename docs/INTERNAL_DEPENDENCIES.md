# 🔗 Internal Dependencies - Guia de Uso

## O Que São Internal Dependencies?

`internalDependencies` é uma propriedade que permite declarar explicitamente dependências entre componentes da Pittaya UI. Quando um componente depende de outro componente do próprio pacote Pittaya, você pode declarar isso no `components-index.ts`.

## Por Que Usar?

### Problema que Resolve

Quando um componente usa import relativo (ex: `import { Button } from "./button"`), o sistema de extração automática de dependências não consegue detectar essa dependência. O `internalDependencies` resolve isso declarando explicitamente a dependência.

### Exemplo Prático

```typescript
// orbit-images.ts
import { Button } from "./button";  // Import relativo - não é detectado automaticamente

export function OrbitImages({ title, buttonText }: Props) {
  return (
    <div>
      <Button>{buttonText}</Button>  {/* Usa o componente Button */}
    </div>
  );
}
```

## Como Usar

### 1. Declarar no `components-index.ts`

```typescript
// ui/src/lib/docs/components-index.ts
export const componentsIndex: ComponentIndexItem[] = [
  {
    slug: "button",
    name: "Button",
    description: "Displays a button or a component that looks like a button.",
    category: "Actions",
    status: "stable",
    dependencies: ["@radix-ui/react-slot"],  // NPM dependencies
  },
  {
    slug: "orbit-images",
    name: "Orbit Images",
    description: "Displays a set of images in an orbiting motion.",
    category: "Components",
    status: "stable",
    internalDependencies: ["button"],  // ⬅️ Dependência interna
  },
];
```

### 2. Gerar o Registry

```bash
cd cli
npm run build:registry
```

### 3. Resultado no Registry

```json
{
  "name": "orbit-images",
  "type": "registry:ui",
  "description": "Displays a set of images in an orbiting motion.",
  "registryDependencies": [
    "button",    // ⬅️ Adicionado das internalDependencies
    "utils"      // Detectado automaticamente do código
  ],
  "files": [...]
}
```

## Funcionamento Técnico

### Fluxo de Processamento

1. **Parser**: `build-registry.ts` lê o `components-index.ts`
2. **Extração**: Captura a propriedade `internalDependencies`
3. **Merge**: Combina com dependências detectadas automaticamente do código
4. **Deduplicação**: Remove duplicatas usando `Set`
5. **Ordenação**: Ordena alfabeticamente
6. **Geração**: Cria o JSON com todas as `registryDependencies`

### Código Relevante

```typescript
// cli/scripts/build-registry.ts

// 1. Parse das internalDependencies
const internalDepsMatch = block.match(/internalDependencies:\s*\[(.*?)\]/s);
if (internalDepsMatch) {
  const internalDeps = internalDepsString
    .match(/["']([^"']+)["']/g)
    ?.map(d => d.replace(/["']/g, '')) || [];
  
  if (internalDeps.length > 0) {
    item.internalDependencies = internalDeps;
  }
}

// 2. Merge com dependências automáticas
const registryDepsFromContent = extractRegistryDependencies(content);
const registryDeps = new Set<string>(registryDepsFromContent);

if (internalDependencies && internalDependencies.length > 0) {
  internalDependencies.forEach(dep => registryDeps.add(dep));
}

// 3. Adicionar ao componente
component.registryDependencies = registryDeps.size > 0 
  ? Array.from(registryDeps).sort() 
  : undefined;
```

## Quando Usar

### ✅ Use `internalDependencies` quando:

- Componente usa **import relativo** de outro componente Pittaya
  ```typescript
  import { Button } from "./button"
  import { Card } from "../ui/card"
  ```

- Componente tem dependência que **não é detectada automaticamente**

- Quer **garantir** que uma dependência seja incluída mesmo se o código mudar

### ❌ NÃO use quando:

- O import já usa o caminho absoluto detectável:
  ```typescript
  import { Button } from "@/components/ui/button"  // Detectado automaticamente
  ```

- É uma dependência NPM:
  ```typescript
  dependencies: ["@radix-ui/react-slot"]  // Use 'dependencies', não 'internalDependencies'
  ```

## Detecção Automática vs Manual

### Detecção Automática

O sistema detecta automaticamente imports como:

```typescript
import { cn } from "@/lib/utils"              // ✅ Detectado → "utils"
import { Button } from "@/components/ui/button"  // ✅ Detectado → "button"
```

### Declaração Manual (internalDependencies)

Necessário para imports como:

```typescript
import { Button } from "./button"             // ❌ NÃO detectado → Use internalDependencies
import { Card } from "../ui/card"            // ❌ NÃO detectado → Use internalDependencies
```

## Exemplos

### Componente Simples (Detecção Automática)

```typescript
// button.tsx
import { cn } from "@/lib/utils"  // Detectado automaticamente

export function Button({ className, ...props }) {
  return <button className={cn("...", className)} {...props} />
}
```

```typescript
// components-index.ts
{
  slug: "button",
  dependencies: ["@radix-ui/react-slot"],
  // internalDependencies não necessário - cn de utils é detectado
}
```

### Componente Complexo (Manual)

```typescript
// modal.tsx
import { cn } from "@/lib/utils"       // Detectado automaticamente
import { Button } from "./button"     // ❌ Não detectado - import relativo
import { Card } from "./card"         // ❌ Não detectado - import relativo

export function Modal({ title, onClose, children }) {
  return (
    <Card>
      <h2>{title}</h2>
      {children}
      <Button onClick={onClose}>Close</Button>
    </Card>
  )
}
```

```typescript
// components-index.ts
{
  slug: "modal",
  dependencies: ["@radix-ui/react-dialog"],
  internalDependencies: ["button", "card"],  // ⬅️ Declaração manual necessária
}
```

## Verificação

### Verificar se está funcionando:

```bash
# 1. Gerar registry
npm run build:registry

# 2. Verificar o JSON gerado
cat registry/components/seu-componente.json

# 3. Procurar por registryDependencies
# Deve conter as dependências declaradas + as detectadas
```

### Exemplo de saída esperada:

```json
{
  "name": "modal",
  "registryDependencies": [
    "button",   // ⬅️ De internalDependencies
    "card",     // ⬅️ De internalDependencies
    "utils"     // ⬅️ Detectado automaticamente
  ]
}
```

## Instalação no Projeto do Usuário

Quando o usuário instalar o componente:

```bash
npx pittaya add modal
```

O CLI automaticamente:

1. ✅ Instala `modal`
2. ✅ Detecta `registryDependencies: ["button", "card", "utils"]`
3. ✅ Instala automaticamente `button`, `card` e `utils`
4. ✅ Instala as dependências NPM de cada um

## Tipos TypeScript

```typescript
// IComponentIndexItem
interface IComponentIndexItem {
  slug: string;
  description?: string;
  category: string;
  dependencies?: string[];           // NPM packages
  internalDependencies?: string[];   // Componentes Pittaya
}
```

## Troubleshooting

### Problema: internalDependencies não está sendo processado

**Solução:**
1. Verificar se o arquivo `components-index.ts` foi commitado e publicado no GitHub
2. Limpar cache do GitHub (pode demorar até 5 minutos)
3. Ou usar modo local temporariamente:
   ```bash
   USE_LOCAL_UI=true npm run build:registry  # Linux/Mac
   ```

### Problema: Dependência duplicada

**Não é um problema!** O sistema usa `Set` para remover duplicatas automaticamente.

```typescript
// Se declarado manualmente E detectado automaticamente
internalDependencies: ["button"]  // Declarado
// + Código: import { Button } from "@/components/ui/button"  // Detectado

// Resultado: ["button"] (sem duplicata)
```

## Boas Práticas

1. ✅ **Seja Explícito**: Declare todas as dependências internas, mesmo que algumas sejam detectadas automaticamente
2. ✅ **Ordem Alfabética**: Facilita leitura (o sistema ordena automaticamente)
3. ✅ **Documentar**: Comente dependências não óbvias
4. ✅ **Testar**: Sempre teste a geração do registry após adicionar internalDependencies

```typescript
{
  slug: "complex-component",
  dependencies: ["framer-motion", "react-icons"],
  // Button e Card são usados via import relativo
  // Utils é detectado automaticamente mas incluído para garantir
  internalDependencies: ["button", "card", "utils"],
}
```

---

**Implementado em**: 2025-11-13  
**Versão**: CLI 0.0.3+  
**Status**: ✅ Funcional

