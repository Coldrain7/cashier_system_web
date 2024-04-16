<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 20px;margin-bottom: 20px">
      <div>
        <el-checkbox v-model="query.includeSubClass" >覆盖子分类</el-checkbox>
        <el-date-picker
            v-model="query.beginDate"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 150px"
            placeholder="选择开始日期">
        </el-date-picker>
        <el-date-picker
            v-model="query.endDate"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 150px"
            placeholder="选择结束日期">
        </el-date-picker>
        <el-button type="primary" size="mini" @click="getProportion">统计分析</el-button>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between;margin-top: 150px">
      <div id="sale" style="width: 33.3%;height: 500px"></div>
      <div id="number" style="width: 33.3%;height: 500px"></div>
      <div id="profit" style="width: 33.3%;height: 500px"></div>
    </div>
  </div>
</template>
<script>
import store from '../../../../store'
import {getSupIdById} from '@api/user'
import {getProportion} from '@api/record'
export default {
  data () {
    return {
      id: '',
      query: {
        supId: '',
        beginDate: '',
        endDate: '',
        includeSubClass: false
      },
      saleData: [],
      numberData: [],
      profitData: []
    }
  },
  methods: {
    getProportion () {
      if (this.query.beginDate !== '' && this.query.endDate !== '') {
        getProportion(this.query).then(res => {
          console.info(this.query.includeSubClass)
          let sData = []
          let nData = []
          let pData = []
          for (let i = 0; i < res.data.length; i++) {
            let data1 = {}
            data1.name = res.data[i].classification
            data1.value = res.data[i].totalPayment
            sData.push(data1)
            let data2 = {}
            data2.name = res.data[i].classification
            data2.value = res.data[i].totalNumber
            nData.push(data2)
            let data3 = {}
            data3.name = res.data[i].classification
            data3.value = res.data[i].totalProfit
            pData.push(data3)
          }
          this.saleData = sData
          this.numberData = nData
          this.profitData = pData
        })
      } else {
        this.$message.warning('请选择时间')
      }
    },
    initEcharts () {
      let dom = document.getElementById('sale')
      let echarts = this.$echarts.init(dom)
      let saleOption = {
        title: {
          text: '销售额分类占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '销售额占比',
            type: 'pie',
            radius: '50%',
            data: [],
            label: {
              show: true,
              formatter: '{d}%'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            }
          }
        ]}
      echarts.setOption(saleOption)
      let dom1 = document.getElementById('number')
      let echarts1 = this.$echarts.init(dom1)
      let numberOption = {
        title: {
          text: '销售量分类占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '销售量占比',
            type: 'pie',
            radius: '50%',
            data: [],
            label: {
              show: true,
              formatter: '{d}%'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            }
          }
        ]}
      echarts1.setOption(numberOption)
      let dom2 = document.getElementById('profit')
      let echarts2 = this.$echarts.init(dom2)
      let profitOption = {
        title: {
          text: '利润分类占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '利润占比',
            type: 'pie',
            radius: '50%',
            data: [],
            label: {
              show: true,
              formatter: '{d}%'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            }
          }
        ]}
      echarts2.setOption(profitOption)
    },
    updateSaleChart () {
      let echarts = this.$echarts.getInstanceByDom(document.getElementById('sale'))
      if (echarts) {
        let newDataOption = {
          title: {
            text: '销售额分类占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '销售额占比',
              type: 'pie',
              radius: '50%',
              data: this.saleData,
              label: {
                show: true,
                formatter: '{d}%'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              }
            }
          ]}
        echarts.setOption(newDataOption, true)
      }
    },
    updateNumberChart () {
      let echarts = this.$echarts.getInstanceByDom(document.getElementById('number'))
      if (echarts) {
        let newDataOption = {
          title: {
            text: '销售量分类占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '销售量占比',
              type: 'pie',
              radius: '50%',
              data: this.numberData,
              label: {
                show: true,
                formatter: '{d}%'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              }
            }
          ]}
        echarts.setOption(newDataOption, true)
      }
    },
    updateProfitChart () {
      let echarts = this.$echarts.getInstanceByDom(document.getElementById('profit'))
      if (echarts) {
        let newDataOption = {
          title: {
            text: '利润分类占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '利润占比',
              type: 'pie',
              radius: '50%',
              data: this.profitData,
              label: {
                show: true,
                formatter: '{d}%'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              }
            }
          ]}
        echarts.setOption(newDataOption, true)
      }
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1// 注意：月份是从0开始的，所以要加1
    let day = now.getDate()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    this.query.endDate = `${year}-${month}-${day}`
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) { // 处理闰年2月29日情况
      day = day === 29 ? 28 : day
    }
    this.query.beginDate = `${year - 1}-${month}-${day}`
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.getProportion()
    })
  },
  mounted () {
    this.initEcharts()
  },
  watch: {
    // 侦听 option 对象的变化
    'saleData': function (val) {
      this.updateSaleChart()
    },
    'numberData': function (val) {
      this.updateNumberChart()
    },
    'profitData': function (val) {
      this.updateProfitChart()
    }
  }
}
</script>
<style scoped>

</style>
