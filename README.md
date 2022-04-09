<!-- # Example app with [chakra-ui](https://github.com/chakra-ui/chakra-ui)

This example features how to use [chakra-ui](https://github.com/chakra-ui/chakra-ui) as the component library within a Next.js app.

We are connecting the Next.js `_app.js` with `chakra-ui`'s Theme and ColorMode containers so the pages can have app-wide dark/light mode. We are also creating some components which shows the usage of `chakra-ui`'s style props.

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-chakra-ui)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui&project-name=with-chakra-ui&repository-name=with-chakra-ui)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-chakra-ui with-chakra-ui-app
# or
yarn create next-app --example with-chakra-ui with-chakra-ui-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Notes

Chakra has supported Gradients and RTL in `v1.1`. To utilize RTL, [add RTL direction and swap](https://chakra-ui.com/docs/features/rtl-support).

If you don't have multi-direction app, you should make `<Html lang="ar" dir="rtl">` inside `_document.js`. -->

<div id="top"></div>
<!--
*** Thanks for checking out the bug-tracker. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
  ![Bug-Tracker Logo](client/src/Pages/Login/bugTrackerWhite.png "Bug-Tracker Logo")

  <h3 align="center">The Bug-Tracker application is a ticket management system that enables a group of users to effectively track issues.</h3>

  <p align="center">
    <br />
    <a href="https://github.com/ej1seven/bug-tracker"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://bug-tracker.dev/">View Demo</a>
    ·
    <a href="https://github.com/ej1seven/bug-tracker/issues">Report Bug</a>
    ·
    <a href="https://github.com/ej1seven/bug-tracker/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This application enables users to create, modify and remove tickets. Users can also add comments to tickets as well as check ticket history. This application includes additional features such as authorization, user role assignment, and project management.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

<!-- - [Next.js](https://nextjs.org/) -->

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Postgresql](https://postgresql.org/)
- [MaterialUI](https://mui.com/)
- [Bootstrap](https://getbootstrap.com/)
<!-- - [Chakra](https://chakra-ui.com/)
- [FontAwesome](https://fontawesome.com/)
- [GraphQl](https:///graphql.org/)
- [ApolloServer](https://www.apollographql.com/) -->
<!-- - [Redis](https://redis.io/)
- [Nodemailer](https://nodemailer.com/)
- [Typescript](https://typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Urql](https://formidable.com/open-source/urql/)
- [MikroOrm](https://mikro-orm.io/)
- [Argon2](https://www.npmjs.com/package/argon2)
- [Dataloader](https://www.npmjs.com/package/dataloader)
- [Vercel](https://vercel.com/) -->

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/Ej1seven/bug-tracker.git
   ```

2. Install NPM packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

### MVP / User Stories

- [x] As a user, I can create new tickets
- [x] As a user, I can edit tickets
- [x] As a user, I can delete tickets
- [x] As a user, I can assign tickets to other users
- [x] As a user, I can view tickets
- [x] As a user, I can reassign roles to users
- [x] As a user, I can create a new project
- [x] As a user, I can add users to a project
- [x] As a user, I can remove users from a project
- [x] As a user, I can add comments to a ticket
- [x] As a user, I can view the ticket history

See the [open issues](https://github.com/ej1seven/bug-tracker/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Erik Hunter - <erikhunter@erikhunter.dev>

Project Link: [https://github.com/Ej1seven/bug-tracker](https://github.com/Ej1seven/bug-tracker)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/ej1seven/bug-tracker?style=plastic
[contributors-url]: https://github.com/ej1seven/bug-tracker/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ej1seven/bug-tracker.svg?style=plastic
[forks-url]: https://github.com/ej1seven/bug-tracker/network/members
[stars-shield]: https://img.shields.io/github/stars/ej1seven/bug-tracker.svg?style=plastic
[stars-url]: https://github.com/ej1seven/bug-tracker/stargazers
[issues-shield]: https://img.shields.io/github/issues/ej1seven/bug-tracker.svg?style=plastic
[issues-url]: https://github.com/ej1seven/bug-tracker/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=plastic&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/erik-hunter/
[product-screenshot]: images/screenshot.png

```

```

```

```

```

```
