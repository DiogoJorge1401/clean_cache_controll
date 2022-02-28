Feature: Cliente online

  Como um cliente online
  Quero que o sistema mostre minhas compras
  Para eu poder controlar minhas despesas

  Scenario: Obter dados da API

Dado que o cliente tem conexão com a internet
Quando o cliente solicitar para carregar suas compras
Então o sistema deverá exibir elas vindas de uma API
E substituir os dados do cache com os dados mais atuais

Feature: Cliente offline

  Como um cliente offline
  Quero que o sistema mostre minhas últimas compras gravadas
  Para eu poder ver minhas despesas sem ter internet

  Scenario: Obter dados do Cache

Dado que o cliente não tem conexão com a internet
E existe algum dado gravado no cache
E os dados do cache forem mais novos do que 3 dias
Quando o cliente solicitar para carregar suas compras
Então o sistema deve exibir suas compras vindas do cacheu

Dado que o cliente não tem conexão com a internet
E existe algum dado gravado no cache
E os dados do cache não forem mais novos ou iguais do que 3 dias
Quando o cliente solicitar para carregar suas compras
Então o sistema deve exibir uma mensagem de erro

Dado que o cliente não tem conexão com a internet
E o cache esteja vazio
Quando o cliente solicitar para carregar suas compras
Então o sistema deve exibir uma mensagem de erro
