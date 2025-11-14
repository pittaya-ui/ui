# ⏭️ Skip de Componentes Já Instalados

## 📋 Funcionalidade

O CLI agora detecta automaticamente se um componente já está instalado e **ignora a instalação** para evitar sobreposição de arquivos. Isso é especialmente útil quando:

- Um componente é instalado manualmente primeiro
- Múltiplos componentes dependem do mesmo componente (ex: vários componentes usam `button`)
- Você reinstala componentes após fazer customizações

## 🎯 Como Funciona

### Verificação Automática

Antes de instalar qualquer componente, o CLI:

1. ✅ Busca o componente no registry
2. ✅ Verifica se **todos os arquivos** do componente existem no projeto
3. ✅ Se existirem, pula a instalação
4. ✅ Se não existirem, instala normalmente

### Fluxo de Instalação

```bash
npx pittaya add orbit-images
```

**Saída esperada:**

```
Adding 1 component(s)...

   📦 orbit-images requires: button, utils
   ⏭️  button already installed, skipping...
   ⏭️  utils already installed, skipping...

✓ orbit-images installed successfully!

✅ Components added successfully!
```

## 📝 Exemplos Práticos

### Exemplo 1: Dependência Duplicada

```bash
# Instalar button primeiro
npx pittaya add button

# Depois instalar orbit-images (que depende de button)
npx pittaya add orbit-images
```

**Resultado:**
- `button` é instalado na primeira vez
- `orbit-images` detecta que `button` já existe e **não reinstala**
- Suas customizações em `button` são preservadas

### Exemplo 2: Múltiplos Componentes com Mesma Dependência

```bash
npx pittaya add modal card dialog
```

Todos dependem de `button` e `utils`:

```
   📦 modal requires: button, utils
   ✓ button installed successfully!
   ✓ utils installed successfully!
   ✓ modal installed successfully!

   📦 card requires: button, utils
   ⏭️  button already installed, skipping...
   ⏭️  utils already installed, skipping...
   ✓ card installed successfully!

   📦 dialog requires: button, utils
   ⏭️  button already installed, skipping...
   ⏭️  utils already installed, skipping...
   ✓ dialog installed successfully!
```

### Exemplo 3: Reinstalação Segura

```bash
# Você customizou o button.tsx
# Mas precisa reinstalar outro componente

npx pittaya add orbit-images
```

**Resultado:**
- `button` customizado é **preservado** (não é reinstalado)
- Apenas `orbit-images` é instalado

## 🔧 Forçar Reinstalação

Se você **quer** sobrescrever componentes existentes, use a flag `--overwrite`:

```bash
npx pittaya add button --overwrite
```

ou

```bash
npx pittaya add orbit-images --overwrite
```

Com `--overwrite`:
- ✅ Componente principal é reinstalado
- ✅ Dependências também são reinstaladas (sobrescrevendo arquivos existentes)

## 🎨 Customização Segura

Essa funcionalidade permite que você:

### ✅ Customize Componentes com Segurança

```typescript
// src/components/pittaya/ui/button.tsx
// Você customizou o button

export function Button({ className, ...props }) {
  return (
    <button 
      className={cn("minha-classe-custom", className)} 
      {...props} 
    />
  )
}
```

Depois instalar outros componentes sem perder suas customizações:

```bash
npx pittaya add card modal dialog
# button customizado não é sobrescrito! ✅
```

### ✅ Instale Componentes em Qualquer Ordem

Não importa a ordem, componentes já instalados não são reinstalados:

```bash
# Instalar dependência primeiro
npx pittaya add button

# Depois o componente que depende dela
npx pittaya add orbit-images
# button não é reinstalado ✅
```

## 🔍 Detalhes Técnicos

### Verificação de Instalação

```typescript
async function isComponentInstalled(
  name: string,
  config: IConfig
): Promise<boolean> {
  // 1. Busca o componente no registry
  const component = await getRegistryComponent(name);
  
  // 2. Verifica cada arquivo do componente
  for (const file of component.files) {
    const filePath = resolveTargetPath(file.name, component.type, config);
    
    // 3. Se algum arquivo não existe, retorna false
    const exists = await fs.access(filePath);
    if (!exists) return false;
  }
  
  // 4. Todos os arquivos existem
  return true;
}
```

