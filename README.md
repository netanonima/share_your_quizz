# share_your_quizz

![](https://img.shields.io/github/license/netanonima/share_your_quizz.svg?style=flat-square)
![](https://img.shields.io/github/stars/netanonima/share_your_quizz.svg?style=flat-square)

An app to generate dynamic quizz and share them with your friends, customers, students, etc for free.

## Contents

- [Installation](#installation)
- [Usage without installation](#usage_without_installation)
- [Technologies used](#technologies)
    - [backend](#technologies-backend)
    - [frontend](#technologies-frontend)
    - [api](#technologies-api)
- [Author](#author)
- [Donate](#donate)
- [License](#license)

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
- Change your JWT secret by a strong one in `backend/src/auth/constants.ts`
- Copy 'backend/.env-lock' to 'backend/.env' and set your values
- Launch the backend
  ```bash
    cd backend
    npm run start:dev
  ```
- Launch the frontend
  ```bash
    cd frontend_angular
    npm i
    ng serve
  ```
- Open your browser and go to [localhost:8080](http://localhost:8080)

## Usage without installation

Just visit [share_your_quizz](https://upcoming.url/)

## Technologies used

### Technologies backend

- [Nestjs](https://nestjs.com/)

### Technologies frontend

- [Vuejs](https://vuejs.org/)

### Technologies api

- [apiRest](https://en.wikipedia.org/wiki/Representational_state_transfer)
- [websocket](https://en.wikipedia.org/wiki/WebSocket)

## Author

[netanonima (Flavio Bertolini)](https://github.com/netanonima)


## Donate

If you like this project and wish to say thanks - I'm always open to a coffee!  :coffee:

<a href="https://www.buymeacoffee.com/netanonima" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/black_img.png" alt="Buy Me A Coffee" width='180px' ></a>

## License

[MIT](https://github.com/netanonima/share_your_quizz/blob/master/LICENSE)

You are welcome to use this however you wish within the MIT license, but please retain [my credentials](https://github.com/netanonima) and links back to [this repo](https://github.com/netanonima/share_your_quizz.svg).