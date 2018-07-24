<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
            </v-toolbar>
            <v-card-text>
                <div id="map-container" class="svg-container"></div>
            </v-card-text>
        </v-card>
    </v-layout>
</v-container>
</template>

<style>
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

body { 
    color: #666; 
    background: white; 
    font: normal 10px "Helvetica Neue", Helvetica, sans-serif; 
    margin:auto;
    position: relative;
    text-align: center;	
}

.svg-container {
    border:2px solid #000;
    margin:1 auto; 
    display: inline-block;
    position: relative;
    width: 100%;
    vertical-align: top;
    overflow: hidden;
}

.svg-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
}

.tooltip {
    width: 500px;
    height: auto;
    font: 14px sans-serif;
    font-weight: bold;
    border-radius: 5px;
    padding: 3px 3px 3px 3px;
    position:absolute;			
    background: SeaGreen;	
    border: solid black 2px;
    border-radius: 8px;			
    pointer-events: none;
    margin-left: 15px;
    color:white;
}

</style>

<script>
import * as d3 from 'd3';
import * as foPp from '../../../../FoNodeModules/FoPreprocessor'

export default {
    name: 'open-bubble',
    data(){
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
            var width = 860;
            var height = 500;
            var maxRadius = 6;

            var n = 200;
            var m = 10;

            var color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(d3.range(m));

            var clusters = new Array(m);

            var data = d3.entries(data);
        
            console.log(data);
            
            var forceCollide = d3.forceCollide()
            .radius(function(d) { return d.radius + 1.5; })
            .iterations(1);

            var force = d3.forceSimulation()
                .nodes(data)
                .force("center", d3.forceCenter())
                .force("collide", forceCollide)
                //.force("cluster", forceCluster)
                .force("gravity", d3.forceManyBody(20))
                .force("x", d3.forceX().strength(0.7))
                .force("y", d3.forceY().strength(0.7))
                .on("tick", tick);

            var svg = d3.select("div#map-container")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 300 300")
                .classed("svg-content", true)
                .classed("svg-container", true);

            var g = svg.append("g")
                .attr("width", width)
                .attr("height", height);
                
            g.append("rect")
                .attr("x", width - 750)
                .attr("y", height - 425)
                .attr("width", 120)
                .attr("height", 150)
                .attr("fill", "lightgrey")
                .style("stroke-size", "1px");

            g.append("circle")
                .attr("r", 3)
                .attr("cx", width - 660)
                .attr("cy", height - 300)
                .style("fill", "blue");

            g.append("circle")
                .attr("r", 5)
                .attr("cx", width - 660)
                .attr("cy", height - 330)
                .style("fill", "blue");

            g.append("circle")
                .attr("r", 7)
                .attr("cx", width - 660)
                .attr("cy", height - 360)
                .style("fill", "blue");

            g.append("circle")
                .attr("r", 9)
                .attr("cx", width - 660)
                .attr("cy", height - 390)
                .style("fill", "blue");

            g.append("text")
                .attr("class", "label")
                .attr("x", width - 700)
                .attr("y", height - 300)
                .style("text-anchor", "end")
                .text("Three");

            g.append("text")
                .attr("class", "label")
                .attr("x", width - 708)
                .attr("y", height - 330)
                .style("text-anchor", "end")
                .text("Five");

            g.append("text")
                .attr("class", "label")
                .attr("x", width - 700)
                .attr("y", height - 360)
                .style("text-anchor", "end")
                .text("Seven");

            g.append("text")
                .attr("class", "label")
                .attr("x", width - 708)
                .attr("y", height - 390)
                .style("text-anchor", "end")
                .text("Nine");
                
            var zoom = d3.zoom()
                .on("zoom",function() {
                    g.attr("transform", d3.event.transform);
                    g.selectAll(".node")
                    });
                    
            svg.call(zoom);
            
            var tooltip = d3.select("div#map-container")
                            .append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);

            var circle = g.selectAll("circles")
                .data(data)
                .enter()
                .append("g")
                .append("circle")
                .attr("r", function(d) { return d.value; })
                .style("fill", function(d) { return color(d.value); })
                .on("mouseover", function (d) {
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", 0.9);
                            tooltip.html( "<table>"
                                         +"<tr><td align='left'>User</td><td align='center'>:<td align='right'>" + d.key + "</td></tr>"
                                         +"<tr><td align='left'>Numbver of file open</td><td align='center'>:<td align='right'>" + d.value + "</td></tr>"
                                         + "</table>")
                                .style("left", (d3.event.pageX - 335) + "px")
                                .style("top", (d3.event.pageY - 128) + "px");
                        })
                        .on("mouseout", function (d) {
                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                
            function tick() {
              circle
                  .attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });
            }

            circle.call(
                d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

            function dragstarted(d) {
                d3.event.sourceEvent.stopPropagation();
                if (!d3.event.active) force.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y; 
            }

            function dragended(d) {
                if (!d3.event.active) force.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

        }
    }
}

</script>
