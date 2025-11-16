# 0001. Uso de Architecture Decision Records

Data: 2025-11-16

## Status

✅ **Accepted**

## Contexto

À medida que o projeto da CLI da Pittaya cresce e evolui, decisões arquiteturais importantes são tomadas, e isso afeta o desenvolvimento futuro. Essas decisões geralmente são discutidas em conversas, PRs ou issues, mas o contexto e raciocínio por trás delas frequentemente se perde com o tempo.

### Problemas identificados:

1. **Falta de documentação** sobre decisões arquiteturais importantes
2. **Dificuldade de onboarding** para novos desenvolvedores entenderem "por que" as coisas foram feitas de determinada forma
3. **Discussões repetitivas** sobre decisões já tomadas
4. **Perda de contexto** histórico quando decisões precisam ser reavaliadas
5. **Falta de rastreabilidade** entre decisões relacionadas

### Alternativas consideradas:

**1. Wiki ou documentação tradicional**
- ❌ Difícil de versionar junto com o código
- ❌ Tende a ficar desatualizada
- ❌ Não fica próxima ao código

**2. Comentários no código**
- ❌ Não fornece visão geral
- ❌ Fica espalhado e difícil de encontrar
- ❌ Difícil de documentar alternativas consideradas

**3. Issues/PRs no GitHub**
- ❌ Difícil de encontrar decisões antigas
- ❌ Contexto pode ser perdido se issue/PR for fechada
- ❌ Não é estruturado

**4. Architecture Decision Records (ADRs)** ← Escolhido
- ✅ Versionado junto com o código
- ✅ Formato estruturado e padronizado
- ✅ Fácil de navegar e pesquisar
- ✅ Imutável (histórico preservado)
- ✅ Amplamente adotado na indústria

## Decisão

Adotaremos **Architecture Decision Records (ADRs)** usando o formato proposto por Michael Nygard para documentar todas as decisões arquiteturais significativas do projeto.

### Estrutura:

```
cli/docs/adr/
├── README.md                           # Este guia
├── 0001-uso-de-adrs.md                # ADR meta
└── NNNN-titulo-da-decisao.md          # ADRs subsequentes
```

### Formato de cada ADR:

```markdown
# [número]. [título]

Data: YYYY-MM-DD

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Contexto
[Problema e motivação]

## Decisão
[Decisão tomada e alternativas]

## Consequências
[Positivas e negativas]
```

### Quando criar um ADR:

- ✅ Mudanças significativas na arquitetura
- ✅ Escolha de bibliotecas/frameworks principais
- ✅ Padrões de código importantes
- ✅ Decisões que afetam múltiplos componentes
- ✅ Trade-offs importantes

### Quando NÃO criar um ADR:

- ❌ Implementações triviais
- ❌ Refatorações simples
- ❌ Bug fixes
- ❌ Mudanças de estilo/formatação

## Consequências

### Positivas ✅

1. **Documentação viva**: ADRs ficam versionados junto com o código
2. **Onboarding facilitado**: Novos desenvolvedores entendem decisões passadas
3. **Transparência**: Decisões justificadas e rastreáveis
4. **Redução de retrabalho**: Evita revisitar decisões já tomadas
5. **Histórico preservado**: Mesmo decisões obsoletas são mantidas para contexto
6. **Padrão da indústria**: Formato amplamente reconhecido

### Negativas ❌

1. **Overhead inicial**: Requer tempo para escrever ADRs
2. **Disciplina necessária**: Equipe precisa se comprometer a manter
3. **Curva de aprendizado**: Novos membros precisam aprender o formato
4. **Possível verbosidade**: ADRs muito detalhados podem ser cansativos

### Riscos mitigados:

- ⚠️ **Risco**: ADRs ficarem desatualizados
  - **Mitigação**: ADRs são imutáveis; decisões novas criam novos ADRs

- ⚠️ **Risco**: Falta de adesão da equipe
  - **Mitigação**: Processo leve e templates prontos

- ⚠️ **Risco**: ADRs muito longos ou complexos
  - **Mitigação**: Foco em clareza e objetividade

## Referências

- [Michael Nygard - Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub Organization](https://adr.github.io/)
- [Joel Parker Henderson - ADR Examples](https://github.com/joelparkerhenderson/architecture-decision-record)

---

**Nota**: Este é um ADR meta - documenta a decisão de usar ADRs. É comum que o primeiro ADR seja sobre a adoção de ADRs.

