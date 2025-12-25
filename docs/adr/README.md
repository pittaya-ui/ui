# Architecture Decision Records (ADR)

Este diretório contém os registros de decisões arquiteturais (ADRs) para o projeto Pittaya UI CLI.

## O que é um ADR?

Um **Architecture Decision Record (ADR)** é um documento que captura uma decisão arquitetural importante feita no projeto, juntamente com seu contexto e consequências.

## Por que usar ADRs?

- 📚 **Histórico**: Mantém registro do raciocínio por trás de decisões importantes
- 🤝 **Comunicação**: Facilita onboarding de novos desenvolvedores
- 🔍 **Transparência**: Decisões documentadas e justificadas
- 🎯 **Contexto**: Evita perguntas como "Por que foi feito assim?"
- 📈 **Evolução**: Permite revisitar e reavaliar decisões passadas

## Formato

Cada ADR segue o formato proposto por Michael Nygard:

```markdown
# [número]. [título da decisão]

Data: YYYY-MM-DD

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Contexto

[Descreve o contexto e o problema que motivou a decisão]

## Decisão

[Descreve a decisão tomada]

## Consequências

[Descreve as consequências (positivas e negativas) da decisão]
```

## Nomenclatura

Os arquivos seguem o padrão:

```
NNNN-titulo-da-decisao.md
```

Onde:
- `NNNN` é um número sequencial de 4 dígitos (0001, 0002, etc.)
- `titulo-da-decisao` é o título em kebab-case

## Status dos ADRs

- **Proposed**: Proposta ainda em discussão
- **Accepted**: Decisão aceita e implementada
- **Deprecated**: Decisão descontinuada mas mantida por compatibilidade
- **Superseded**: Decisão substituída por outra (deve referenciar a nova)

## Como criar um novo ADR

1. **Crie um novo arquivo** numerado sequencialmente
2. **Use o template** acima
3. **Descreva o contexto** claramente
4. **Explique a decisão** e alternativas consideradas
5. **Liste consequências** honestas (pros e cons)
6. **Adicione na tabela** abaixo

## Processo de Aprovação

1. Crie o ADR com status `Proposed`
2. Abra uma discussão/PR para revisão
3. Após consenso, mude status para `Accepted`
4. Implemente a decisão
5. Commit e merge

## Índice de ADRs

| # | Título | Status | Data |
|---|--------|--------|------|
| [0001](0001-uso-de-adrs.md) | Uso de Architecture Decision Records | Accepted | 2025-11-16 |
| [0002](0002-ast-para-deteccao-de-dependencias.md) | Análise AST para Detecção de Dependências | Accepted | 2025-11-16 |
| [0003](0003-registry-style-specific-como-padrao.md) | Registry style-specific como padrão (Tailwind v4) | Accepted | 2025-12-17 |

## Guias Técnicos

Documentação complementar sobre conceitos usados nos ADRs:

- [O que é AST (Abstract Syntax Tree)?](./guides/what-is-ast.md) - Guia técnico sobre análise AST

## Referências

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's ADR Template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR Tools](https://github.com/npryce/adr-tools)

---

**Nota**: ADRs são imutáveis. Se uma decisão mudar, crie um novo ADR e marque o antigo como `Superseded`.

