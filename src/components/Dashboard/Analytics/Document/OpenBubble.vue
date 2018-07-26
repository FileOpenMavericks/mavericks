<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <div>
                <button v-on:click="add_sim">Group By Email Domain</button>
                <button v-on:click="remove_sim">Reset</button>
                </div>
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
    width: auto;
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

button {
    color:#08233e;
    display:inline-block;
    font:2.4em Futura, ‘Century Gothic’, AppleGothic, sans-serif;
    font-size:11px;
    padding: 10px 20px;
    background-color:rgba(255,204,0,1);
    border:1px solid #ffcc00;
    -moz-border-radius:10px;
    -webkit-border-radius:10px;
    -moz-box-shadow:inset 0 1px 0 rgba(255,255,255,0.5);
    -webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,0.5);
    border-radius:10px;
    border-bottom:1px solid #9f9f9f;
    box-shadow:inset 0 1px 0 rgba(255,255,255,0.5);
    cursor:pointer;
}
button:hover {
    background-color:rgba(255,204,0,0.8);
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
            line: '',
            nodes: {},
            simulation: {},
            clusters: {}
            
        }
    },
    mounted: function () {
        this.getData()
  },
  created: function () {},
  methods: {
    getData () {
      let $this = this
      let docRefId = '9c80af62b1094bdfab633019b2d10c1e'
      $this.$http.get('https://pubtest.fileopen.com/api/analytics/file/' + docRefId).then(response => {
        $this.linkData = response.body
        // NOTE: Data is an array of entries, this prints the first entry
        console.log($this.linkData)
        var output = foPp.countData(this.linkData, 'user.email')
        console.log(output);
        $this.renderOpenCountData(output);
        // NOTE: This is where I would call it calculate the data and create the graphic
        // However, it currently uses static test data so it isn't necessary
      }, response => {
        console.error(response)
      })
    },
    renderOpenCountData(data){
        let $this = this;
        var margin = {top: 100, right: 100, bottom: 100, left: 100};

        var width = 960,
            height = 500,
            padding = 1.5, // separation between same-color circles
            clusterPadding = 6, // separation between different-color circles
            maxRadius = height*0.1;

        var n = 200, // total number of nodes
            m = 10, // number of distinct clusters
            z = d3.scaleOrdinal(d3.schemeCategory10);

        $this.clusters = new Array(m);

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
    
        var zoom = d3.zoom()
            .on("zoom",function() {
                g.attr("transform", d3.event.transform);
                g.selectAll(".node")
            });
        svg.call(zoom);

        // Define the div for the tooltip
        var div = d3.select("body").append("div") 
            .attr("class", "tooltip")       
            .style("opacity", 0);

        //load college major data
        var d = d3.entries(data);

            /*
            [{"key": "chillers@fileopen.com", "value": "8"},
            {"key": "mike@fileopen.com", "value": "1"},
            {"key": "tom@fileopen.com", "value": "2"},
            {"key": "kim@fileopen.com", "value": "3"},
            {"key": "chil@fileopen.com", "value": "6"},
            {"key": "chiller@fileopen.com", "value": "1"},
            {"key": "chang@fileopen.com", "value": "2"},
            {"key": "ching@fileopen.com", "value": "4"},
            {"key": "kong@fileopen.com", "value": "5"},
            {"key": "king@fileopen.com", "value": "1"},
            {"key": "sharad@fileopen.com", "value": "2"},
            {"key": "tina@fileopen.com", "value": "3"},
            {"key": "jerry@fileopen.com", "value": "6"},
            {"key": "john@fileopen.com", "value": "5"},
            {"key": "jim@fileopen.com", "value": "4"},
            {"key": "hit@fileopen.com", "value": "4"},
            {"key": "hot@fileopen.com", "value": "1"},
            {"key": "cllers@fileopen.com", "value": "9"},
            {"key": "cilers@fileopen.com", "value": "1"},
            {"key": "chilers@fileopen.com", "value": "2"},
            {"key": "chilles@fileopen.com", "value": "3"},
            {"key": "chersy@fileopen.com", "value": "4"},
            {"key": "chillers@fileopen.com", "value": "7"},
            {"key": "cheery@fileopen.com", "value": "5"},
            {"key": "game@fileopen.com", "value": "6"},
            {"key": "show@fileopen.com", "value": "1"},
            {"key": "grand@fileopen.com", "value": "2"},
            {"key": "fox@fileopen.com", "value": "3"},
            {"key": "rock@fileopen.com", "value": "2"},
            {"key": "hitman@fileopen.com", "value": "1"}
            ];
            */

        console.log(d);

        $this.nodes = d.map((d) => {
            // scale radius to fit on the screen
            var email = d.key,
            scaledRadius = +d.value;
            //gets domain
            var forcedCluster = email.replace(/.*@/, "");
            
            // add cluster id and radius to array
            d = {
                    cluster : forcedCluster,
                    m       : email,
                    r       : scaledRadius
            };
            // add to clusters array if it doesn't exist or the radius is larger than another radius in the cluster
            if (!$this.clusters[forcedCluster] || (scaledRadius > $this.clusters[forcedCluster].r)) $this.clusters[forcedCluster] = d;
            // if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;

            return d;
        });
    
        console.log($this.nodes);
    
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
            
            
        let min = d[0].value, max = d[0].value;
            for (let i = 1, len=d.length; i < len; i++) {
                let v = d[i].value;
                min = (v < min) ? v : min;
                max = (v > max) ? v : max;
            }
        
            console.log(min);
            console.log(max);
        
        g.append("rect")
            .attr("x", width - 750)
            .attr("y", height - 415)
            .attr("width", 120)
            .attr("height", 170)
            .attr("fill", "lightgrey")
            .style("stroke-size", "1px");
            
        g.append("circle")
            .attr("r", 3)
            .attr("cx", width - 660)
            .attr("cy", height - 275)
            .style("fill", "red")
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                    tooltip.html( "<table>"
                                    +"<tr><td align='left'>1. Size of circle is based on number of file opened by user</td></tr>"
                                    +"<tr><td align='left'>2. Different color of circle shows different user</td></tr>"
                                    +"<tr><td align='left'>3. Groups by domain of email</td></tr>"
                                    + "</table>")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
            

        g.append("circle")
            .attr("r", function(d) { return Math.round(max/6); })
            .attr("cx", width - 660)
            .attr("cy", height - 300)
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .style("fill", "blue")
            .style('opacity', 0.5);

        g.append("circle")
            .attr("r", function(d) { return Math.round(max/4); })
            .attr("cx", width - 660)
            .attr("cy", height - 330)
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .style("fill", "blue")
            .style('opacity', 0.5);

        g.append("circle")
            .attr("r", function(d) { return Math.round(max/2); })
            .attr("cx", width - 660)
            .attr("cy", height - 360)
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .style("fill", "blue")
            .style('opacity', 0.5);
        
        g.append("circle")
            .attr("r", function(d) { return Math.round(max); })
            .attr("cx", width - 660)
            .attr("cy", height - 390)
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .style("fill", "blue")
            .style('opacity', 0.5);
            
        g.append("text")
            .attr("class", "label")
            .attr("x", width - 700)
            .attr("y", height - 270)
            .style("text-anchor", "end")
            .style("text-decoration", "underline")
            .text("Hint:");

        g.append("text")
            .attr("class", "label")
            .attr("x", width - 700)
            .attr("y", height - 295)
            .style("text-anchor", "end")
            .text(Math.round(max/6));

        g.append("text")
            .attr("class", "label")
            .attr("x", width - 700)
            .attr("y", height - 325)
            .style("text-anchor", "end")
            .text(Math.round(max/4));

        g.append("text")
            .attr("class", "label")
            .attr("x", width - 700)
            .attr("y", height - 355)
            .style("text-anchor", "end")
            .text(Math.round(max/2));
        
        g.append("text")
            .attr("class", "label")
            .attr("x", width - 700)
            .attr("y", height - 390)
            .style("text-anchor", "end")
            .text(Math.round(max));

        // append the circles to svg then style
        // add functions for interaction
        var circles = g.append('g')
            .datum($this.nodes)
            .selectAll('.circle')
            .data(d => d)
            .enter()
            .append('circle')
            .attr('r', (d) => d.r)
            .attr('fill', (d) => z(d.cluster))
            .attr('stroke-width', 1)
            .on("mouseover", (d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                    tooltip.html( "<table>"
                                    +"<tr><td align='left'>Group</td><td align='center'>:<td align='right'>" + d.cluster + "</td></tr>"
                                    +"<tr><td align='left'>File Opened</td><td align='center'>:<td align='right'>" + d.r + "</td></tr>"
                                    +"<tr><td align='left'>User Email</td><td align='center'>:<td align='right'>" + d.m + "</td></tr>"
                                    + "</table>")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", (d) => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
  
  
        circles.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
        var forceCollide = d3.forceCollide()
            .radius(function(d) { return d.radius + 1.5; })
            .iterations(1);

        // create the clustering/collision force simulation
        $this.simulation = d3.forceSimulation()
            .nodes($this.nodes)
            .force("center", d3.forceCenter())
            .force("collide", forceCollide)
            //.force("cluster", forceCluster)
            .force("gravity", d3.forceManyBody(0))
            .force("x", d3.forceX().strength(0.2))
            .force("y", d3.forceY().strength(0.2))
            .on("tick", tick);
            
        function tick() {
            circles
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);
        }

        // Drag functions used for interactivity
        function dragstarted(d) {
            if (!d3.event.active) $this.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) $this.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            }
        },
        //on click even to add cluster simulation
        add_sim: function (event) {
            let $this = this;
            if (event) {
                var simulation = $this.simulation;
                simulation.nodes($this.nodes);
                simulation.force("cluster", forceCluster);
                simulation.alpha(1).restart();
                
                function forceCluster(alpha) {
                    for (var i = 0, n = $this.nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
                        node = $this.nodes[i];
                        cluster = $this.clusters[node.cluster];
                        node.vx -= (node.x - cluster.x) * k;
                        node.vy -= (node.y - cluster.y) * k;
                    }
                }
            }  
        
        },
        
        remove_sim: function (event) {
            let $this = this;
            console.log(event)
            if (event) {
                console.log(event)
                var simulation = $this.simulation;
                simulation.nodes($this.nodes);
                simulation.force("cluster", forceCluster);
                simulation.alpha(1).restart();
            
                function forceCluster(alpha) {
                    for (var i = 0, n = $this.nodes.length, node, cluster, k = alpha * 0; i < n; ++i) {
                        node = $this.nodes[i];
                        cluster = $this.clusters[node.cluster];
                        node.vx -= (node.x - cluster.x) * k;
                        node.vy -= (node.y - cluster.y) * k;
                    }
                }
            }  
        }
    }
}
</script>
