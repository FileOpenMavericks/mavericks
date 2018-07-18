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
        var height = window.innerHeight - margin.top - margin.bottom;
        var width = window.innerWidth - margin.left - margin.right;
        var colors = d3.scaleOrdinal(d3.schemeCategory10);
        
        //Acquiring the projection via the margin
        var projection = this.getProjection(width, height);
        console.log("Generated projection");
        console.log(projection);
        
        //Setting a path with the projection
        var path = d3.geoPath()
                    .projection(projection);
        console.log("PATH:");
        console.log(path());
        var svg = this.makeSvg(path, width, height);
        console.log("SVG:");
        console.log(svg);
        var g = this.makeG(svg, margin);
        console.log("G unit:");
        console.log(g);

        //Get tool tip
        var tooltip = this.makeToolTip();
        
        
    },
    created: function() {},
    methods: {
        getMargin(){
            var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = window.innerWidth - margin.left - margin.right,
            height  = window.innerHeight - margin.top - margin.bottom;
            return margin;
        },
        getProjection(width, height){
            var projection = d3.geoEquirectangular()
                                .translate([width / 2, height / 2])
                                .scale(width / 2.5 / Math.PI)
                                .rotate(180);
            console.log(projection);
            return projection;
        },
        makeSvg(path, width, height){
            //May need cleaning in terms of the view box
            var svg = d3.select("div#map-container")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 300 300")
                .classed("svg-content", true)
                .classed("svg-container", true);
            
            //Add water
            svg.append("path")
                .datum({type: "Sphere"})
                .attr("class", "water")
                .attr("d", path);
            return svg;
        },
        makeG(svg, margin){
            var g = svg.append("g")
                    .attr("height", margin.height);
            return g;
        },
        makeToolTip(){
            var tooltip = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
            return tooltip;
        }

    }
}
</script>
