# 🎬 CineList - Catálogo e Avaliação de Filmes

O **CineList** é uma aplicação mobile e web multiplataforma desenvolvida em **React Native** com **Expo** e **JavaScript**, criada para permitir que usuários cataloguem filmes assistidos, atribuam notas, escrevam resenhas e visualizem avaliações de outros usuários organizadas de forma agrupada por título.

O projeto foi arquitetado em camadas, aplicando gerenciamento global de estado, controle estrito de regras de negócio, compatibilidade *cross-platform* (iOS, Android e PC Web), acessibilidade e integração com serviços REST via MockAPI.

---

## 📌 Funcionalidades Principais

- 👤 **Autenticação e Sessão de Usuário**:
  - Login de identificação via `AuthContext`.
  - Vinculação automática do nome do autor em cada avaliação criada.
  - Funcionalidade para **Eliminar Usuário**, que apaga todas as avaliações do perfil ativo no servidor e encerra a sessão.

- 🍿 **Agrupamento Inteligente por Filme**:
  - Registros com o mesmo título (ignorando acentos e maiúsculas/minúsculas) são unificados em um único *Card*.
  - Exibição da **média geral das notas** de cada filme.
  - Listagem interna contendo os comentários e autores de cada resenha.

- 📝 **CRUD Completo de Avaliações**:
  - **GET**: Listagem e filtragem em tempo real por título.
  - **POST**: Publicação de novas avaliações.
  - **PUT**: Edição de resenhas existentes (disponível apenas para o autor da resenha).
  - **DELETE**: Remoção de avaliações individuais (disponível apenas para o autor da resenha).

- 🛡️ **Regras e Validações de Negócio**:
  - **Prevenção de Duplicidade Rigorosa**: Impede que o mesmo usuário cadastre mais de uma avaliação para o mesmo filme na mesma data (utilizando normalização de texto sem acentos e sem diferenciação de caixa alta/baixa).
  - Validação de preenchimento de campos obrigatórios (título, gênero e data).

- 💻📱 **Compatibilidade Multiplataforma (PC Web & Mobile)**:
  - **Foco de Formulário Corrigido**: Tratamento especial no PC Web para evitar perda de foco durante a digitação nos inputs.
  - **Ajuste Fino de Teclado**: Configuração para o Android (`softwareKeyboardLayoutMode: resize`), compensação da altura do cabeçalho via `useHeaderHeight` e rolagem automática dos campos no formulário.
  - **Diálogos Nativos Cross-Platform**: Uso de `window.confirm` / `window.alert` no PC Web e `Alert.alert` no Mobile para garantir o funcionamento correto das confirmações de exclusão.
  - **Layout Responsivo**: Dimensionamento dinâmico via `useWindowDimensions` e tratamento de teclado virtual com `KeyboardAvoidingView`.
  - **Acessibilidade & Design Dark/Neon**: Alto contraste visual, áreas de toque adequadas e suporte a leitores de tela com `accessibilityLabel`.

---

## 📦 Bibliotecas e Dependências

Para que o projeto rode perfeitamente, as seguintes bibliotecas são utilizadas:

### Dependências Principais:
- **`axios`**: Para requisições HTTP REST com o MockAPI.
- **`@react-navigation/native`**: Núcleo do React Navigation para gerenciamento de rotas.
- **`@react-navigation/native-stack`**: Navegação em pilha (Stack) para telas do app.
- **`@react-navigation/elements`**: Utilitários de interface para React Navigation (usado para calcular a altura do cabeçalho com `useHeaderHeight`).
- **`react-native-screens`**: Otimização de telas nativas para o React Navigation.
- **`react-native-safe-area-context`**: Trata áreas seguras em entalhes/notches de celulares.

---

## 📁 Estrutura do Projeto (Camadas)

A aplicação está organizada modularmente na pasta `src/`:

```text
cinelist/
├── assets/                  # Ícones, imagens e recursos visuais
├── src/
│   ├── components/          # Componentes visuais reutilizáveis (botões, inputs, cards)
│   ├── context/             # Gerenciamento de estado global da sessão (AuthContext)
│   ├── navigation/          # Navegação declarativa (React Navigation Stack)
│   ├── screens/             # Telas da aplicação (LoginScreen, ListScreen, FormScreen)
│   ├── services/            # Camada de comunicação com a API (Axios e cinelistApi)
│   └── utils/               # Funções auxiliares (validadores e leitores)
├── .env                     # Variáveis de ambiente locais (ignorado no Git)
├── .gitignore               # Configuração de arquivos ignorados no repositório
├── App.js                   # Ponto de entrada (AuthProvider + NavigationContainer)
├── app.json                 # Configurações do Expo (incluindo tratamento de teclado no Android)
├── package.json             # Dependências do projeto
└── README.md                # Documentação oficial
```

