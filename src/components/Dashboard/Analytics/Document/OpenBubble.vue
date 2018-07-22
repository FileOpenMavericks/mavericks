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
            var width = 860;
            var height = 500;
            var maxRadius = 6;

            var n = 200;
            var m = 10;

            var color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(d3.range(m));

            var clusters = new Array(m);

            var nodes = d3.range(n).map(function() {
                var i = Math.floor(Math.random() * m);
                var r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius;
                var d = {cluster: i, radius: r};
                if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                return d;
            });
        
            console.log(nodes);
            
            var forceCollide = d3.forceCollide()
            .radius(function(d) { return d.radius + 1.5; })
            .iterations(1);

            var force = d3.forceSimulation()
                .nodes(nodes)
                .force("center", d3.forceCenter())
                .force("collide", forceCollide)
                .force("cluster", forceCluster)
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

            var circle = g.selectAll("circle")
                .data(nodes)
                .enter()
                .append("g")
                .append("circle")
                .attr("r", function(d) { return d.radius; })
                .style("fill", function(d) { return color(d.cluster); })
                .on("mouseover", function (d) {
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", 0.9);
                            tooltip.html( "<table>"
                                         +"<tr><td align='left'>Cluster</td><td align='center'>:<td align='right'>" + d.cluster + "</td></tr>"
                                         +"<tr><td align='left'>Radius</td><td align='center'>:<td align='right'>" + d.radius + "</td></tr>"
                                         + "</table>")
                                .style("left", (d3.event.pageX + 5) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
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
            
            function forceCluster(alpha) {
                    for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
                        node = nodes[i];
                        cluster = clusters[node.cluster];
                        node.vx -= (node.x - cluster.x) * k;
                        node.vy -= (node.y - cluster.y) * k;
                    }
                }
        }
    }
}
</script>
