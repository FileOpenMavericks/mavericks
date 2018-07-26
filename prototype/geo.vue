<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <v-text-field prepend-icon="search" v-model="searchTerm" hide-details single-line></v-text-field>
            </v-toolbar>
            <v-card-text>
                <div id="container" class="svg-container"></div>
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
body { 
                color: #666; 
                background: white; 
                font: normal 10px "Helvetica Neue", Helvetica, sans-serif; 
                margin:auto;
                position: relative;
                text-align: center;	
            }

.toolbar__content {
    background: white;
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

            .tooltips {
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

            .tooltips1 {
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

            country {
              fill: #41ae76;
              stroke: #fff;
              stroke-width: .5px;
              stroke-linejoin: round;
              cursor: pointer;
            }

            country:hover{
                fill:lightgreen;
            }

            .hidden { 
              display: none; 
            }


            path {
              fill: none;
              stroke: #333;
              stroke-width: .5px;
            }

            .land-boundary {
              stroke-width: 1px;
            }

            .county-boundary {
              stroke: #ddd;
            }

            .site {
                fill: red;
                stroke-width: 0.7px;
                stroke: black;
                opacity: 0.9;
            }


            .site:hover {
              fill: black ;
            }

            .dot{
                stroke:black;
                stroke-width:0.7px;
            }


            .tectonic {
              fill: none;
              stroke: red;
              opacity: 0.9;
            }


            .sphere {
                fill: #bbb;
            }


            .overlay {
                fill: none;
                pointer-events: all;
            }


            .water {
              fill: #ccece6;
            }


            .land {
              fill: #41ae76;
              stroke: green;
              stroke-width: 0.7px;
            }


            .focused {
              fill: lightgreen;
            }


            .countryTooltip {
              position: absolute;
              display: none;
              pointer-events: none;
              background: #fff;
              padding: 5px;
              text-align: left;
              border: solid #ccc 1px;
              color: #666;
              font-size: 14px;
              font-family: sans-serif;
            }
</style>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson';

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
            var margin = this.getMargin();
            var height = window.innerHeight - margin.top - margin.bottom;
            var width = window.innerWidth - margin.left - margin.right;
            height = 420;
            width = 800;
            
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
            var g = this.makeG(svg, width, height);
            console.log("G unit:");
            console.log(g);

            //Get tool tip
            var tooltip = this.makeToolTip();

            //Queue
            var files = ["https://raw.githubusercontent.com/sharad97/CMPS-165/master/Project/world_110m.json"];

            //Main function
            var promises = [];

            files.forEach(function(url) {
                promises.push(d3.json(url))
            });

            Promise.all(promises).then(function(worldData) {
                console.log(topojson);
                var world_110m = topojson.feature(worldData[0],
                                            worldData[0].objects.countries).features;
                //Turning json information about country polygons into vector path
                
                g.append("g")
                .attr("class", "country")
                .selectAll("country")
                .data(world_110m)
                .enter()
                .append("path")
                .attr("d", path);

                var data = sessionData;
                var graphLayout = d3.forceSimulation(data)
                        .force("collide",d3.forceCollide(2))
                        .force("charge", d3.forceManyBody().strength(function (d, i) {
                            var a = i == 0 ? -2000 : -1000;
                            return a;
                            }).distanceMin(2000).distanceMax(1000))
                        .force("x", d3.forceX().strength(6))
                        .force("y", d3.forceY().strength(6));

                    //For each session we get the data
                    data.forEach(function(d) {
                        d.id = d.session.id;
                        d.viewer = d.session.viewer;
                        d.open_date= d.session.opened.date;
                        d.length=d.session.length;

                        // d.lat = (d.location.lat ?  parseFloat(d.location.lat): 0);
                        // d.lon= (d.location.lon ? parseFloat(d.location.lon) : 0);
                        d.lat = 0;
                        if(d.location.lat){
                            d.lat = parseFloat(d.location.lat);
                            console.log(d.location);
                        }
                        d.lon = 0;
                        if(d.location.lon){
                            d.lon = parseFloat(d.location.lon);
                            
                        }
                        
                        d.ip = d.device.ip;
                        d.created_date=d.device.created.date;
                        d.activated_date=d.device.activated.date;
                        d.user_agent=d.device.userAgent;

                        d.email = d.user.email;
                        d.first = d.user.first; 
                        d.last = d.user.last; 
                        d.device = d.user.devices; 

                        d.file_name = d.file.name;
                        d.raw_size =  d.file.rawSize;
                        d.upload_date = d.file.uploaded.date;
                        d.available = d.file.available;

                        d.link_name = d.link.name;
                        d.watermark= d.link.watermarked;
                        d.print=d.link.printable;
                        d.expire_date = d.link.expiration.date;
                        d.link_c_date = d.link.created.date;
                        });
                    console.log(data);

                    var node = g.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("g")
                        .append("circle")
                        .attr("class", "node")
                        .attr("cx", function(d) {
                            return (projection([d.lon, d.lat])[0]);
                        })
                        .attr("cy", function(d) {
                                return (projection([d.lon, d.lat])[1]);
                        })
                        .attr("width",20)
                        .attr("height",20)
                        .attr('r', 4)
                        .style("fill", function (d) { return colors(d.email); })
                        .style('opacity', 0.6)
                        .on("mouseover", function (d) {
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", 0.9);
                            tooltip.html( "<table>"
                                         +"<tr><td align='left'>Session Id</td><td align='center'>:<td align='right'>" + d.id + "</td></tr>"
                                         +"<tr><td align='left'>Session Viewer</td><td align='center'>:<td align='right'>" + d.viewer + "</td></tr>"
                                         +"<tr><td align='left'>Session Opened</td><td align='center'>:<td align='right'>" +   d.open_date + "</td></tr>"
                                         +"<tr><td align='left'>Session Length</td><td align='center'>:<td align='right'>" +   d.length + "</td></tr>"
                                         +"<tr><td align='left'>Device Ip</td><td align='center'>:<td align='right'>" +   d.ip + "</td></tr>"
                                         +"<tr><td align='left'>Device Created</td><td align='center'>:<td align='right'>" +  d.created_date + "</td></tr>"
                                         +"<tr><td align='left'>Device Actiovated</td><td align='center'>:<td align='right'>" +  d.activated_date + "</td></tr>"
                                         +"<tr><td align='left'>Device UserAgent</td><td align='center'>:<td align='right'>" +  d.user_agent + "</td></tr>"
                                         +"<tr><td align='left'>User</td><td align='center'>:<td align='right'>" +  d.email + "</td></tr>"
                                         +"<tr><td align='left'>First Name</td><td align='center'>:<td align='right'>" +  d.first + "</td></tr>"
                                         +"<tr><td align='left'>Last Name</td><td align='center'>:<td align='right'>" +  d.last + "</td></tr>" 
                                         +"<tr><td align='left'>User Devices</td><td align='center'>:<td align='right'>" +  d.device + "</td></tr>"
                                         +"<tr><td align='left'>File Namer</td><td align='center'>:<td align='right'>" +  d.file_name + "</td></tr>"
                                         +"<tr><td align='left'>File Rawsize</td><td align='center'>:<td align='right'>" +  d.raw_size + "</td></tr>"
                                         +"<tr><td align='left'>File Upload Date</td><td align='center'>:<td align='right'>" +  d.upload_date + "</td></tr>"
                                         +"<tr><td align='left'>File Available</td><td align='center'>:<td align='right'>" +  d.available + "</td></tr>"
                                         +"<tr><td align='left'>Link Name</td><td align='center'>:<td align='right'>" +  d.link_name + "</td></tr>"
                                         +"<tr><td align='left'>Link Watermarked</td><td align='center'>:<td align='right'>" +  d.watermark + "</td></tr>"
                                         +"<tr><td align='left'>Link Printable</td><td align='center'>:<td align='right'>" +  d.print + "</td></tr>"
                                         +"<tr><td align='left'>Link Expiration</td><td align='center'>:<td align='right'>" + d.expire_date + "</td></tr>"
                                         +"<tr><td align='left'>Link Created</td><td align='center'>:<td align='right'>" + d.link_c_date + "</td></tr>"
                                         + "</table>")
                                .style("left", (d3.event.pageX - 335) + "px")
                                .style("top", (d3.event.pageY - 128) + "px");
                        })
                        .on("mouseout", function (d) {
                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                        
                                            node.call(
                        d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

                    graphLayout.on("tick", function() {
                        node.attr("transform", 
                                  function(d) { return "translate(" + d.x + "," + d.y + ")"; }
                                 );
                    }); 

                    function dragstarted(d) {
                        d3.event.sourceEvent.stopPropagation();
                        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    }

                    function dragged(d) {
                        d.fx = d3.event.x;
                        d.fy = d3.event.y;
                    }

                    function dragended(d) {
                        if (!d3.event.active) graphLayout.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    }

            });
                        // zoom and pan
            var zoom = d3.zoom()
                .on("zoom",function() {
                    g.attr("transform", d3.event.transform);
                });
            svg.call(zoom)
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
            var svg = d3.select("div#container")
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
            var tooltip = d3.select("div#container").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
            return tooltip;
        }

    }
}
</script>
