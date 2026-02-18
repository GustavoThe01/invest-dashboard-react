# 🚀 MarketDash

### Dashboard Inteligente para Monitoramento de Ativos e Insights com IA

---

## 📌 O que é o MarketDash?

O **MarketDash** é uma solução moderna de monitoramento financeiro focada em **criptoativos e mercado de capitais**. Desenvolvido como uma **Single Page Application (SPA)**, ele centraliza dados em tempo real para oferecer uma visão clara do patrimônio e performance de investimentos.

O projeto foi estruturado para demonstrar:
- **Consumo de APIs Assíncronas**: Integração com dados reais de mercado.
- **Lógica Matemática**: Cálculos precisos de lucro, prejuízo e patrimônio total.
- **Arquitetura Limpa**: Organização modular para garantir escalabilidade e fácil manutenção.

É uma ferramenta ideal para investidores que buscam **agilidade e inteligência** na tomada de decisão, sem a necessidade de planilhas complexas.

---

## 🎯 Objetivo do Projeto

- Centralizar o acompanhamento de ativos em um único painel.
- Calcular automaticamente o saldo e a variação da carteira em tempo real.
- Utilizar Inteligência Artificial para gerar insights estratégicos sobre tendências de mercado.
- Demonstrar proficiência em **JavaScript/TypeScript** e arquitetura de sistemas front-end profissional.

*Este projeto faz parte do meu portfólio profissional como Analista de Sistemas.*

---

## 🛠️ Tecnologias e Linguagens Utilizadas

### Frontend
- **React 18/19** — Arquitetura moderna baseada em componentes reutilizáveis.
- **JavaScript / TypeScript** — Lógica robusta com foco em tipagem e segurança de dados.
- **Tailwind CSS** — Estilização utility-first com suporte nativo a Dark Mode.
- **Vite** — Tooling de próxima geração para um ambiente de desenvolvimento ultra-rápido.

### Inteligência Artificial
- **Google GenAI SDK (Gemini AI)**.
  - Geração de insights estratégicos baseados no comportamento dos ativos em tempo real.

### Outras Tecnologias
- **Context API** — Gerenciamento de estado global para persistência de ativos e preferências.
- **Axios / Fetch** — Abstração para consumo de APIs financeiras externas (ex: CoinGecko).
- **FinanceUtils** — Módulo de utilitários dedicado a cálculos matemáticos e formatação financeira.

---

## 📦 Módulos do Sistema

O MarketDash é estruturado em componentes de alta responsividade:

### 📊 Dashboard de Ativos (Asset Table)
- Exibição dos **Top 20 ativos** com dados de mercado atualizados.
- Monitoramento de variações percentuais (1h, 24h) com feedback visual dinâmico.
- Alertas de mercado para identificação rápida de oportunidades ou riscos.

### 💰 Gestão de Patrimônio (Summary Cards)
- Resumo executivo do valor total investido na carteira.
- Cálculo automático de lucro/prejuízo (P&L) baseado em cotações atuais.
- Conversão de moedas (BRL/USD) integrada ao fluxo de dados.

### 🤖 Insights com IA (Gemini Insight)
- Módulo dedicado à análise preditiva via IA Gemini.
- Processamento de dados reais para sugerir movimentações estratégicas.

---

## ⚙️ Funcionalidades-Chave

- 🌍 **Internacionalização**: Sistema preparado para múltiplos idiomas (PT/EN/ES).
- 🔄 **Auto-Atualização**: Mecanismo de refresh automático para manter os dados sempre frescos.
- 🌙 **Interface Adaptativa**: Dark Mode nativo para melhor conforto visual.
- 🔗 **Arquitetura Escalável**: Separação clara entre serviços, contextos, componentes e utilitários.

---

## 🏗️ Arquitetura Técnica

- **Separation of Concerns (SoC)**: Lógica de negócio completamente isolada da camada de UI.
- **State Management**: Fluxo de dados otimizado via Context API para evitar "prop drilling".
- **Service Layer Pattern**: Camada de serviço isolada para facilitar futuras integrações com outras APIs.

---

## ▶️ Como Executar o Projeto

```bash
# Instalar as dependências do projeto
npm install

# Configurar as variáveis de ambiente
# Crie um arquivo .env.local baseado no .env.example
VITE_GEMINI_API_KEY=SUA_CHAVE_AQUI

# Iniciar o servidor de desenvolvimento
npm run dev
