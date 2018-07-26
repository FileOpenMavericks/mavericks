Mavericks
===
> UCSC CMPS 115 Summer 2018 project

## Overview
> **The Mavericks:** is separate link in the FileOpen website that allows authors, individuals who send their files to FileOpen to be encrypted and shared via a separate link, to see the analytics behind the file being shared.







## Get Started

### Dependencies
`node`
`yarn`


### Set up
1. Install node, yarn.
2. After cloning the repo to your local machine, install the dependencies described in the package.json, by using your package manager. If you are using yarn, run this command in the project's directory:
`yarn install`
3. Run the application.
`yarn run dev`

### Nginx Site

This will create a site under `localhost` with the project located at `/var/www/html/mavericks/`.

`/etc/nginx/sites-enable/default`
```
location / {
    root /var/www/html/mavericks/dist/;
    index index.html;

    if (-f $request_filename) {
        break;
    }

    rewrite (.+)$ /index.html break;
}
```

## Resources

[D3 Official Site](https://d3js.org/)

[Icons](https://material.io/tools/icons/) - Icons that can be used to make the application more visual and less wordy

[VueJS Getting Started](https://vuejs.org/v2/guide/)

[Vuetify](https://vuetifyjs.com/releases/0.17/#/vuetify/quick-start) - VueJS library that allows to easily make pretty components (any component prefaced with `v-` comes from it)

* NOTE: The project doesn't use the latest Vuetify
