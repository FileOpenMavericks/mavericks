<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <v-text-field prepend-icon="search" v-model="searchTerm" hide-details single-line></v-text-field>
            </v-toolbar>
            <v-card-text>
                <div id="heatchart-container" class="svg-container"></div>
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
        console.log(output)

        // NOTE: This is where I would call it calculate the data and create the graphic
        //       However, it currently uses static test data so it isn't necessary
      }, response => {
        console.error(response)
      })
    }
  }
}
</script>
