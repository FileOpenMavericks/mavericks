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
</style>

<script>
import * as d3 from 'd3';
import * as foPp from '../../../../FoNodeModules/FoPreprocessor';

export default {
    name: 'open-google',
    data() {
        return {
            searchTerm: '',
            data: [50, 90, 20, 100, 40, 50],
            linkData: null,
            line: '',
            map: null
        }
    },
    mounted: function(){
      let $this = this;

      //Initializing map
      $this.map = new google.maps.Map(d3.select("#map").node(),
                    {
                        zoom: 8,
                        center: new google.maps.LatLng(37.76487, -122.41948),
                        mapTypeId: google.maps.MapTypeId.TERRAIN
                    });
      console.log($this.map);
      var overlay = new google.maps.OverlayView();
      overlay.setMap($this.map);
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

              // NOTE: This is where I would call it calculate the data and create the graphic
              //       However, it currently uses static test data so it isn't necessary
          }, response => {
              console.error(response);
          });
      }
    }
}
</script>
