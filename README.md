# 📍 UBS Finder

UBS Finder é um aplicativo mobile que ajuda qualquer pessoa a encontrar rapidamente unidades de saúde pública perto de onde está — UBS, postos de saúde, CAPS e outros serviços do SUS. O app nasceu de um problema simples: muita gente não sabe onde fica a UBS do próprio bairro, qual o horário de funcionamento ou quais serviços estão disponíveis. Esse app resolve isso de forma direta e acessível.

---

## Funcionalidades

Na tela principal, o usuário vê uma lista de unidades de saúde com nome, endereço e bairro, podendo filtrar por tipo (UBS, Posto, CAPS, Urgência) ou buscar pelo nome da unidade. Ao tocar em qualquer item, abre a tela de detalhes com todas as informações disponíveis — serviços oferecidos, horário de funcionamento e um botão que abre a localização direto no Google Maps.

Também é possível salvar unidades como favoritas para acessar rapidamente depois, sem precisar buscar novamente. E uma tela informativa explica brevemente como funciona a rede de atenção básica do SUS, com link para o portal de saúde do município.

---

## Tecnologias usadas

O app foi construído com React Native e Expo, usando React Navigation para a navegação entre telas e AsyncStorage para salvar os favoritos localmente no dispositivo. Os dados vêm do CNES (Cadastro Nacional de Estabelecimentos de Saúde), disponíveis gratuitamente no portal dados.saude.gov.br.

