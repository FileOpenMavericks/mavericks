<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <v-text-field prepend-icon="search" v-model="searchTerm" hide-details single-line></v-text-field>
            </v-toolbar>
            <v-card-text>
                <div id="barchart-container" class="svg-container"></div>
            </v-card-text>
        </v-card>
    </v-layout>
</v-container>
</template>

<style>

</style>

<script>
import * as d3 from 'd3'
import * as foPp from '../../../../FoNodeModules/FoPreprocessor'

export default {
  name: 'open-chart',
  data () {
    return {
      searchTerm: '',
      data: [50, 90, 20, 100, 40, 50],
      linkData: null,
      line: ''
    }
  },
  mounted: function () {
    this.getData()
  },
  created: function () {},
  methods: {
    getData () {
      let $this = this
      let linkId = '426732708eee4929bd0ecbe9a4fc0b18'
      $this.$http.get('https://pubtest.fileopen.com/api/analytics/link/' + linkId).then(response => {
        $this.linkData = response.body
        // NOTE: Data is an array of entries, this prints the first entry
        console.log($this.linkData)
        var output = foPp.countData(this.linkData, 'user.email')
        console.log(output);
        $this.renderOpenCountData(output);

        // NOTE: This is where I would call it calculate the data and create the graphic
        //       However, it currently uses static test data so it isn't necessary
      }, response => {
        console.error(response)
      })
    },
    renderOpenCountData(data){
      //counts the entries by email

      //Now render data
      var margin = {top: 60, right: 20, bottom: 50, left: 50},
        //Sets margin for graphing area.
        //Margin generates space around elements. 
        //Each side of the element can be customizable by using top, right, bottom, and left. 
        width = 760 - margin.left - margin.right,
        //Sets weidth of graphing area.
        height = 500 - margin.top - margin.bottom;
        //Sets height of graphing area.


        // Define X and Y SCALE.
        //The range is used for visual space.
        var xScale = d3.scaleBand()
            //(d3.scale.ordinal) has discrete data set.
            .rangeRound([0, width], 0.1);
            // (.rangeRoundBands) specifies the range that those values will cover and makes the bars clean and spaced properly.
            //The range is specified as being from 0 to the width of the graphing area. 
            //It make starting point from 0 and end at the end of graph.
            //After 0.1 is specified for padding of 0.1 to create space.
        var yScale = d3.scaleLinear()
            //d3.scale.linear() has comparative numbers
            .range([height, 0]);
            //(.range) specifies the range that those values will cover.
            //The range is specified as being from the height of the graphing area to 0. 
            //It make starting point from the height of the graphing area to 0.




        // Define X and Y AXIS

        var  dollar_sign = d3.format("$");
            //Variable is created known as the dollar_sign with value $

        var xAxis = d3.axisBottom(xScale);

        var yAxis = d3.axisLeft(yScale)
            .ticks(5)
            //Creats interval of 5 in y axis.
            .tickFormat(dollar_sign);
            //It gets dollar_sign value from dollar_sign variable and displays it.

        // Define SVG. "g" means group SVG elements together.
        console.log("Got to through scaling");
        //Creates svg element to place shapes e.g rectangles.(makes svg container)
        var svg = d3.select("#barchart-container").append("svg")
            //Creates svg variable.
            //It will find the body and append a new svg element just before the closing the body.
            .attr("width", width + margin.left + margin.right)
            //Width is refrenced from earlier code located at var margin.
            .attr("height", height + margin.top + margin.bottom)
            //Height is refrenced from earlier code located at var margin.
            .append("g")
            //Groups svg element together.
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //This attribute applies a list of transformations to an element and sub-elments.
            //Tells the SVG Group Element, "g", to do a transformation where by it translates the element and sub-elements by 
            //moving to margin.left value from earlier code, margin.top value from earlier code.(topleft)
        

    }
  }
}
</script>