### Lógica de Skip

```typescript
async function addComponent(name: string, config: IConfig, options: IAddOptions) {
  // Verificar se já está instalado
  const alreadyInstalled = await isComponentInstalled(name, config);
  
  // Se já está instalado E não tem flag --overwrite, pular
  if (alreadyInstalled && !options.overwrite) {
    console.log(`⏭️  ${name} already installed, skipping...`);
    return; // ⬅️ Retorna sem instalar
  }
  
  // Continuar com instalação normal...
}
```

### Verificação de Dependências

```typescript
// Quando um componente tem registryDependencies
if (component.registryDependencies?.length > 0) {
  for (const dep of component.registryDependencies) {
    // Cada dependência passa pela verificação de instalação
    await addComponent(dep, config, { ...options, yes: true });
    // ⬆️ Se 'dep' já está instalado, será pulado automaticamente
  }
}
```

## ⚙️ Opções de CLI

### `--overwrite`

Força reinstalação de componentes existentes:

```bash
npx pittaya add button --overwrite
```

### `--yes` ou `-y`

Não pergunta confirmações (usado internamente para dependências):

```bash
npx pittaya add button --yes
```

### Combinando Flags

```bash
npx pittaya add orbit-images --overwrite --yes
```

- Reinstala tudo sem perguntar
- Sobrescreve arquivos existentes

## 📊 Cenários de Uso

| Cenário | Comportamento | Flag Necessária |
|---------|---------------|-----------------|
| Componente não existe | ✅ Instala | - |
| Componente já existe | ⏭️ Pula | - |
| Forçar reinstalação | ✅ Reinstala | `--overwrite` |
| Dependência já existe | ⏭️ Pula | - |
| Forçar todas deps | ✅ Reinstala | `--overwrite` |

## 🎯 Benefícios

1. **🛡️ Proteção de Customizações**
   - Suas modificações não são perdidas

2. **⚡ Instalação Mais Rápida**
   - Não reinstala dependências desnecessariamente

3. **🔄 Idempotência**
   - Executar `npx pittaya add button` múltiplas vezes é seguro

4. **📦 Gestão Inteligente de Dependências**
   - Instala apenas o que é necessário

5. **🎨 Workflow de Customização**
   - Customize primeiro, instale outros componentes depois

## 🚨 Casos Especiais

### Arquivo Parcialmente Deletado

Se você deletou **parte** dos arquivos de um componente:

```bash
# button.tsx existe, mas button.test.tsx foi deletado
npx pittaya add button
# ✅ Detecta que está incompleto e reinstala
```

### Múltiplos Arquivos

Componentes com múltiplos arquivos são verificados completamente:

```typescript
// Componente com 3 arquivos
{
  files: [
    { name: "button.tsx", content: "..." },
    { name: "button.stories.tsx", content: "..." },
    { name: "button.test.tsx", content: "..." }
  ]
}

// Todos devem existir para considerar "instalado"
```

## 📚 Logs e Feedback

### Componente Pulado

```
⏭️  button already installed, skipping...
```

### Componente Instalado

```
✓ button installed successfully!
```

### Lista de Dependências

```
📦 orbit-images requires: button, utils
```

### Resumo Final

```
✅ Components added successfully!
```

## 🔧 Troubleshooting

### "Componente não é pulado mesmo existindo"

**Causa:** Arquivo pode estar em local diferente do esperado

**Solução:**
1. Verifique `components.json` - aliases corretos?
2. Verifique se o arquivo está em `src/components/pittaya/ui/`
3. Verifique permissões do arquivo

### "Quero forçar reinstalação mas não está funcionando"

**Solução:**
```bash
npx pittaya add button --overwrite --yes
```

### "Dependência não é instalada"

**Causa:** Pode já estar instalada

**Verificação:**
```bash
ls -la src/components/pittaya/ui/button.tsx
# Se existir, será pulada
```

---

**Implementado em**: 2025-11-13  
**Versão**: CLI 0.0.4+  
**Status**: ✅ Funcional

