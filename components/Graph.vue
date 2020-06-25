<template>
  <div class="container">
    <canvas ref="canvas" width="900" height="400"></canvas>
  </div>
</template>

<script>
  import {Doughnut, mixins} from 'vue-chartjs'

  const {reactiveProp} = mixins

  export default {
    extends: Doughnut,
    mixins: [reactiveProp],
    props: ['options'],
    mounted() {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>

<style scoped>

</style>
