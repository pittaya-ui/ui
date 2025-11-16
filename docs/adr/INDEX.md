# 📚 Índice de Architecture Decision Records

> Última atualização: 2025-11-16

## 📊 Visão Geral

Total de ADRs: **2**

| Status | Quantidade |
|--------|-----------|
| ✅ Accepted | 2 |
| 🟡 Proposed | 0 |
| ⚠️ Deprecated | 0 |
| 🔄 Superseded | 0 |

## 🗂️ ADRs por Categoria

### Meta / Processo

| # | Título | Status | Data | Impacto |
|---|--------|--------|------|---------|
| [0001](0001-uso-de-adrs.md) | Uso de Architecture Decision Records | ✅ Accepted | 2025-11-16 | 🟢 Baixo |

### Arquitetura Técnica

| # | Título | Status | Data | Impacto |
|---|--------|--------|------|---------|
| [0002](0002-ast-para-deteccao-de-dependencias.md) | Análise AST para Detecção de Dependências | ✅ Accepted | 2025-11-16 | 🔴 Alto |

### Build System

| # | Título | Status | Data | Impacto |
|---|--------|--------|------|---------|
| [0002](0002-ast-para-deteccao-de-dependencias.md) | Análise AST para Detecção de Dependências | ✅ Accepted | 2025-11-16 | 🔴 Alto |

## 🔍 ADRs por Área

### Registry & Dependências
- **ADR-0002**: Análise AST para Detecção de Dependências

### Processo & Documentação
- **ADR-0001**: Uso de Architecture Decision Records

## 📈 Timeline

```
2025-11-16
├─ ADR-0001: Uso de ADRs (Meta)
└─ ADR-0002: Análise AST para Dependências (Técnica)
```

## 🎯 Decisões Principais

### Tecnologias Escolhidas

| Tecnologia | ADR | Motivo | Alternativas Consideradas |
|------------|-----|--------|--------------------------|
| ts-morph | [0002](0002-ast-para-deteccao-de-dependencias.md) | API simples, 100% precisão | Regex, TS Compiler API nativo, Parser personalizado |
| ADR Format | [0001](0001-uso-de-adrs.md) | Padrão da indústria | Wiki, Issues, Comentários no código |

### Padrões Estabelecidos

| Padrão | ADR | Descrição |
|--------|-----|-----------|
| Documentação de Decisões | [0001](0001-uso-de-adrs.md) | Usar ADRs para decisões arquiteturais |
| Detecção de Dependências | [0002](0002-ast-para-deteccao-de-dependencias.md) | Usar análise AST ao invés de regex |

## 🔄 Dependências entre ADRs

```
ADR-0001 (Uso de ADRs)
    └─ Estabelece processo
           └─ ADR-0002 usa esse processo
```

## 📊 Impacto Geral

### Por Área do Sistema

| Área | ADRs Relacionados | Impacto Total |
|------|------------------|---------------|
| Build System | 0002 | 🔴 Alto |
| CLI Commands | - | 🟢 Baixo |
| Registry | 0002 | 🔴 Alto |
| Documentation | 0001 | 🟢 Baixo |

### Por Tipo de Mudança

| Tipo | Quantidade | ADRs |
|------|-----------|------|
| Breaking Change | 0 | - |
| Nova Feature | 1 | 0002 |
| Melhoria | 1 | 0002 |
| Processo | 1 | 0001 |

## 🚀 Próximos ADRs Planejados

Nenhum ADR proposto no momento.

## 📚 Guias Técnicos

Documentação complementar sobre conceitos usados nos ADRs:

- [O que é AST (Abstract Syntax Tree)?](./guides/what-is-ast.md) - Guia completo sobre análise AST

## 📝 Como Contribuir

1. Leia o [README](README.md) para entender o processo
2. Use o [TEMPLATE.md](TEMPLATE.md) para criar novos ADRs
3. Consulte o [Guia Rápido](.adr-guide.md) para dicas
4. Use o [PR Template](.github/PULL_REQUEST_TEMPLATE.md) ao submeter

## 🔖 Tags

- `#meta` - ADR-0001
- `#build-system` - ADR-0002
- `#dependencies` - ADR-0002
- `#ast` - ADR-0002
- `#typescript` - ADR-0002

## 📚 Recursos

- [ADR Tools](https://github.com/npryce/adr-tools)
- [ADR GitHub](https://adr.github.io/)
- [Exemplos de ADRs](https://github.com/joelparkerhenderson/architecture-decision-record)

---

**Legenda de Impacto:**
- 🔴 Alto: Afeta múltiplas áreas do sistema
- 🟡 Médio: Afeta uma área específica
- 🟢 Baixo: Mudança isolada ou processo

**Legenda de Status:**
- ✅ Accepted: Decisão aceita e implementada
- 🟡 Proposed: Em discussão
- ⚠️ Deprecated: Descontinuado mas mantido
- 🔄 Superseded: Substituído por outro ADR

