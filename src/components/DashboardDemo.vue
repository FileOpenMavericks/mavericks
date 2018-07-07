<template>
<v-container grid-list-md>
    <v-layout row wrap>
        <v-card xs12 class="content content-center">
            <v-toolbar class="file-toolbar">
                <v-text-field prepend-icon="search" v-model="searchTerm" hide-details single-line></v-text-field>
            </v-toolbar>
            <v-card-text>
                <svg width="100%" height="500px">
                    <g style="transform: translate(0, 10px)">
                        <path :d="line" />
                    </g>
                </svg>
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
</style>

<script>
import * as d3 from 'd3';

export default {
    name: 'dashboard-demo',
    data() {
        return {
            searchTerm: '',
            data: [50, 90, 20, 100, 40, 50],
            linkData: null,
            line: ''
        }
    },
    mounted: function() {
        this.getData();

        this.calculatePath();
    },
    created: function() {},
    methods: {
        getData() {
            let $this = this;
            let linkId = '426732708eee4929bd0ecbe9a4fc0b18'
            $this.$http.get('https://pubtest.fileopen.com/api/analytics/link/' + linkId).then(response => {
                $this.linkData = response.body;
                // NOTE: Data is an array of entries, this prints the first entry
                console.log($this.linkData[0]);

                // NOTE: This is where I would call it calculate the data and create the graphic
                //       However, it currently uses static test data so it isn't necessary
            }, response => {
                console.error(response);
            });
        },
        getScales() {
            const x = d3.scaleTime().range([0, 430]);
            const y = d3.scaleLinear().range([210, 0]);
            d3.axisLeft().scale(x);
            d3.axisBottom().scale(y);
            x.domain(d3.extent(this.data, (d, i) => i));
            y.domain([0, d3.max(this.data, d => d)]);
            return {
                x,
                y
            };
        },
        calculatePath() {
            const scale = this.getScales();
            const path = d3.line()
                .x((d, i) => scale.x(i))
                .y(d => scale.y(d));
            this.line = path(this.data);
        },
    }
}
</script>
