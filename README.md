# Cakto QA Evaluation - API de Usuários

## 🎯 Objetivo da Avaliação

Esta avaliação tem como objetivo testar suas habilidades como QA Engineer através de uma API REST que **intencionalmente contém bugs e edge cases**. Sua missão é identificar, documentar e automatizar testes para essas falhas. O objetivo deste teste é avaliar sua capacidade de investigação e testing. Você não precisa necessária cobrir TODOS os casos de teste ou TODOS endpoints. Queremos entender como você pensa!

## 🚀 Como Executar a API - Localmente

### Pré-requisitos
- Node.js 18+ instalado
- pnpm (gerenciador de pacotes)

### Instalação e Execução
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd cakto-qa-eval

# Instale as dependências
pnpm install

# Execute a API
pnpm start
```

A API também está disponível em: `https://cakto-qa-eval.fly.dev`

### 📮 Coleção do Postman
Para facilitar seus testes, incluímos uma coleção completa do Postman com todos os endpoints e casos de teste:

1. **Importe a coleção:** `postman_collection.json` (arquivo incluído no repositório)
2. **No Postman:** File > Import > Upload Files > Selecione `postman_collection.json`
3. **Configure a variável:** Verifique se a variável `base_url` está definida para o local correto caso esteja rodando localmente, como `http://localhost:3000` ou `https://cakto-qa-eval.fly.dev` caso esteja utilizando a API em Cloud.

A coleção inclui:
- ✅ Todos os endpoints CRUD
- 🔍 Casos de teste para filtros e busca
- 🐛 Edge cases e cenários de erro
- ⚡ Testes de performance
- 🔄 Testes de consistência

## 📋 Documentação da API

### Endpoints Disponíveis

#### 🏠 Endpoints Gerais
- `GET /` - Informações da API
- `GET /health` - Health check

#### 👥 Endpoints de Usuários (CRUD)
- `GET /users` - Listar usuários (com paginação)
- `GET /users/:id` - Buscar usuário por ID
- `POST /users` - Criar novo usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário

#### 🧪 Endpoints de Teste (Performance)
- `GET /memory-leak` - Endpoint que causa vazamento de memória
- `GET /slow-endpoint` - Endpoint com resposta lenta

### Estrutura do Usuário
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "age": 28,
  "status": "active", // "active", "inactive", "pending"
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Parâmetros de Query (GET /users)
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `status` - Filtrar por status ("active", "inactive", "pending")
- `search` - Buscar por nome ou email

## 🐛 Bugs Intencionais Incluídos na API

> **ATENÇÃO:** Esta API contém bugs propositais para avaliação. Sua tarefa é encontrá-los!

### Categorias de Bugs Implementados:

1. **🔍 Validação Inconsistente**
   - Validação de email nem sempre funciona
   - Nomes vazios às vezes são aceitos
   - Validação de idade inconsistente

2. **📊 Inconsistências de Dados**
   - Emails duplicados no banco de dados
   - Formatos de dados incorretos
   - Campos obrigatórios em branco

3. **🔄 Problemas de Estado**
   - Campo `updatedAt` nem sempre é atualizado
   - Códigos de status HTTP incorretos
   - Formatos de resposta inconsistentes

4. **⚡ Problemas de Performance**
   - Vazamento de memória em endpoints específicos
   - Endpoints com resposta excessivamente lenta
   - Falta de limite máximo na paginação

5. **🛡️ Problemas de Segurança**
   - Exposição de detalhes internos de erro
   - Falta de sanitização de dados
   - Possíveis vulnerabilidades de injeção

## 📋 Como Realizar o Teste Prático

### Passo 1: Fork do Repositório
- Faça um Fork deste repositório no seu GitHub pessoal
- **IMPORTANTE:** Deixe o repositório público

### Passo 2: Análise e Testes Manuais
Crie uma série de casos de teste manuais que cubram alguns casos de teste:

#### ✅ Casos de Teste disponíveis:
1. **CRUD Básico**
   - Criar usuário com dados válidos
   - Listar usuários com paginação
   - Buscar usuário por ID
   - Atualizar dados do usuário
   - Excluir usuário

2. **Validação de Dados**
   - Campos obrigatórios
   - Formatos de email inválidos
   - Idades negativas ou não numéricas
   - Status inválidos

3. **Edge Cases**
   - IDs inexistentes
   - Páginas negativas
   - Limites excessivos na paginação
   - Caracteres especiais
   - Dados duplicados

4. **Testes de Performance**
   - Tempo de resposta dos endpoints
   - Comportamento com grandes volumes de dados
   - Memory leaks

#### 📝 Formato dos Casos de Teste:
Para cada caso de teste, inclua:
- **Pré-condições**
- **Passos detalhados**
- **Resultado esperado**
- **Resultado atual**
- **Status** (Pass/Fail/Bug)

### Passo 3: Automação de Testes
Escreva scripts automatizados para os casos de teste mais importantes que devem estar em um conjunto de testes de regressão.

#### 🔧 Linguagens Aceitas:
- **Python** (preferencial)
- JavaScript
- Java
- Ruby

> **NOTA:** Evite frameworks que apenas gravam casos de teste

### Passo 4: Documentação
Documente todos os bugs encontrados incluindo:
- Descrição do bug
- Passos para reproduzir
- Resultado esperado vs atual
- Severidade/Prioridade
- Sugestões de correção

## 📁 Estrutura de Entrega

Organize seus arquivos da seguinte forma:
```
├── test-cases/
│   ├── manual-test-cases.md (ou .xlsx, .json)
│   └── bug-report.md
├── automation/
│   ├── tests/
│   ├── requirements.txt (ou package.json)
│   └── README.md
└── README.md (suas considerações finais)
```

## 🎯 Critérios de Avaliação

Você será avaliado com base em:

1. **Completude** - Quantos bugs você conseguiu identificar?
2. **Qualidade da Documentação** - Casos de teste bem escritos e claros?
3. **Automação** - Scripts bem estruturados e funcionais?
4. **Análise Crítica** - Qualidade das sugestões de melhoria?
5. **Metodologia** - Abordagem sistemática para os testes?

## 🔍 Dicas para o Candidato

- ✅ Execute múltiplas tentativas do mesmo endpoint
- ✅ Teste edge cases e cenários negativos
- ✅ Monitore os logs da aplicação
- ✅ Teste diferentes combinações de parâmetros
- ✅ Verifique consistência entre operações
- ✅ Analise performance e comportamento sob carga

## 📞 Dúvidas?

Se tiver dúvidas sobre a avaliação:
- Abra uma issue neste repositório
- Entre em contato com o time de recrutamento

---

**Boa sorte! 🍀**

Esperamos ver sua abordagem metodológica e atenção aos detalhes na identificação e documentação dos problemas desta API.