### Objetivos das Camadas:
1. **`components`**: Componentes visuais reutilizáveis (botões, inputs, cards)
2. **`context`**: Mantém o usuário logado na memória global da aplicação.
3. **`navigation`**: Protege as rotas, direcionando para o Login se o usuário não estiver autenticado.
4. **`screens`**: Controla as interações visuais, formulários e agrupamento dos dados.
5. **`services`**: Isola as chamadas HTTP (Axios) e regras REST da interface do usuário.
6. **`utils`**: Funções auxiliares (validadores e leitores)

---

## ⚙️ Configurações do Projeto

### 1. Schema do MockAPI
Por convenção, crie um **Resource** com o nome **`dados`** no [MockAPI.io](https://mockapi.io) configurado com o seguinte **Schema** (todos os campos com o tipo **`String`**, exceto ID):

| Field Name | Type | Descrição |
| :--- | :--- | :--- |
| `id` | `Object ID` | Identificador único gerado automaticamente |
| `titulo` | `String` | Título do filme |
| `genero` | `String` | Gênero (ex: Ação, Sci-Fi) |
| `plataforma` | `String` | Plataforma/Local onde assistiu (ex: Netflix, Cinema) |
| `nota` | `String` | Nota atribuída de 1 a 5 |
| `dataAssistido` | `String` | Data da exibição (AAAA-MM-DD) |
| `descricao` | `String` | Comentário ou resenha do usuário |
| `tipoRegistro` | `String` | Identificador do app (`cinelist_app`) |
| `usuario` | `String` | Nome do usuário que criou a avaliação |

### 2. Segurança e Variáveis de Ambiente (`.env`)
Para proteger as URLs da API no repositório público, o projeto utiliza variáveis de ambiente lidas nativamente pelo Expo (`EXPO_PUBLIC_`):

1. Crie um arquivo chamado **`.env`** na raiz do projeto:
   ```env
   EXPO_PUBLIC_API_URL=https://SUA_URL.mockapi.io
   ```
2. Um arquivo **`.env.example`** é mantido no repositório como modelo público.
3. O arquivo **`.env`** está incluso no **`.gitignore`** para garantir que credenciais não sejam publicadas.

### 3. Ajuste de Teclado no Android (`app.json`)
Para garantir que o teclado virtual redimensione a tela e não cubra os campos de texto no Android, a propriedade `"softwareKeyboardLayoutMode": "resize"` deve estar presente na seção `"android"` do arquivo `app.json`:

```json
"android": {
  "softwareKeyboardLayoutMode": "resize",
  "adaptiveIcon": {
    "backgroundColor": "#E6F4FE",
    "foregroundImage": "./assets/android-icon-foreground.png",
    "backgroundImage": "./assets/android-icon-background.png",
    "monochromeImage": "./assets/android-icon-monochrome.png"
  }
}
```

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- **Node.js** (versão 18 ou superior) instalado no computador.
- **Expo Go** instalado no celular (Android/iOS) ou um **Navegador Web** (Google Chrome, Edge, Firefox).

---

### 2. Instalação das Bibliotecas

Abra o terminal na pasta raiz do projeto e execute os comandos de instalação:

#### **Passo A: Instalar dependências base do projeto**
```bash
npm install
```

#### **Passo B: Instalar bibliotecas de Navegação, Elementos e API**
```bash
npm install axios @react-navigation/native @react-navigation/native-stack @react-navigation/elements
```

#### **Passo C: Instalar bibliotecas de suporte do Expo**
```bash
npx expo install react-native-screens react-native-safe-area-context
```

---

### 3. Configurar a API

No arquivo `src/services/api.js`, o Axios consome a variável de ambiente (sem a barra `/dados` no final):

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

---

### 4. Executar a Aplicação

Inicie o servidor de desenvolvimento do Expo com limpeza de cache:

```bash
npx expo start -c
```

#### **Opções para visualizar o aplicativo:**
- 💻 **No Computador (PC Web)**:
  Com o terminal rodando, pressione a tecla **`w`** para abrir o app diretamente no seu navegador web.
- 📱 **No Celular (Android / iOS)**:
  Abra o aplicativo **Expo Go** no smartphone e escaneie o **QR Code** exibido no terminal ou na aba do navegador.