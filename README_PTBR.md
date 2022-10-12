# Password-Manager

<!---Esses são exemplos. Veja https://shields.io para outras pessoas ou para personalizar este conjunto de escudos. Você pode querer incluir dependências, status do projeto e informações de licença aqui--->

<img src="initial_image.png" alt="password manager">

# [README - ENGLISH](README.md)

> Password-Manager é uma aplicação Desktop que gerencia, gera e salva sua senhas em um banco de dados encriptado.

## Sobre o projeto

Password-Manager usa o seu usuário e sua senha para gerar uma chave de encriptação que é usada para encriptar o banco de dados.<br>
O projeto foi criado com o propósito principal de aprendizado. Contribuições são *extremamente* bem vindas.


### Construído com
* [![React][React.js]][React-url]
* [![Electron][Electron.js]][Electron-url]
* [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers)
* [generate-password](https://github.com/brendanashworth/generate-password)

## Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [ ] Sincronizar arquivo database na nuvem(ex: DROPBOX/GOOGLE DRIVE)
- [ ] Adicionar tema escuro

## Pré-requisitos

* npm
  ```sh
  npm install npm@latest -g
  ```

## Instalação

1. Clone o repositório
    ```sh
    git clone https://github.com/kenzotmg/Password-Manager
    cd password-manager
    ```
2. Instale os pacotes NPM
    ```sh
    npm install
    ```
3. Comece
    ```sh
    npm start
    ```

## Como contribuir
<!---Se o seu README for longo ou se você tiver algum processo ou etapas específicas que deseja que os contribuidores sigam, considere a criação de um arquivo CONTRIBUTING.md separado--->
1. Bifurque este repositório.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faça suas alterações e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin <nome_do_projeto> / <local>`
5. Crie a solicitação de pull.

Como alternativa, consulte a documentação do GitHub em [como criar uma solicitação pull](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 📝 Licença

Esse projeto é open-source e está sob licença [MIT](LICENSE.md)


[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Electron.js]: https://img.shields.io/badge/-Electron-61DAFB?style=for-the-badge&logo=Electron&logoColor=20232A
[Electron-url]: https://www.electronjs.org