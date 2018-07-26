<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <v-text-field prepend-icon="search" v-model="searchTerm" hide-details single-line></v-text-field>
            </v-toolbar>
            <v-card-text>
                <b-navbar>
                    <b-navbar-nav class="barTabs">
                        <b-nav-item class="barTab"  router  v-for="barChart in barCharts" :key="barChart.title" v-on:click="barChart.render" exact>{{barChart.title}}</b-nav-item>
                        <!-- <v-list class="barTabs">
                    <v-list-tile router v-for="barChart in barCharts" :key="barChart.title"  exact>
                        <v-list-tile-action>
                            <v-icon>{{ barChart.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ barChart.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list> -->
                    </b-navbar-nav>
                </b-navbar>
                <!-- <button v-on:click="greet">Number of Opens</button>
                <button v-on:click="greet">Average Open Time</button> -->
                <div id="barchart-container" class="svg-container"></div>
            </v-card-text>
        </v-card>
    </v-layout>
</v-container>
</template>

<style>
  p{
        text-indent: 40px;
        position: relative;

    }


    .axis text {
        font: 10px sans-serif;


    }

    .axis path,
    .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
    }      

    .axis text  {
        font: 10px Times;
        font-size: 16px;
        font-weight: bold;
        color: white;
    }
    .barTab{
        padding-right: 10px;
        cursor: pointer;
    }
    .barTab:active{
        color: green;
    }
</style>

<script>
import * as d3 from 'd3'
import * as foPp from '../../../../FoNodeModules/FoPreprocessor'

export default {
  name: 'open-chart',
  data () {
    return {
      docId: this.$route.params.id,
      barCharts: [
          {title: 'Number of Opens', render: this.renderOpenCount},
          {title: 'Average Open Time', render: this.renderAverageOpenTime}
      ],
      searchTerm: '',
      data: [50, 90, 20, 100, 40, 50],
      docData: null,
      openCount: null,
      averagOpenTime: null,
      line: '',
      graphMargin: null,
      graphWidth: 0,
      graphHeight: 0,
      graphSvg: null,
      xScale: null,
      yScale: null,
      xAxis: null,
      yAxis: null,
      graphSvg: null
    }
  },
  mounted: function () {
    this.initializeGraph();
    this.getData()
  },
  created: function () {},
  methods: {
    getData () {
      let $this = this
      $this.$http.get('https://pubtest.fileopen.com/api/analytics/file/' + $this.docId).then(response => {
        $this.docData = response.body
        // NOTE: Data is an array of entries, this prints the first entry
        console.log($this.docData)
        var output = foPp.countData(this.docData, 'user.email')
        console.log(output);
        var output = d3.entries(output);
        
        $this.renderBarGraph(output, "Number of Opens per User");

        // NOTE: This is where I would call it calculate the data and create the graphic
        //       However, it currently uses static test data so it isn't necessary
      }, response => {
        console.error(response)
      })
    },
    renderBarGraph(data, yAxisLabel){
        let $this = this;
      //counts the entries by email

      


        



        

        // Define SVG. "g" means group SVG elements together.
        console.log("Got to through scaling");
        //Creates svg element to place shapes e.g rectangles.(makes svg container)
        
            //This attribute applies a list of transformations to an element and sub-elments.
            //Tells the SVG Group Element, "g", to do a transformation where by it translates the element and sub-elements by 
            //moving to $this.graphMargin.left value from earlier code, margin.top value from earlier code.(topleft)
        
        console.log(data);

        //The domain is used for data of space.
        //Lets D3 know what the scope of data will it have and they are then passed to the scale function.
        $this.xScale.domain(data.map(function (d) { return d.key; }));
        //(function(d) { return d.key; }) returns all the 'key' values in 'data'. This is then passed to the scale function.
        //(.map) function that finds the maximum and minimum values in the array and then passed to the scale function.
        //The (.domain) function which returns those maximum and minimum values to D3 as the range for the x axis.
        $this.yScale.domain([0, d3.max(data, function (d) {return d.value; })]);
        //Tells y axis goes from 0 to the maximum in the data range.
        //0 is the starting point.


        console.log("X bandwidth");
        console.log($this.xScale.bandwidth());
        // Creating rectangular bars to represent the data. 
        // you can create circle or anytype of shape you want here.

        //selection of rectangles and creates rectangles
        $this.graphSvg.selectAll("rect")
            .data(data)
            //Allows us to attach data of any type
            .enter()
            //Allows us to bind the data to the empty selection
            .append("rect")
            .attr("height", 0)
            .attr("y", $this.graphHeight)
            .attr("x", function (d) {return $this.xScale(d.key)})
            .transition()
            .duration(1000)
            .ease(d3.easeQuad)
            .attr("width", $this.xScale.bandwidth())
            .attr("height", function (d) {return $this.graphHeight - $this.yScale(d.value)})
            .attr("y", function (d){ return $this.yScale(d.value)})
            .attr("fill", function (d, i) { return "rgb(255, 105, " + (i * 20) + ")";});

        $this.graphSvg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function (d) {
                return d.value;
            })
            .attr("x", function (d) {
                return $this.xScale(d.key);
            })
            .attr("y", function (d) {
                return $this.yScale(d.value);
            })
            .attr("font-size", "11px")
            .attr("fill", "White")
            .attr("dx", "1.8em")
            //Moves text horizontaly.
            .attr("dy", ".85em")
            //Moves text verticaly.
            .style("text-anchor", "middle");

        // Draw xAxis and position the label at -60 degrees as shown on the output
        $this.graphSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + ($this.graphHeight + 0.1) + ")")
            .call($this.xAxis)
            .selectAll("text")
            //Selects all text in x axis.
            .attr("dx", ".1em")
            //Moves text verticaly.
            .attr("dy", "-.65em")
            //Moves text horizontaly.
            .style("text-anchor", "end")
            .attr("font-size", "6px")
            .attr("transform", function (d) {
                return "translate(" + this.getBBox().height * 0.1 + "," + this.getBBox().height + ")rotate(-60)";
                //Rotates text in x axis -60 degree.
            });

        // Draw yAxis and postion the label
        $this.graphSvg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0," + ($this.graphWidth - 690) + ")")
            .call($this.yAxis)
            .selectAll("text")
            //Selects all text element.
            .attr("dx", ".1em")
            //Moves text horizontaly.
            .attr("dy", ".30em")
            //Moves text vertically.
            .style("text-anchor", "end")
            .attr("font-size", "10px");

        //Displays the text
        $this.graphSvg.append("text")
            .attr("text-anchor", "middle")
            //This makes it easy to centre the text as the transform is applied to the anchor.
            .attr("transform", "translate(0," + ($this.graphWidth - 450) + ")rotate(-90)")
            //Text is drawn off the screen top left, move down and out and rotate.
            .attr("dx", "2em")
            //Moves text vertically.
            .attr("dy", "-2.25em")
            //Moves text horizontaly.
            .text(yAxisLabel);

        

        

    },
    renderAverageOpenTime(){
        let $this = this;
        if($this.averagOpenTime == null){
            $this.averagOpenTime = $this.getAverageOpenTime($this.docData);
        }
        if($this.graphSvg != null){
            $this.graphSvg.remove();
            d3.select("#barchart-container").select("svg").remove();
        }
        $this.initializeGraph();
        $this.renderBarGraph($this.averagOpenTime, "Average Length of Session");
        console.log("Render Open times");
    },
    getAverageOpenTime(data){
        var averageOpenTimes = d3.nest()
                                .key(function(d){return d.user.email;})
                                .rollup(function(v){
                                    return d3.mean(v, function(d){
                                        return d.session.length;
                                    });
                                })
                                .entries(data);
        console.log("Average Open times");
        console.log(averageOpenTimes);
        return averageOpenTimes;
            
    },
    renderOpenCount(){
        let $this = this;
        console.log("Render open count bar");
    },
    initializeGraph(){
        let $this = this;
        //Now render data
        $this.graphMargin = {top: 60, right: 20, bottom: 200, left: 50};
        //Sets margin for graphing area.
        //Margin generates space around elements. 
        //Each side of the element can be customizable by using top, right, bottom, and left. 
        $this.graphWidth = 760 - $this.graphMargin.left - $this.graphMargin.right,
        //Sets weidth of graphing area.
        $this.graphHeight = 500 - $this.graphMargin.top - $this.graphMargin.bottom;
        //Sets height of graphing area.
        
        // Define X and Y SCALE.
        //The range is used for visual space.
        $this.xScale = d3.scaleBand()
            //(d3.scale.ordinal) has discrete data set.
            .rangeRound([0, $this.graphWidth])
            .padding(0.1);
            // (.rangeRoundBands) specifies the range that those values will cover and makes the bars clean and spaced properly.
            //The range is specified as being from 0 to the width of the graphing area. 
            //It make starting point from 0 and end at the end of graph.
            //After 0.1 is specified for padding of 0.1 to create space.
        $this.yScale = d3.scaleLinear()
            //d3.scale.linear() has comparative numbers
            .range([$this.graphHeight, 0]);
            //(.range) specifies the range that those values will cover.
            //The range is specified as being from the height of the graphing area to 0. 
            //It make starting point from the height of the graphing area to 0.
        // Define X and Y AXIS

            //Variable is created known as the dollar_sign with value $

        $this.xAxis = d3.axisBottom($this.xScale);

        $this.yAxis = d3.axisLeft($this.yScale)
            .ticks(5);
        
        $this.graphSvg = $this.initializeSvg();
        

    },
    initializeSvg(){
        let $this = this;
        var svg = d3.select("#barchart-container").append("svg")
            //Creates svg variable.
            //It will find the body and append a new svg element just before the closing the body.
            .attr("width", $this.graphWidth + $this.graphMargin.left + $this.graphMargin.right)
            //Width is refrenced from earlier code located at var margin.
            .attr("height", $this.graphHeight + $this.graphMargin.top + $this.graphMargin.bottom)
            //Height is refrenced from earlier code located at var margin.
            .append("g")
            //Groups svg element together.
            .attr("transform", "translate(" + $this.graphMargin.left + "," + $this.graphMargin.top + ")");
        return svg;
    }
  }
}
</script>
