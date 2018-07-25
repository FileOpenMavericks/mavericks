<template>
<v-app>
    <v-container fluid fill-height grid-list-md>
        <v-layout row wrap>
            <router-view></router-view>
        </v-layout>
    </v-container>
</v-app>
</template>

<style>
@import '../node_modules/vuetify/dist/vuetify.min.css';

.navbar {
    z-index: 100;
}

html {
    font-size: 16px;
}

.container.fluid, .flex {
  padding: 0 !important;
}

.content h2 {
    font-weight: 300;
    font-size: 2rem;
    font-family: 'Roboto', sans-serif;
}

.content-center {
    margin: auto;
}

.content, .setup {
    margin-top: 10px;
}

.card.content {
    max-width: 640px;
}

.card-title {
    font-size: 2rem;
    padding-bottom: 20px;
}

.icon-big {
    font-size: 64px;
    width:100%;
    text-align: left;
    padding-bottom: 10px;
}
</style>

<script>
export default {
  name: 'app'
}
</script>
