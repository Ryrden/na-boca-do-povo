# Na Boca Do Povo

![GitHub language count](https://img.shields.io/github/languages/count/ryrden/na-boca-do-povo)
![Github repo size](https://img.shields.io/github/repo-size/ryrden/na-boca-do-povo)
![Github stars](https://img.shields.io/github/stars/ryrden/na-boca-do-povo)

![Capa do Projeto](./video-app.gif)

> Trabalho 2 da disciplina de Desenvolvimento Web Mobile oferecida pelo professor Adenilso Simão no semestre 1 de 2023

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter as seguintes dependências instaladas:

- Antes de começar, verifique se você possui o `NodeJs` instalado em sua máquina. Se não tiver, você pode baixar o `NodeJs` [aqui](https://nodejs.org/pt-br/download).

## Como executar o projeto

Siga as etapas abaixo para executar o projeto em sua máquina local:

Execute os seguintes comandos a partir da pasta raiz do projeto:

### Clone este repositório

```bash
git clone https://github.com/joelcoelho29/defesas-icmc-usp
```

Este link pode ser encontrado no botão verde acima `Code`.

### Instale as dependências

```bash
npm install
```

### Execute o Projeto

```bash
npm run dev
```

### Gere uma APK para Android

```bash
cd src-cordova
npm run build-android
bundletool build-apks --bundle=app-release.aab --output=app.apks --mode=universal
```

Troque o nome de app.apks para app.zip e extraia app.zip

Instale o arquivo universal.apk em um dispositivo Android

### Rode o Linter

```bash
npm run lint
```

## Como contribuir

Se você deseja contribuir para este projeto, siga as etapas abaixo:

1. Faça um fork deste repositório.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faça suas alterações e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin <nome_do_projeto> / <local>`
5. Criar a solicitação de pull.

Como alternativa, consulte a documentação do GitHub sobre [como criar uma solicitação de pull](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Membros do Projeto

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/joaolucasp">
        <img src="https://github.com/joaolucasp.png" width="100px">
        <br>
        <sub>
          <b>Joaolucasp</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/joelcoelho29">
        <img src="https://github.com/joelcoelho29.png" width="100px">
        <br>
        <sub>
          <b>Joelcoelho29</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ryrden">
        <img src="https://github.com/ryrden.png" width="100px">
        <br>
        <sub>
          <b>Ryrden</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## Licença

Este projeto está sob licença. Consulte [LICENSE](LICENSE) para obter mais informações.

## Voltar ao topo

[⬆ Voltar ao topo](#na-boca-do-povo)
