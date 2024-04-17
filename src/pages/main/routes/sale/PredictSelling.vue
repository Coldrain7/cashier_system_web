<template>
  <div>
    <div style="display: flex;justify-content: center">
      <div style="text-align: right;width: 50%">
        <el-input style="padding-top: 15px;width: 200px" size="mini" v-model="query.barcode" placeholder="商品名称/条码"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="getCommodities" size="mini">搜索</el-button>
        <el-button type="primary" @click="predictSelling" size="mini">预测</el-button>
      </div>
    </div>
    <div class="center-container">
      <div id="predict" style="width: 60%;height: 400px"></div>
    </div>
      <el-dialog title="选择商品" width="40%" :visible.sync="commodityDialogVisible">
        <div style="padding-top: 0px">
          <el-table :data="dialogTableData"
                    :row-style="{height: 40 +'px'}"
                    max-height="300">
            <el-table-column
                prop="barcode"
                label="条码"
                width="200">
            </el-table-column>
            <el-table-column
                prop="name"
                label="商品名称"
                width="200">
            </el-table-column>
            <el-table-column
                prop="price"
                label="单价（元）"
                width="100">
            </el-table-column>
            <el-table-column
                label="操作"
                width="124">
              <template slot-scope="scope">
                <el-button @click="chooseCommodity(scope.$index)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    <div class="center-container">
      <div style="width: 60%;">
        <el-table :data="tableData"
                  border
                  :row-style="{height: 40 +'px'}"
                  max-height="400">
          <el-table-column
              type="index"
              label="序号"
              width="80">
          </el-table-column>
          <el-table-column
              prop="time"
              label="时间"
              width="150">
          </el-table-column>
          <el-table-column
              prop="recordNum"
              label="订单数"
              width="123">
          </el-table-column>
          <el-table-column
              prop="totalNumber"
              label="商品数量"
              width="150">
          </el-table-column>
          <el-table-column
              prop="totalPayment"
              label="总额"
              width="120">
          </el-table-column>
          <el-table-column
              prop="totalProfit"
              label="利润"
              width="120">
          </el-table-column>
          <el-table-column
              prop="profitRatio"
              label="毛利率"
              width="120">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script >
import store from '../../../../store'
import {getSellingByComId, predictSelling} from '@api/record'
import {getSupIdById} from '@api/user'
import {getCommoditiesByKeyword} from '@api/commodity'
export default {
  data () {
    return {
      id: '',
      commodityDialogVisible: false,
      isPredicted: false,
      query: {
        barcode: '',
        supId: '',
        comId: 0,
        beginDate: '',
        endDate: ''
      },
      option: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: [],
            label: {
              show: true,
              position: 'top'
            },
            itemStyle: {
              color: '#5870C6'
            }
          }
        ]
      },
      dialogTableData: [],
      tableData: [],
      seriesData: []
    }
  },
  methods: {
    predictSelling () {
      if (this.isPredicted) return
      let data = this.seriesData.slice(0, -1)// 不把最后一个数据传入，因为最后一个数据为本周，本周大概率没有结束，不便加入数据进行预测
      predictSelling(data).then(res => {
        if (res.status) {
          let arr = []
          arr.push('本周预测值')
          let obj = {}
          obj.value = Math.round(res.data[0] * 100) / 100
          obj.itemStyle = {}
          obj.itemStyle.color = '#90CB74'
          this.seriesData.push(obj)
          for (let i = 1; i < res.data.length; i++) {
            arr.push('下' + i + '周预测值')
            let entity = {}
            entity.value = Math.round(res.data[i] * 100) / 100
            entity.itemStyle = {}
            entity.itemStyle.color = '#90CB74'
            this.seriesData.push(entity)
          }
          this.option.series.data = this.seriesData
          // console.info(this.seriesData)
          this.option.xAxis.data = this.option.xAxis.data.concat(arr)
          // console.info(arr)
          this.isPredicted = true
        } else {
          this.$message.error('预测失败')
        }
      })
    },
    chooseCommodity (index) {
      this.query.comId = this.dialogTableData[index]['id']
      this.getCommoditySelling()
      this.commodityDialogVisible = false
    },
    getCommodities () {
      if (this.query.barcode === '') {
        this.$message.warning('请输入关键字查询')
      } else {
        getCommoditiesByKeyword(this.query).then(res => {
          if (res.status) {
            if (res.data.length > 1) {
              this.dialogTableData = res.data
              this.commodityDialogVisible = true
            } else if (res.data.length === 1) {
              this.getCommoditySelling()
            } else {
              this.$message.error('没有查询到对应商品数据')
            }
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    getCommoditySelling () {
      getSellingByComId(this.query).then(res => {
        if (res.status) {
          // console.info(res.data)
          for (let i = 0; i < res.data.length; i++) {
            const beginDate = new Date(res.data[i].beginDate)
            const endDate = new Date(res.data[i].endDate)
            res.data[i].time = (beginDate.getMonth() + 1) + '-' + beginDate.getDate() + '~' +
                (endDate.getMonth() + 1) + '-' + endDate.getDate()
            res.data[i].profitRatio = Math.round((res.data[i].profitRatio) * 10000) / 100 + '%'
          }
          this.seriesData = []
          let arr = [] // 对应横坐标数据
          for (let i = 0; i < res.data.length - 1; i++) {
            arr.push(res.data[i].time)
            this.seriesData.push(res.data[i].totalNumber)
            let a = Number(res.data[i].week)
            let b = Number(res.data[i + 1].week)
            while (a + 1 < b && b - a < 48) {
              arr.push('本周未售出')
              this.seriesData.push(0)
              a++
            }
          }
          // for (let item of res.data) {
          //   arr.push(item.time)
          //   let entity = {}
          //   entity.value = item.totalNumber
          //   this.seriesData.push(entity)
          // }
          this.option.xAxis.data = arr
          // console.info(this.option.xAxis.data)
          this.option.series[0].data = this.seriesData
          // console.info(this.option.series)
          this.tableData = res.data
          this.isPredicted = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    initEcharts () {
      // 获取图的容器
      let dom = document.getElementById('predict')
      // 使用echarts对象初始化容器
      let echarts = this.$echarts.init(dom)
      echarts.setOption(this.option)
    },
    updateChart () {
      let echarts = this.$echarts.getInstanceByDom(document.getElementById('predict'))
      if (echarts) {
        echarts.setOption(this.option, true)
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
    })
  },
  beforeDestroy () {
    let echarts = this.$echarts.getInstanceByDom(document.getElementById('data'))
    if (echarts) {
      // 销毁Echarts实例
      echarts.dispose()
    }
  },
  mounted () {
    this.initEcharts()
  },
  watch: {
    // 侦听 option 对象的变化
    'option.series': function (val) {
      this.updateChart()
    },
    'option.xAxis.data': function (val) {
      this.updateChart()
    }
    // ,option: {
    //   handler () {
    //     this.updateChart()
    //   },
    //   deep: true // 深度观察对象的变化
    // }
  }
}
</script>
<style scoped>
.center-container{
  display: flex;
  justify-content: center; /* 水平居中 */
}
</style>
