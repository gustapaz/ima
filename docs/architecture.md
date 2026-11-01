# Arquitetura

Modo integrado: Inferno e Canvas consome oRPC e Zod na mesma origem. SSR entrega conteúdo editorial, imagens, metadados e navegação. ClientBoot monta o bundle após a hidratação do documento para evitar conflito entre runtimes.

`server/service.mjs`: domínio, validação e exportador. `api.mjs`: router próprio da stack. `routes.mjs`: operações. `store.mjs`: D1, revisão, autorização e TTL. `transport.mjs`: corpo limitado e erros padronizados.

Dois a seis pares, quatro habilidades sintéticas, foco ponderado e bloqueios. Até 720 permutações. Max-min seguido de soma ou maior soma, com empates determinísticos. Não é avaliação de pessoas reais.

Cada registro possui UUID, receita JSON, digest SHA-256 de token de 256 bits, revisão e timestamps UTC. UPDATE condicional por revisão impõe CAS. Contador atômico limita criações por hora UTC. Exclusão só do próprio recurso. Cliente guarda no máximo doze capacidades por aba e nunca as põe no URL.

O cliente oRPC nativo calcula por /api/rpc/match. REST /api/compute continua disponível como alternativa documentada; recursos usam HTTP.

Testes de integração usam Miniflare e migrações reais em diretório temporário. Smoke cria e remove somente seu próprio registro sintético. Não há reset público ou operação administrativa no cliente.
