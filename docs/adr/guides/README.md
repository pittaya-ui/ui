# 📚 Guias Técnicos - ADRs

Esta pasta contém guias técnicos complementares que explicam conceitos usados nos Architecture Decision Records.

## 🎯 Propósito

Os ADRs documentam **decisões** arquiteturais, mas às vezes referenciam conceitos técnicos que precisam de explicação mais detalhada. Esta pasta contém esses guias explicativos.

## 📖 Guias Disponíveis

| Guia | Descrição | ADRs Relacionados |
|------|-----------|-------------------|
| [O que é AST?](./what-is-ast.md) | Explicação completa sobre Abstract Syntax Tree | [ADR-0002](../0002-ast-para-deteccao-de-dependencias.md) |

## 🆚 ADR vs Guia Técnico

### ADR (Architecture Decision Record)
- **O quê**: Documenta UMA decisão específica
- **Quando**: No momento da decisão
- **Conteúdo**: Contexto, alternativas, decisão, consequências
- **Exemplo**: "Decidimos usar ts-morph para análise AST"

### Guia Técnico
- **O quê**: Explica UM conceito ou tecnologia
- **Quando**: Quando necessário para entender ADRs
- **Conteúdo**: Definição, exemplos, comparações, recursos
- **Exemplo**: "O que é AST e como funciona?"

## 📝 Como Criar um Novo Guia

### 1. Quando criar?

Crie um guia técnico quando:
- ✅ Um ADR referencia um conceito complexo
- ✅ Múltiplos ADRs podem referenciar o mesmo conceito
- ✅ O conceito merece explicação detalhada
- ✅ Há exemplos práticos relevantes

### 2. Estrutura sugerida

```markdown
# [Título do Conceito]

> **Guia técnico**: [Breve descrição]

**Relacionado**: [Links para ADRs]

---

## 📖 Definição
[Explicação do conceito]

## 🎯 Conceito Visual
[Exemplos visuais/diagramas]

## 💡 Analogia
[Comparação com mundo real]

## 🆚 Comparações
[Alternativas e diferenças]

## 🛠️ Uso no Projeto
[Como usamos no Pittaya]

## 📚 Recursos
[Links externos]
```

### 3. Nomenclatura

Use kebab-case para nomes de arquivos:
- ✅ `what-is-ast.md`
- ✅ `typescript-compiler-api.md`
- ✅ `dependency-injection.md`
- ❌ `whatIsAST.md`
- ❌ `WhatIsAST.md`

### 4. Linkando ao ADR

No ADR, adicione link para o guia:

```markdown
> 📚 **Novo no conceito X?** Leia nosso [Guia: O que é X?](./guides/what-is-x.md)
```

Ou na seção de Referências:

```markdown
## Referências

### Documentação Interna
- [Guia: O que é X?](./guides/what-is-x.md)
```

## 📊 Exemplos de Futuros Guias

Possíveis guias que podem ser úteis:

| Tópico | Quando Criar | ADR Relacionado |
|--------|--------------|-----------------|
| TypeScript Compiler API | Se criarmos mais ADRs sobre análise de código | ADR-0002 |
| Dependency Injection | Se adotarmos DI no CLI | ADR-XXXX |
| Monorepo Strategies | Se expandirmos para monorepo | ADR-XXXX |
| Semantic Versioning | Se formalizarmos versionamento | ADR-XXXX |

## 🔗 Links Relacionados

- [ADRs](../)
- [README Principal](../README.md)
- [Template de ADR](../TEMPLATE.md)

---

**Nota**: Guias são documentação viva e podem ser atualizados conforme necessário (diferente de ADRs que são imutáveis).

