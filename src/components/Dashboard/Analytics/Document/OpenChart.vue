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
            docData: null,
            line: ''
        }
    },
    mounted: function(){
      this.getData();
    },
    created: function() {},
    methods: {
      getData() {
          let $this = this;
        //  let linkId = '426732708eee4929bd0ecbe9a4fc0b18'
        //  let docRefId = '52f2468e05f743ca9911abe07c196363'
        let docRefId = $this.$route.params.id;
          $this.$http.get('https://pubtest.fileopen.com/api/analytics/file/' + docRefId).then(response => {
              $this.docData = response.body;
              // NOTE: Data is an array of entries, this prints the first entry
              console.log($this.docData);
              var output = foPp.countData(this.docData, "user.email");
              console.log(output);

              // NOTE: This is where I would call it calculate the data and create the graphic
              //       However, it currently uses static test data so it isn't necessary

              var dateFormat = d3.timeFormat("%x");
              var dateParse = d3.timeParse(dateFormat);

              var countedMonthDay = d3.nest()
                                       .key(function(d){
                                          d.session.opened.date = new Date(d.session.opened.date);
                                          d.session.opened.date  = dateFormat(d.session.opened.date);
                                            return d.session.opened.date; })
                                        .rollup(function(v){
                                            return {
                                              count: v.length
                                            }})
                                         .entries($this.docData);
                      countedMonthDay.forEach(function(d){
                        let dateObj = dateParse(d.key);
                        d.month = dateObj.getMonth();
                        d.day = dateObj.getDay();
                      });
                      console.log("counted month, day");
                      console.log(countedMonthDay);
              // $this.renderData($this.linkData);
              $this.renderData(countedMonthDay);

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

            // currently, we are using the above sample data set to test the features in the heat chart
            // with the forEach() function
           sessionData.forEach(function(element){
          var colorScale = d3.scaleQuantile()
              .domain([0,buckets, d3.max(sessionData, function (d) { return d.value.counts; })])
              //.domain([0,buckets,9])
              .range(colors);

          //this is where we build the datetime function after using the parsing function
          var cards = svg.selectAll(".month")
              .data(sessionData, function(d) {
                 return d.day + ':' + d.month;});

          cards.append("title");

          cards.enter().append("rect")
                .attr("x", function(d) { return(d.month) * gridSize; })
                .attr("y", function(d) { return(d.day) * gridSize ; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "month bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

          cards.transition().duration(1000)
                .style("fill", function(d) {
                  return colorScale(d.value.count); });

          cards.select("title").text(function (d){
            return d.value.count; });

          cards.exit().remove();

          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) {return d;});

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
