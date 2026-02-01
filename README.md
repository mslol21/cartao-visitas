# ConnectCard - Seu Cartão de Visita Digital Profissional

O ConnectCard é uma plataforma SaaS para criação de cartões de visita digitais otimizados para conversão no WhatsApp.

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Backend/Auth**: Supabase (Auth SSR + Database + Storage)
- **Pagamentos**: Stripe

## 🛠️ Instalação e Desenvolvimento

1. **Clone o repositório**:
   ```sh
   git clone <URL_DO_REPO>
   cd connect-card
   ```

2. **Instale as dependências**:
   ```sh
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz com as chaves do Supabase e Stripe.

4. **Inicie o servidor de desenvolvimento**:
   ```sh
   npm run dev
   ```

## 🏗️ Estrutura do Projeto

- `/src/app` - Rotas e páginas da aplicação
- `/src/components` - Componentes reutilizáveis (UI, Dashboard, Landing)
- `/src/hooks` - Hooks customizados (Auth, Profile)
- `/src/utils/supabase` - Configurações do cliente e servidor Supabase
- `/supabase` - Migrations e configurações do banco de dados

## 📄 Licença

Este projeto focado em MVP SaaS.
