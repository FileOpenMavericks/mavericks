<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <v-text-field prepend-icon="search" v-model="searchTerm" hide-details single-line></v-text-field>
            </v-toolbar>
            <v-card-text>
                <div id="map"></div>
            </v-card-text>
        </v-card>
    </v-layout>
</v-container>
</template>

<style>
html, body{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#map {
    width: 500px;
    height: 500px;
}
.stations, .stations svg {
  position: absolute;
}

.stations svg {
  width: 60px;
  height: 20px;
  padding-right: 100px;
  font: 10px sans-serif;
}

.stations circle {
  fill: brown;
  stroke: black;
  stroke-width: 1.5px;
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
</style>

<script>
import * as d3 from 'd3'
import * as foPp from '../../../../FoNodeModules/FoPreprocessor'

export default {
  name: 'open-google',
  data () {
    return {
      searchTerm: '',
      searchVal: '',
      data: [50, 90, 20, 100, 40, 50],
      docData: null,
      line: '',
      map: null,
      overlay: null
    }
  },
  mounted: function () {
    let $this = this

    console.log($this.map)
    this.getData()
  },
  watch: {
    searchTerm: function (v) {
      console.log(v)
      this.searchVal = v
      this.overlay.draw()
    }
  },
  created: function () {},
  methods: {
    getData () {
      let $this = this
      //let docRefId = '52f2468e05f743ca9911abe07c196363'
      let docRefId = $this.$route.params.id;
      $this.$http.get('https://pubtest.fileopen.com/api/analytics/file/' + docRefId).then(response => {
        $this.docData = response.body
        // NOTE: Data is an array of entries, this prints the first entry
        console.log('Doc data')
        console.log($this.docData)
        var output = foPp.countData(this.docData, 'user.email')
        console.log(output)

        

        // $this.docData.forEach(function(d){
        //   d.session.opened.date = new Date(d.session.opened.date);
        //   d.session.opened.date  = dateFormat(d.session.opened.date);
        // });

        // //Test function
        // var dateFormat = d3.timeFormat("%x");
        // var dateParse = d3.timeParse(dateFormat);

        // var countedMonthDay = d3.nest()
        //                       .key(function(d){ 
        //                         d.session.opened.date = new Date(d.session.opened.date);
        //                         d.session.opened.date  = dateFormat(d.session.opened.date);
        //                         return d.session.opened.date; })
        //                       .rollup(function(v){
        //                         return {
        //                         count: v.length
        //                       }})
        //                       .entries($this.docData);
        // countedMonthDay.forEach(function(d){
        //   let dateObj = dateParse(d.key);
        //   d.month = dateObj.getMonth();
        //   d.day = dateObj.getDay();
        // });
        
        // console.log("counted month, day");
        // console.log(countedMonthDay);

        console.log($this.docData);

        $this.renderData($this.docData, null)

        // NOTE: This is where I would call it calculate the data and create the graphic
        //       However, it currently uses static test data so it isn't necessary
      }, response => {
        console.error(response)
      })
    },
    renderData (data, filter) {
      let $this = this

      // Initializing map
      $this.map = new google.maps.Map(d3.select('#map').node(),
        {
          zoom: 8,
          center: new google.maps.LatLng(37.76487, -122.41948),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        })
      $this.overlay = new google.maps.OverlayView()
      var tooltip = $this.makeToolTip()
      // Add the container when the overlay is added to the map.
      $this.overlay.onAdd = function () {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append('div')
          .attr('class', 'stations')

        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        $this.overlay.draw = function () {
          data = $this.filterData($this.docData)
          var projection = this.getProjection(),
            padding = 10
          // Reset
          layer.selectAll('svg').remove()

          var marker = layer.selectAll('svg')
            .data(data)
            .each(transform) // update existing markers
            .enter().append('svg')
            .each(transform)
            .attr('class', 'marker')
            .on('mouseover', function (d) {
              tooltip.transition()
                .duration(200)
                .style('opacity', 0.9)
              tooltip.html('<table>' +
                                         "<tr><td align='left'>User</td><td align='center'>:<td align='right'>" + d.user.email + '</td></tr>' +
                                         '</table>')
                .style('left', (d3.event.pageX + 5) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px')
            })
            .on('mouseout', function (d) {
              tooltip.transition()
                .duration(500)
                .style('opacity', 0)
            })

          // Add a circle.
          marker.append('circle')
            .attr('r', 4.5)
            .attr('cx', padding)
            .attr('cy', padding)

          // Add a label.
          marker.append('text')
            .attr('x', padding + 7)
            .attr('y', padding)
            .attr('dy', '.31em')
            .text(function (d) { return d.key })

          function transform (d) {
            d.lat = 0
            if (d.location.lat) {
              d.lat = parseFloat(d.location.lat)
            }
            d.lon = 0
            if (d.location.lon) {
              d.lon = parseFloat(d.location.lon)
            }
            d = new google.maps.LatLng(d.lat, d.lon)
            d = projection.fromLatLngToDivPixel(d)
            return d3.select(this)
              .style('left', (d.x - padding) + 'px')
              .style('top', (d.y - padding) + 'px')
          }
        }
      }

      // Bind our overlay to the map…
      $this.overlay.setMap($this.map)
    },
    makeToolTip () {
      var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
      return tooltip
    },
    filterData (data) {
      let $this = this
      var filteredData = new Array()
      data.forEach(function (d) {
        if ($this.sessionInFilter(d)) {
          filteredData.push(d)
        }
      })
      return filteredData
    },
    sessionInFilter (session) {
      let $this = this
      let searchTerm = $this.searchVal.toLowerCase()
      if (session.user.first.toLowerCase().includes(searchTerm) ||
                session.user.last.toLowerCase().includes(searchTerm) ||
                session.user.email.toLowerCase().includes(searchTerm)
      ) {
        return true
      }
      return false
    }

  }
}
</script>
