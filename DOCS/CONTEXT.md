# Contexto do Projeto: Controle de Equipamentos

Este documento define os princípios arquiteturais e as diretrizes de desenvolvimento para o projeto de controle de locação de equipamentos.

## 1. Objetivo
Migrar o controle de equipamentos de uma planilha para uma aplicação web organizada, permitindo melhor visualização e futuras expansões de funcionalidades.

## 2. Princípios de Desenvolvimento (SOLID)

- **S (Single Responsibility):** Cada componente, hook ou serviço deve ter apenas uma responsabilidade.
- **O (Open/Closed):** O código deve ser aberto para extensão, mas fechado para modificação.
- **L (Liskov Substitution):** Subtipos devem ser substituíveis por seus tipos base.
- **I (Interface Segregation):** Interfaces específicas são melhores que interfaces genéricas.
- **D (Dependency Inversion):** Depender de abstrações, não de implementações concretas.

## 3. Estrutura de Pastas Proposta

Para garantir a separação de lógica, visual e estilo, utilizaremos a seguinte estrutura:

```text
src/
├── core/               # Domínio e Regras de Negócio
│   ├── entities/       # Modelos de dados (Ex: Equipamento.ts)
│   ├── use-cases/      # Lógica de aplicação
│   └── interfaces/     # Definições de contratos
├── infrastructure/     # Serviços externos (API, LocalStorage)
├── presentation/       # Componentes Visuais
│   ├── components/     # Componentes reutilizáveis
│   │   └── MyComponent/
│   │       ├── index.tsx       # Estrutura visual (JSX)
│   │       ├── styles.ts       # Estilização
│   │       └── useLogic.ts     # Lógica do componente (Custom Hook)
│   ├── hooks/          # Hooks globais
│   ├── pages/          # Telas da aplicação
│   └── assets/         # Imagens, ícones, fontes
└── shared/             # Utilitários e constantes comuns
```

## 4. Fluxo de Trabalho
1. **Planejamento:** Toda alteração significativa deve ser precedida por um plano detalhado.
2. **Separação de Arquivos:** Componentes visuais não devem conter lógica complexa de estado ou cálculos.
3. **Tipagem Estrita:** Uso obrigatório de TypeScript para garantir segurança e documentação do código.

## 5. Próximos Passos
- Definir o modelo de dados (Entidade Equipamento).
- Criar a estrutura base de pastas.
- Implementar a tabela inicial de visualização.
