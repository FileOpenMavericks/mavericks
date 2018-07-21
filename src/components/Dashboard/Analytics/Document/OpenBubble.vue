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
import * as topojson from 'topojson';

export default {
    name: 'open-bubble',
    data() {
        return {
            searchTerm: '',
            data: [50, 90, 20, 100, 40, 50],
            linkData: null,
            line: ''
        }
    },
    mounted: function() {
        //Doc Ref Id: 9c80af62b1094bdfab633019b2d10c1e
        //this.updateMap('9c80af62b1094bdfab633019b2d10c1e');
        //All longs and lats 52f2468e05f743ca9911abe07c196363
        this.updateMap("52f2468e05f743ca9911abe07c196363");

        
    },
    created: function() {},
    methods: {
        updateMap(docRefId){
            let $this = this;
            $this.$http.get('https://pubtest.fileopen.com/api/analytics/file/' + docRefId).then(response => {
                $this.fileData = response.body;
                // NOTE: Data is an array of entries, this prints the first entry
                console.log($this.fileData);

                // NOTE: This is where I would call it calculate the data and create the graphic
                //       However, it currently uses static test data so it isn't necessary
                this.renderData($this.fileData);
            }, response => {
                console.error(response);
            });
        },
        renderData(sessionData){

        },
        getMargin(){
            var margin = {top: 0, right: 0, bottom: 0, left: 0};
            var width = window.innerWidth - margin.left - margin.right;
            var height  = window.innerHeight - margin.top - margin.bottom;
            return margin;
        },
        getProjection(width, height){
            var projection = d3.geoEquirectangular()
                                .translate([width / 2, height / 2])
                                .scale(width / 2.5 / Math.PI)
                                .rotate([0]);
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
            
            return svg;
        },
        makeG(svg, width, height){
            var g = svg.append("g")
                    .attr("width", width)
                    .attr("height", height);
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
