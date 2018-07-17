<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <v-text-field prepend-icon="search" v-model="searchTerm" hide-details single-line></v-text-field>
            </v-toolbar>
            <v-card-text>
                <div id="map-container" class="svg-container"></div>
            </v-card-text>
        </v-card>
    </v-layout>
</v-container>
</template>

<style scoped>
.toolbar__content>button.btn.btn--icon>.btn__content>i {
    color: rgba(0, 0, 0, 0.54);
}

.toolbar {
    padding-left: 10px;
    padding-right: 10px;
    background: white;
    box-shadow: none;
}

nav.toolbar.file-toolbar {
    background: white;
    box-shadow: none;
}

.file-toolbar {
    box-shadow: none;
    height: 56px;
}

.toolbar__content {
    background: white;
}
</style>

<script>
import * as d3 from 'd3';

export default {
    name: 'open-geo',
    data() {
        return {
            searchTerm: '',
            data: [50, 90, 20, 100, 40, 50],
            linkData: null,
            line: ''
        }
    },
    mounted: function() {
        var margin = this.getMargin();
        var colors = d3.scaleOrdinal(d3.schemeCategory10);
        
        //Acquiring the projection via the margin
        var projection = this.getProjection(margin);
        console.log("Generated projection");
        console.log(projection);
        
        //Setting a path with the projection
        var path = d3.geoPath()
                    .projection(projection);
        console.log(path);
        var svg = this.makeSvg(path, margin);
        console.log("SVG:");
        console.log(svg);
    },
    created: function() {},
    methods: {
        getMargin(){
            var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = window.innerWidth - margin.left - margin.right,
            height  = window.innerHeight - margin.top - margin.bottom;
            return margin;
        },
        getProjection(margin){
            var projection = d3.geoEquirectangular()
                                .translate(margin.width / 2, margin.height / 2)
                                .scale(margin.width / 2.5 / Math.PI)
                                .rotate(180);
            return projection;
        },
        makeSvg(path, margin){
            //May need cleaning in terms of the view box
            var svg = d3.select("div#map-container")
                .append("svg")
                .attr("width", margin.width)
                .attr("height", margin.height)
                .append("g")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 300 300")
                .classed("svg-content", true)
                .classed("svg-container", true);
            return svg;
        }

    }
}
</script>
