# Breakcore Icon Pack Android

Este projeto Android empacota o pack de icones breakcore em um APK com preview nativo, busca por app e copia rapida dos pacotes Android mais comuns.

## O que o app faz

- splash screen no estilo breakcore
- grade com os icones do pack
- busca por nome, slug ou pacote Android
- toque em um item para copiar os pacotes daquele app
- assets locais com o manifesto do pack e os PNGs

## Estrutura

- `app/src/main/assets/icons/`: icones PNG embarcados no APK
- `app/src/main/assets/icon-pack.json`: manifesto do pack
- `app/src/main/java/com/pocketdeck/remote/`: telas e logica do app

## Build

O projeto foi pensado para ser compilado pelo GitHub Actions em `.github/workflows/build-android-apk.yml`.

Quando o workflow rodar com sucesso, o artifact enviado sera o APK debug do icon pack.
