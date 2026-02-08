# Configuração de SEO - Sitemap e Robots.txt

## ✅ O que foi configurado

### 1. **Sitemap (`src/app/sitemap.ts`)**
- Arquivo criado seguindo o padrão Next.js 15
- Inclui as principais páginas do site:
  - Homepage (prioridade 1.0)
  - Pricing (prioridade 0.8)
  - Login (prioridade 0.7)
  - Signup (prioridade 0.7)
  - Dashboard (prioridade 0.6)
- URL gerada automaticamente: `https://konnexy.com.br/sitemap.xml`

### 2. **Robots.txt (`src/app/robots.ts`)**
- Configurado para permitir crawling de todas as páginas públicas
- Bloqueia crawling de rotas sensíveis:
  - `/api/` - Rotas de API
  - `/dashboard/` - Área privada do usuário
- Referencia o sitemap automaticamente

### 3. **Metadata Base (`src/app/layout.tsx`)**
- Adicionado `metadataBase: new URL('https://konnexy.com.br')`
- Corrigido URL do OpenGraph de `konnexy.io` para `konnexy.com.br`
- Garante que todas as URLs relativas sejam resolvidas corretamente

## 📋 Próximos passos

### 1. **Deploy no Vercel**
Faça o deploy da aplicação para que o sitemap fique disponível publicamente.

### 2. **Submeter ao Google Search Console**
1. Acesse: https://search.google.com/search-console
2. Vá em "Sitemaps" no menu lateral
3. Adicione a URL: `https://konnexy.com.br/sitemap.xml`
4. Clique em "Enviar"

### 3. **Verificar o Sitemap**
Após o deploy, você pode acessar diretamente:
- Sitemap: `https://konnexy.com.br/sitemap.xml`
- Robots: `https://konnexy.com.br/robots.txt`

## 🔍 Como adicionar mais páginas ao sitemap

Edite o arquivo `src/app/sitemap.ts` e adicione novos objetos ao array:

```typescript
{
  url: `${baseUrl}/nova-pagina`,
  lastModified: currentDate,
  changeFrequency: 'weekly', // 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: 0.5, // 0.0 a 1.0
}
```

## 📊 Prioridades recomendadas
- **1.0**: Homepage
- **0.8**: Páginas principais (Pricing, About)
- **0.6-0.7**: Páginas secundárias (Login, Signup)
- **0.4-0.5**: Páginas de conteúdo
- **0.3 ou menos**: Páginas menos importantes

## ⚠️ Observações importantes
- O sitemap é gerado automaticamente no build
- Não é necessário criar manualmente um arquivo XML
- O Next.js 15 gera o sitemap dinamicamente
- Qualquer alteração no `sitemap.ts` requer um novo build/deploy
