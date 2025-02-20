Upload Web

Este projeto foi criado utilizando o Vite e está configurado com Tailwind CSS, além de diversas bibliotecas para facilitar o desenvolvimento de interfaces dinâmicas e interativas.

🚀 Instalação

Para começar, siga os passos abaixo:

1. Criar o projeto com Vite

npm create vite@latest nome-do-projeto

2. Acessar a pasta do projeto e instalar as dependências

cd nome-do-projeto
npm install

3. Configurar o Tailwind CSS (versão 3)

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

📦 Dependências Instaladas

Além do Vite e Tailwind CSS, este projeto utiliza as seguintes bibliotecas:

Biblioteca

Descrição

lucide-react

Ícones modernos para React

tailwind-variants

Variantes para Tailwind CSS

@radix-ui/react-collapsible

Componente de colapsar da Radix UI

react-dropzone

Upload de arquivos arrastando e soltando

@radix-ui/react-progress

Componente de progresso da Radix UI

motion

Animações fluidas no React

zustand

Gerenciamento de estado simples e escalável

immer

Manipulação de estado imutável de forma intuitiva

axios

Cliente HTTP para requisições API

@radix-ui/react-slot

Slot para composição de componentes na Radix UI

@radix-ui/react-scroll-area

Área de rolagem customizável da Radix UI

🏗️ Como Rodar o Projeto

Para iniciar o servidor de desenvolvimento, utilize:

npm run dev

Isso abrirá o projeto no navegador na porta padrão do Vite.

📂 Estrutura do Projeto

A estrutura básica do projeto gerado pelo Vite pode ser semelhante a:

upload-web/
│── public/             # Arquivos estáticos
│── src/                # Código-fonte do projeto
│   ├── components/     # Componentes reutilizáveis
│   ├── http/           # API's
│   ├── store/          # Gerenciamento de estado com Zustand
│   ├── utils/          # Funções reutilizáveis
│── .gitignore          # Arquivos a serem ignorados no Git
│── package.json        # Configuração do projeto e dependências
│── tailwind.config.js  # Configuração do Tailwind CSS
│── vite.config.ts      # Configuração do Vite

📌 Considerações Finais

Este projeto utiliza tecnologias modernas para o desenvolvimento front-end com foco em desempenho e facilidade de manutenção.

Sinta-se à vontade para contribuir e personalizar conforme suas necessidades! 🚀