<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <v-text-field prepend-icon="search" v-model="searchTerm" hide-details single-line></v-text-field>
            </v-toolbar>
            <v-card-text>
                <div id="heatchart-container" class="svg-container"></div>
            </v-card-text>
        </v-card>
    </v-layout>
</v-container>
</template>

<style>

</style>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson';

export default {
    name: 'open-chart',
    data(){
      return {
      };
    },
    mounted: function(){
      console.log(' Fuck You')
    },
    created: function() {},
    methods: {

    }
}
</script>
