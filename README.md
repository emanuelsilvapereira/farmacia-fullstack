# 📦 Sistema de Controle de Estoque (Farmácia)

Um sistema Full Stack para gestão de estoque de medicamentos, focado em controle de lotes, datas de validade (FEFO) e níveis de acesso seguro para a equipe.

## ✨ Funcionalidades
- **Dashboard Interativo:** Visão geral do estoque, contagem de produtos e alertas automáticos de estoque baixo.
- **Gestão de Produtos (CRUD):** Cadastro de medicamentos, fabricantes e categorias terapêuticas.
- **Controle de Lotes e Validade:** Entradas e saídas vinculadas a lotes para garantir a segurança dos medicamentos.
- **Controle de Acessos (RBAC):**
  - 🛡️ **Admin:** Acesso total (inclui gerenciar a equipe).
  - 👥 **Gerente:** Acesso total ao estoque, entradas e saídas.
  - 👨‍💻 **Operador:** Acesso restrito apenas à visualização do estoque.
- **Interface Moderna:** Design responsivo com suporte nativo a **Dark Mode** e feedback visual de ações.

## 🚀 Tecnologias Utilizadas
- **Front-end:** Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons.
- **Back-end:** Node.js (Rotas de API do Next.js).
- **Banco de Dados:** MySQL com ORM **Prisma**.
- **Segurança:** NextAuth.js com criptografia `bcrypt`.

---

## ⚙️ Como rodar o projeto localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 18 ou superior)
- [MySQL](https://www.mysql.com/) (Rodando localmente na porta 3306)
- Git

### 2. Instalação Rápida (Terminal)
Execute os comandos abaixo na sequência para baixar e instalar o projeto:

```bash
# Clone o repositório (Substitua pela sua URL do GitHub)
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Entre na pasta do projeto
cd SEU_REPOSITORIO

# Instale as dependências
npm install
```

### 3. Configuração do Banco de Dados
Crie um arquivo chamado `.env` na raiz do projeto e cole o código abaixo. Lembre-se de ajustar `root` e `suasenha` de acordo com o seu MySQL local:

```env
DATABASE_URL="mysql://root:suasenha@localhost:3306/estoque_farmacia"
NEXTAUTH_SECRET="c8b9f7a3e2d1c4b5a6f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5"
NEXTAUTH_URL="http://localhost:3000"
```

Ainda no terminal, sincronize o Prisma para criar o banco de dados e as tabelas automaticamente:
```bash
npx prisma db push
```

### 4. Rodando o Sistema e Criando Usuários
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

**Passo final (Apenas na primeira vez que rodar o projeto):**
1. Abra o navegador e acesse a rota semeadeira para gerar a equipe de testes: `http://localhost:3000/api/setup-equipe`
2. Após ver a mensagem de sucesso na tela, acesse a raiz do sistema: `http://localhost:3000`
3. Faça o login utilizando uma das contas criadas (ex: `admin@sistema.com` ou `gerente@sistema.com`) usando a senha padrão: **`123456`**.