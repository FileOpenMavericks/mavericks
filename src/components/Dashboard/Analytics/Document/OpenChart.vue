<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">

            </v-toolbar>
            <v-card-text>
                <div id="heatChart-container" class="svg-container"></div>
            </v-card-text>
        </v-card>
    </v-layout>
</v-container>
</template>

<style>
rect.bordered {
  stroke: #E6E6E6;
  stroke-width:2px;
}

text.mono {
  font-size: 9pt;
  font-family: Consolas, courier;
  fill: #aaa;
}

text.axis-workweek {
  fill: #000;
}

text.axis-worktime {
  fill: #000;
}
</style>

<script>
import * as d3 from 'd3'
import * as foPp from '../../../../FoNodeModules/FoPreprocessor'

export default {
    name: 'open-chart',
    data() {
        return {
            searchTerm: '',
            data: [50, 90, 20, 100, 40, 50],
            linkData: null,
            line: ''
        }
    },
    mounted: function(){
      console.log("mounted");
      this.getData();
    },
    created: function() {},
    methods: {
      getData() {
          let $this = this;
          let linkId = '426732708eee4929bd0ecbe9a4fc0b18'
          $this.$http.get('https://pubtest.fileopen.com/api/analytics/link/' + linkId).then(response => {
              $this.linkData = response.body;
              // NOTE: Data is an array of entries, this prints the first entry
              console.log($this.linkData);
              var output = foPp.countData(this.linkData, "user.email");
              console.log(output);
              $this.renderData($this.linkData);
              // NOTE: This is where I would call it calculate the data and create the graphic
              //       However, it currently uses static test data so it isn't necessary
          }, response => {
              console.error(response);
          });
      },
      renderData(sessionData){
        var margin = { top: 50, right: 0, bottom: 100, left: 30 },
            width = 960 - margin.left - margin.right,
            height = 430 - margin.top - margin.bottom,
            gridSize = Math.floor(width / 24),
            legendElementWidth = gridSize*2,
            buckets = 9,
            colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
            days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Oct", "Dec"];

        var svg = d3.select("#heatChart-container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dayLabels = svg.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
              .text(function (d) { return d; })
              .attr("x", 0)
              .attr("y", function (d, i) { return i * gridSize; })
              .style("text-anchor", "end")
              .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
              .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

        var monthLabels = svg.selectAll(".monthLabel")
            .data(months)
            .enter().append("text")
              .text(function(d) { return d; })
              .attr("x", function(d, i) { return i * gridSize; })
              .attr("y", 0)
              .style("text-anchor", "middle")
              .attr("transform", "translate(" + gridSize / 2 + ", -6)")
              .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "monthLabel mono axis axis-worktime" : "timeLabel mono axis"); });

          // function that grabs month and day

          // currently using this as sample data for the legend and cards to appear before
          // using the function to grab month and day
          var data = ﻿[
          	{
          		"day": 1,
          		"hour": 1,
          		"value": 16
          	},
          	{
          		"day": 1,
          		"hour": 2,
          		"value": 20
          	},
          	{
          		"day": 1,
          		"hour": 3,
          		"value": 0
          	},
          	{
          		"day": 1,
          		"hour": 4,
          		"value": 0
          	},
          	{
          		"day": 1,
          		"hour": 5,
          		"value": 0
          	},
          	{
          		"day": 1,
          		"hour": 6,
          		"value": 2
          	},
          	{
          		"day": 1,
          		"hour": 7,
          		"value": 0
          	},
          	{
          		"day": 1,
          		"hour": 8,
          		"value": 9
          	},
          	{
          		"day": 1,
          		"hour": 9,
          		"value": 25
          	},
          	{
          		"day": 1,
          		"hour": 10,
          		"value": 49
          	},
          	{
          		"day": 1,
          		"hour": 11,
          		"value": 57
          	},
          	{
          		"day": 1,
          		"hour": 12,
          		"value": 61
          	},
          	{
          		"day": 1,
          		"hour": 13,
          		"value": 37
          	},
          	{
          		"day": 1,
          		"hour": 14,
          		"value": 66
          	},
          	{
          		"day": 1,
          		"hour": 15,
          		"value": 70
          	},
          	{
          		"day": 1,
          		"hour": 16,
          		"value": 55
          	},
          	{
          		"day": 1,
          		"hour": 17,
          		"value": 51
          	},
          	{
          		"day": 1,
          		"hour": 18,
          		"value": 55
          	},
          	{
          		"day": 1,
          		"hour": 19,
          		"value": 17
          	},
          	{
          		"day": 1,
          		"hour": 20,
          		"value": 20
          	},
          	{
          		"day": 1,
          		"hour": 21,
          		"value": 9
          	},
          	{
          		"day": 1,
          		"hour": 22,
          		"value": 4
          	},
          	{
          		"day": 1,
          		"hour": 23,
          		"value": 0
          	},
          	{
          		"day": 1,
          		"hour": 24,
          		"value": 12
          	},
          	{
          		"day": 2,
          		"hour": 1,
          		"value": 6
          	},
          	{
          		"day": 2,
          		"hour": 2,
          		"value": 2
          	},
          	{
          		"day": 2,
          		"hour": 3,
          		"value": 0
          	},
          	{
          		"day": 2,
          		"hour": 4,
          		"value": 0
          	},
          	{
          		"day": 2,
          		"hour": 5,
          		"value": 0
          	},
          	{
          		"day": 2,
          		"hour": 6,
          		"value": 2
          	},
          	{
          		"day": 2,
          		"hour": 7,
          		"value": 4
          	},
          	{
          		"day": 2,
          		"hour": 8,
          		"value": 11
          	},
          	{
          		"day": 2,
          		"hour": 9,
          		"value": 28
          	},
          	{
          		"day": 2,
          		"hour": 10,
          		"value": 49
          	},
          	{
          		"day": 2,
          		"hour": 11,
          		"value": 51
          	},
          	{
          		"day": 2,
          		"hour": 12,
          		"value": 47
          	},
          	{
          		"day": 2,
          		"hour": 13,
          		"value": 38
          	},
          	{
          		"day": 2,
          		"hour": 14,
          		"value": 65
          	},
          	{
          		"day": 2,
          		"hour": 15,
          		"value": 60
          	},
          	{
          		"day": 2,
          		"hour": 16,
          		"value": 50
          	},
          	{
          		"day": 2,
          		"hour": 17,
          		"value": 65
          	},
          	{
          		"day": 2,
          		"hour": 18,
          		"value": 50
          	},
          	{
          		"day": 2,
          		"hour": 19,
          		"value": 22
          	},
          	{
          		"day": 2,
          		"hour": 20,
          		"value": 11
          	},
          	{
          		"day": 2,
          		"hour": 21,
          		"value": 12
          	},
          	{
          		"day": 2,
          		"hour": 22,
          		"value": 9
          	},
          	{
          		"day": 2,
          		"hour": 23,
          		"value": 0
          	},
          	{
          		"day": 2,
          		"hour": 24,
          		"value": 13
          	},
          	{
          		"day": 3,
          		"hour": 1,
          		"value": 5
          	},
          	{
          		"day": 3,
          		"hour": 2,
          		"value": 8
          	},
          	{
          		"day": 3,
          		"hour": 3,
          		"value": 8
          	},
          	{
          		"day": 3,
          		"hour": 4,
          		"value": 0
          	},
          	{
          		"day": 3,
          		"hour": 5,
          		"value": 0
          	},
          	{
          		"day": 3,
          		"hour": 6,
          		"value": 2
          	},
          	{
          		"day": 3,
          		"hour": 7,
          		"value": 5
          	},
          	{
          		"day": 3,
          		"hour": 8,
          		"value": 12
          	},
          	{
          		"day": 3,
          		"hour": 9,
          		"value": 34
          	},
          	{
          		"day": 3,
          		"hour": 10,
          		"value": 43
          	},
          	{
          		"day": 3,
          		"hour": 11,
          		"value": 54
          	},
          	{
          		"day": 3,
          		"hour": 12,
          		"value": 44
          	},
          	{
          		"day": 3,
          		"hour": 13,
          		"value": 40
          	},
          	{
          		"day": 3,
          		"hour": 14,
          		"value": 48
          	},
          	{
          		"day": 3,
          		"hour": 15,
          		"value": 54
          	},
          	{
          		"day": 3,
          		"hour": 16,
          		"value": 59
          	},
          	{
          		"day": 3,
          		"hour": 17,
          		"value": 60
          	},
          	{
          		"day": 3,
          		"hour": 18,
          		"value": 51
          	},
          	{
          		"day": 3,
          		"hour": 19,
          		"value": 21
          	},
          	{
          		"day": 3,
          		"hour": 20,
          		"value": 16
          	},
          	{
          		"day": 3,
          		"hour": 21,
          		"value": 9
          	},
          	{
          		"day": 3,
          		"hour": 22,
          		"value": 5
          	},
          	{
          		"day": 3,
          		"hour": 23,
          		"value": 4
          	},
          	{
          		"day": 3,
          		"hour": 24,
          		"value": 7
          	},
          	{
          		"day": 4,
          		"hour": 1,
          		"value": 0
          	},
          	{
          		"day": 4,
          		"hour": 2,
          		"value": 0
          	},
          	{
          		"day": 4,
          		"hour": 3,
          		"value": 0
          	},
          	{
          		"day": 4,
          		"hour": 4,
          		"value": 0
          	},
          	{
          		"day": 4,
          		"hour": 5,
          		"value": 0
          	},
          	{
          		"day": 4,
          		"hour": 6,
          		"value": 2
          	},
          	{
          		"day": 4,
          		"hour": 7,
          		"value": 4
          	},
          	{
          		"day": 4,
          		"hour": 8,
          		"value": 13
          	},
          	{
          		"day": 4,
          		"hour": 9,
          		"value": 26
          	},
          	{
          		"day": 4,
          		"hour": 10,
          		"value": 58
          	},
          	{
          		"day": 4,
          		"hour": 11,
          		"value": 61
          	},
          	{
          		"day": 4,
          		"hour": 12,
          		"value": 59
          	},
          	{
          		"day": 4,
          		"hour": 13,
          		"value": 53
          	},
          	{
          		"day": 4,
          		"hour": 14,
          		"value": 54
          	},
          	{
          		"day": 4,
          		"hour": 15,
          		"value": 64
          	},
          	{
          		"day": 4,
          		"hour": 16,
          		"value": 55
          	},
          	{
          		"day": 4,
          		"hour": 17,
          		"value": 52
          	},
          	{
          		"day": 4,
          		"hour": 18,
          		"value": 53
          	},
          	{
          		"day": 4,
          		"hour": 19,
          		"value": 18
          	},
          	{
          		"day": 4,
          		"hour": 20,
          		"value": 3
          	},
          	{
          		"day": 4,
          		"hour": 21,
          		"value": 9
          	},
          	{
          		"day": 4,
          		"hour": 22,
          		"value": 12
          	},
          	{
          		"day": 4,
          		"hour": 23,
          		"value": 2
          	},
          	{
          		"day": 4,
          		"hour": 24,
          		"value": 8
          	},
          	{
          		"day": 5,
          		"hour": 1,
          		"value": 2
          	},
          	{
          		"day": 5,
          		"hour": 2,
          		"value": 0
          	},
          	{
          		"day": 5,
          		"hour": 3,
          		"value": 8
          	},
          	{
          		"day": 5,
          		"hour": 4,
          		"value": 2
          	},
          	{
          		"day": 5,
          		"hour": 5,
          		"value": 0
          	},
          	{
          		"day": 5,
          		"hour": 6,
          		"value": 2
          	},
          	{
          		"day": 5,
          		"hour": 7,
          		"value": 4
          	},
          	{
          		"day": 5,
          		"hour": 8,
          		"value": 14
          	},
          	{
          		"day": 5,
          		"hour": 9,
          		"value": 31
          	},
          	{
          		"day": 5,
          		"hour": 10,
          		"value": 48
          	},
          	{
          		"day": 5,
          		"hour": 11,
          		"value": 46
          	},
          	{
          		"day": 5,
          		"hour": 12,
          		"value": 50
          	},
          	{
          		"day": 5,
          		"hour": 13,
          		"value": 66
          	},
          	{
          		"day": 5,
          		"hour": 14,
          		"value": 54
          	},
          	{
          		"day": 5,
          		"hour": 15,
          		"value": 56
          	},
          	{
          		"day": 5,
          		"hour": 16,
          		"value": 67
          	},
          	{
          		"day": 5,
          		"hour": 17,
          		"value": 54
          	},
          	{
          		"day": 5,
          		"hour": 18,
          		"value": 23
          	},
          	{
          		"day": 5,
          		"hour": 19,
          		"value": 14
          	},
          	{
          		"day": 5,
          		"hour": 20,
          		"value": 6
          	},
          	{
          		"day": 5,
          		"hour": 21,
          		"value": 8
          	},
          	{
          		"day": 5,
          		"hour": 22,
          		"value": 7
          	},
          	{
          		"day": 5,
          		"hour": 23,
          		"value": 0
          	},
          	{
          		"day": 5,
          		"hour": 24,
          		"value": 8
          	},
          	{
          		"day": 6,
          		"hour": 1,
          		"value": 2
          	},
          	{
          		"day": 6,
          		"hour": 2,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 3,
          		"value": 2
          	},
          	{
          		"day": 6,
          		"hour": 4,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 5,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 6,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 7,
          		"value": 4
          	},
          	{
          		"day": 6,
          		"hour": 8,
          		"value": 8
          	},
          	{
          		"day": 6,
          		"hour": 9,
          		"value": 8
          	},
          	{
          		"day": 6,
          		"hour": 10,
          		"value": 6
          	},
          	{
          		"day": 6,
          		"hour": 11,
          		"value": 14
          	},
          	{
          		"day": 6,
          		"hour": 12,
          		"value": 12
          	},
          	{
          		"day": 6,
          		"hour": 13,
          		"value": 9
          	},
          	{
          		"day": 6,
          		"hour": 14,
          		"value": 14
          	},
          	{
          		"day": 6,
          		"hour": 15,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 16,
          		"value": 4
          	},
          	{
          		"day": 6,
          		"hour": 17,
          		"value": 7
          	},
          	{
          		"day": 6,
          		"hour": 18,
          		"value": 6
          	},
          	{
          		"day": 6,
          		"hour": 19,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 20,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 21,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 22,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 23,
          		"value": 0
          	},
          	{
          		"day": 6,
          		"hour": 24,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 1,
          		"value": 7
          	},
          	{
          		"day": 7,
          		"hour": 2,
          		"value": 6
          	},
          	{
          		"day": 7,
          		"hour": 3,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 4,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 5,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 6,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 7,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 8,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 9,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 10,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 11,
          		"value": 2
          	},
          	{
          		"day": 7,
          		"hour": 12,
          		"value": 2
          	},
          	{
          		"day": 7,
          		"hour": 13,
          		"value": 5
          	},
          	{
          		"day": 7,
          		"hour": 14,
          		"value": 6
          	},
          	{
          		"day": 7,
          		"hour": 15,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 16,
          		"value": 4
          	},
          	{
          		"day": 7,
          		"hour": 17,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 18,
          		"value": 2
          	},
          	{
          		"day": 7,
          		"hour": 19,
          		"value": 10
          	},
          	{
          		"day": 7,
          		"hour": 20,
          		"value": 7
          	},
          	{
          		"day": 7,
          		"hour": 21,
          		"value": 0
          	},
          	{
          		"day": 7,
          		"hour": 22,
          		"value": 19
          	},
          	{
          		"day": 7,
          		"hour": 23,
          		"value": 9
          	},
          	{
          		"day": 7,
          		"hour": 24,
          		"value": 4
          	}
          ];


            // currently, we are using the above sample data set to test the features in the heat chart
            // with the forEach() function
            data.forEach(function(element){
          var colorScale = d3.scaleQuantile()
              .domain([0,buckets - 1, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          //this is where we build the datetime function after using the parsing function
          var cards = svg.selectAll(".month")
              .data(data, function(d) {

                return d.day+ ':' + d.hour;});

          cards.append("title");

          cards.enter().append("rect")
                .attr("x", function(d) { return(d.hour - 1) * gridSize; })
                .attr("y", function(d) { return(d.day - 1) * gridSize ; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "month bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

          cards.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function (d){ return d.value; });

          cards.exit().remove();

          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), data.value);

          legend.enter().append("g")
                .attr("class", "legend");

          legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);

          legend.exit().remove();
        });
  }
}
}
</script>
