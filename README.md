Mavericks
===

## Get Started

### Dependencies
`yarn`

### Set up
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
