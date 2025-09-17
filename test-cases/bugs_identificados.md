# Bugs Identificados (para registro)

## 1. Duplicação de cadastro
- **Descrição**: API permite criar usuários com e-mail duplicado.  
- **Impacto**: Compromete integridade dos dados.  
- **Correção sugerida**: adicionar restrição de unicidade no campo *email*.  

## 2. Falta de validação de dados no POST /users
- **Descrição**: Campos obrigatórios (*name, email, age, status*) ausentes retornam erro **500**.  
- **Impacto**: Mau tratamento de entrada inválida, falha inesperada no servidor.  
- **Correção sugerida**: validar obrigatoriedade dos campos e retornar **400 Bad Request**.  

## 3. Códigos HTTP incorretos
- **Descrição**: API retorna **500** em vez de erros **4xx** para entradas inválidas.  
- **Impacto**: Prejudica usabilidade e integração de clientes com a API.  
- **Correção sugerida**: corrigir tratamento de exceções e mapear corretamente códigos de status.  

## 4. Paginação inconsistente (GET /users?page=...&limit=...)
- **Descrição**: Resultados diferentes para mesmas consultas, comportamento imprevisível.  
- **Impacto**: Afeta confiabilidade de listagem de dados.  
- **Correção sugerida**: revisar lógica de cálculo de *offset* e *limit*.  

## 5. PUT /users/{id} não valida campo age
- **Descrição**: Campo *age* aceita valores inválidos (ex.: string), resultando em erro **500**.  
- **Impacto**: Falta de robustez e quebra de consistência de dados.  
- **Correção sugerida**: validar tipos de dados e retornar **400 Bad Request** quando inválido.  

## 6. Falhas em testes de API
- **Descrição**: Casos *test_get_user_pages* e *test_Post_users_data* não passaram.  
- **Impacto**: Indicam comportamentos inconsistentes na API.  
- **Correção sugerida**: revisar lógica de paginação e criação de usuários.  
