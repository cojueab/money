<template>
  <div style='margin-top:15px'>

    <div class='columns is-desktop'>
      <div class='column'>
        <vue-monthly-picker :placeHolder="'Search for month:'"
                            v-model='selectedMonth'>
        </vue-monthly-picker>
      </div>
    </div>
    <div class='columns'>
      <button style='margin-left:12px;' class='button' @click='getFullData'>
        Report
      </button>
    </div>

    <graph v-if='data_collection!=null' :chart-data='data_collection'/>
  </div>
</template>

<script>

  import VueMonthlyPicker from 'vue-monthly-picker'

  export default {
    components: {
      'graph': () => import('../components/Graph'),
      VueMonthlyPicker
    },
    data() {
      return {
        data_collection: null,
        selectedMonth: null
      }
    },
    methods: {
      getRandom() {
        return Math.floor((Math.random() * 130) + 100)
      },
      async getFullData() {
        let d = this.selectedMonth.toDate()
        let tt = await this.$axios.get(`https://skeletpingvina.xyz/money/test/moneys1/?ordering=product&format=json&superdate=${d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()}`)
        let tableData = tt.data.results

        let titles = [...new Set(tableData.map(x => x.product))]

        let items = {}
        tableData.map(x => {
          if (items[x.product] === undefined) {
            items[x.product] = []
          }
          items[x.product].push(x.money)
        })
        const add = (a, b) => a + b
        let data = titles.map(x => items[x].reduce(add))
        let graphColors = []
        let graphOutlines = []
        let hoverColor = []
        let i = 0
        while (i <= data.length) {
          let [a, b, c] = [...[this.getRandom(), this.getRandom(), this.getRandom()]]
          graphColors.push(`rgb(${a}, ${b}, ${c})`)
          graphOutlines.push(`rgb(${(a - 80)}, ${(b - 80)}, ${(c - 80)})`)
          hoverColor.push(`rgb(${(a + 25)}, ${(b + 25)}, ${(c + 25)})`)
          i++
        }
        this.data_collection = {
          labels: titles,
          datasets: [
            {
              label: 'Spent',
              data: data,
              backgroundColor: graphColors,
              hoverBackgroundColor: hoverColor,
              borderColor: graphOutlines
            }
          ]
        }
      }
    }
  }
</script>
