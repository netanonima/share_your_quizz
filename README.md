# Share your quizz

![](https://img.shields.io/github/stars/netanonima/share_your_quizz.svg?style=flat-square)

Free web application allowing you to create quizzes (multiple choice questions) and play online games.

I invite people wishing to use the application to encourage an implementation by you. Without money entry and in case of large volumes I will limit the use of my implementation on  [Share-your-quizz.ch](https://www.share-your-quizz.ch).

Please read the [licence](LICENSE) and comply with it.

## Contents

- [Technologies used](#technologies)
    - [backend](#technologies-backend)
    - [frontend](#technologies-frontend)
    - [api](#technologies-api)
- [Author](#author)
- [Donate](#donate)
- [License](#license)
- [Installation](#installation)
- [Usage without installation](#usage_without_installation)

## Technologies used

### Technologies backend

- [Nestjs](https://nestjs.com/)

### Technologies frontend

- [Angular](https://angular.io/)

### Technologies api

- [apiRest](https://en.wikipedia.org/wiki/Representational_state_transfer)
- [socketIo](https://socket.io/fr/)

## Author

[netanonima (Flavio Bertolini)](https://github.com/netanonima)


## Donate

If you like this project and wish to say thanks - I'm always open to a coffee!  :coffee:

<a href="https://www.buymeacoffee.com/netanonima" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/black_img.png" alt="Buy Me A Coffee" width='180px' ></a>

## License

[LICENCE](LICENSE)

## Installation

- Clone the repository
- Install mysql or mariadb and create a database called `share_your_quizz`
- Install dependencies
  ```bash
    cd backend
    npm install
    cd ../frontend_angular
    npm install
  ```
- Install ffmpeg (backend side)
  - On linux
    ```bash
      sudo apt install ffmpeg
    ```
  - On windows
    ```batch
      choco install ffmpeg
    ```
- get the ffmpeg path
  - On linux
    ```bash
      which ffmpeg
    ```
  - On windows
    ```bash
      where ffmpeg
    ```
    It's usually `C:\ProgramData\chocolatey\lib\ffmpeg\tools\ffmpeg\bin`
- Change your JWT secret by a strong one in `backend/src/auth/constants.ts` copying `backend/src/auth/constants.ts-lock` to `backend/src/auth/constants.ts`
- Copy 'backend/.env-lock' to 'backend/.env' and set your values
- Copy 'backend/src/app.module.ts-lock' to 'backend/src/app.module.ts' and set your values
- Copy 'frontend_angular/src/app/constants.ts-lock' to 'frontend_angular/src/app/constants.ts' and set your values
- Launch the backend
  - For development
  ```bash
    cd backend
    npm run start:dev
  ```
  - For production
  ```bash
    npm run build
    cd dist
    node main.js
  ```
- Set your frontend constants in `frontend_angular/src/app/constants.ts` copying `frontend_angular/src/app/constants.ts-lock` to `frontend_angular/src/app/constants.ts`
- Launch the frontend
  ```bash
    cd frontend_angular
    npm i
  ```
  - For development
  ```bash
    ng serve
  ```
  - For production
  ```bash
    ng build --localize
  ```
- Open your browser and go to [localhost:8080](http://localhost:8080)
- For production you may need this .htaccess on apache server
  ```apacheconf
    RewriteEngine On
    RewriteBase /

    RewriteCond %{HTTP:Accept-Language} ^(de|es|fr|it) [NC]
    RewriteRule ^$ /%1/ [L,R]

    RewriteCond %{HTTP:Accept-Language} !^(de|es|fr|it) [NC]
    RewriteRule ^$ /en/ [L,R]

    RewriteRule ^([a-z]{2})/.*$ $1/index.html [L]
  ```

## Usage without installation

[share_your_quizz](https://www.share-your-quizz.ch)

I reserve the right to limit or even delete the use of this implementation.
Favor a custom implementation.

## Adding translations

```bash
ng extract-i18n --format=json --out-file src/locale/messages.json
```