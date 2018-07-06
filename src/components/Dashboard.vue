<template>
<v-layout class="index" row wrap>
    <v-flex xs12 sm4 md2>
        <v-navigation-drawer permanent>
            <v-list class="pt-0">
                <v-list-tile router v-for="item in items" :key="item.title" :to="item.route" exact>
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </v-flex>
    <v-flex xs12 sm8 md8>
        <router-view></router-view>
    </v-flex>
</v-layout>
</template>

<style scoped>
aside.navigation-drawer {
    padding-top: 16px;
}

.list__tile i {
    color: white;
    margin-left: 20px;
}

a {
    text-decoration: none;
}
</style>

<script>
export default {
    name: 'dashboard',
    data () {
        return {
            items: [
                { title: 'Link Open Location', route: 'demo', icon: 'room' },
                { title: 'Link Open Times', route: 'none', icon: 'history' }
            ],
            right: null
        }
    }
}
</script>
