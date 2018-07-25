<template>
<v-layout class="view" row wrap>
    <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
        <v-card class="content content-center text-xs-center">
            <v-card-text>
                <h2 class="card-title">Uh oh!</h2>
                <p>
                    <v-icon class="icon-big">error_outline</v-icon>
                </p>
                <p>We couldn't find the link you were looking for</p>
            </v-card-text>
        </v-card>
    </v-flex>
</v-layout>
</template>

<style>
</style>

<script>
export default {
  name: 'NotFound'
}
</script>
