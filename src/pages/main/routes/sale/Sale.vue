<template>
  <div>
    <div class="center-container">
      <div style="width: 40%;padding-left: 70px;margin-top: 20px;margin-bottom: 0px">
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
        <span style="padding-top: 5px;padding-left: 40px">按</span>
        <el-select size="mini" style="width: 80px" v-model="query.mode" placeholder="请选择">
          <el-option
              v-for="item in modeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="getSaleData">统计分析</el-button>
      </div>
    </div>
    <div class="center-container">
      <div id="data" style="width: 60%;height: 400px"></div>
      <div style="display: flex;flex-direction: column;">
        <el-checkbox-group class="vertical-checkbox-group" v-model="checkList" @change="handleCheckChange">
          <el-checkbox class="blue-checkbox" label="——销售总额"></el-checkbox>
          <el-checkbox class="green-checkbox" label="——商品数量"></el-checkbox>
          <el-checkbox class="purple-checkbox" label="——利润"></el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group class="vertical-checkbox-group" v-model="typeList" @change="handleCheckChange">
          <el-checkbox label="折线" style="margin-top: 50px"></el-checkbox>
          <el-checkbox label="柱状"></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
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
<script>
import {getSale} from '@api/record'
import {getSupIdById} from '@api/user'
import store from '../../../../store'
export default {
  data () {
    return {
      id: '',
      query: {
        supId: 0,
        beginDate: '',
        endDate: '',
        mode: 0
      },
      option: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      seriesData: [],
      checkList: [],
      typeList: [],
      tableData: [],
      modeOptions: [{
        value: 0,
        label: '天'
      }, {
        value: 1,
        label: '周'
      }, {
        value: 2,
        label: '月'
      }]
    }
  },
  methods: {
    isMoreThanOneYear (beginDate, endDate) {
      let date1 = new Date(beginDate)
      let date2 = new Date(endDate)
      let diff = Math.abs(date1.getTime() - date2.getTime())
      let oneYear = 1000 * 60 * 60 * 24 * 365 // 一年的毫秒数，这里假设为365天，实际上可能有闰年等情况需要考虑
      return diff > oneYear
    },
    getSaleData () {
      if (this.isMoreThanOneYear(this.query.beginDate, this.query.endDate)) {
        this.$message.warning('只能统计一年以内的数据')
      } else {
        getSale(this.query).then(res => {
          if (res.status) {
            if (this.query.mode === 0) {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].time = res.data[i].beginDate
                res.data[i].profitRatio = Math.round((res.data[i].profitRatio) * 10000) / 100 + '%'
              }
            } else if (this.query.mode === 1) { // 按周查询
              for (let i = 0; i < res.data.length; i++) {
                const beginDate = new Date(res.data[i].beginDate)
                const endDate = new Date(res.data[i].endDate)
                res.data[i].time = (beginDate.getMonth() + 1) + '-' + beginDate.getDate() + '~' +
                    (endDate.getMonth() + 1) + '-' + endDate.getDate()
                res.data[i].profitRatio = Math.round((res.data[i].profitRatio) * 10000) / 100 + '%'
              }
            } else if (this.query.mode === 2) { // 按月查询
              for (let i = 0; i < res.data.length; i++) {
                const beginDate = new Date(res.data[i].beginDate)
                res.data[i].time = beginDate.getFullYear() + '-' + (beginDate.getMonth() + 1)
                res.data[i].profitRatio = Math.round((res.data[i].profitRatio) * 10000) / 100 + '%'
              }
            }
            this.seriesData = [[], [], []]
            let arr = []
            for (let item of res.data) {
              arr.push(item.time)
              let entity1 = {}
              entity1.value = item.totalPayment
              this.seriesData[0].push(entity1)
              let entity2 = {}
              entity2.value = item.totalNumber
              this.seriesData[1].push(entity2)
              let entity3 = {}
              entity3.value = item.totalProfit
              this.seriesData[2].push(entity3)
            }
            this.option.xAxis.data = arr
            this.tableData = res.data
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    // option = {
    //   xAxis: {
    //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       type: 'bar',
    //       data: [23, 24, 18, 25, 27, 28, 25]
    //     }
    //   ]
    // }
    handleCheckChange () {
      if (this.typeList.length === 0) { // 没有选择折线图或者柱状图
        this.$message.warning('未选择视图类型')
      } else {
        this.option.series = []
        for (let item of this.typeList) {
          for (let i = 0; i < this.checkList.length; i++) {
            let entity = {}
            entity.label = {}
            entity.label.show = true
            if (item === '折线') {
              entity.type = 'line'
              entity.label.position = 'left'
            } else {
              entity.type = 'bar'
              entity.label.position = 'top'
            }
            entity.lineStyle = {}
            entity.itemStyle = {}
            if (this.checkList[i] === '——销售总额') {
              entity.data = this.seriesData[0]
              entity.lineStyle.color = '#5870C6'
              entity.itemStyle.color = '#5870C6'
            } else if (this.checkList[i] === '——商品数量') {
              entity.data = this.seriesData[1]
              entity.lineStyle.color = '#90CB74'
              entity.itemStyle.color = '#90CB74'
            } else if (this.checkList[i] === '——利润') {
              entity.data = this.seriesData[2]
              entity.lineStyle.color = '#A349A4'
              entity.itemStyle.color = '#A349A4'
            }
            this.option.series.push(entity)
          }
        }
      }
    },
    // 不能用created，因为created不能获取到dom元素，要用mounted
    initEcharts () {
      // 获取图的容器
      let dom = document.getElementById('data')
      // 使用echarts对象初始化容器
      let echarts = this.$echarts.init(dom)
      echarts.setOption(this.option)
    },
    updateChart () {
      let echarts = this.$echarts.getInstanceByDom(document.getElementById('data'))
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
    this.query.beginDate = `${year}-${month}-${day}`
    this.query.endDate = `${year}-${month}-${day}`
    // this.query.beginDate = new Date()
    // this.query.endDate = new Date()
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.getSaleData()
    })
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
.vertical-checkbox-group {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  margin-left: 0;
}
/deep/ .blue-checkbox .el-checkbox__inner:after{
  border: 2px solid #5870C6;
  border-top-width: 2px;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  border-top-color: #5870C6;
  border-right-color: #5870C6;
  border-bottom-color: #5870C6;
  border-left-color: #5870C6;
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  border-top: none;
  border-top-width: initial;
  border-top-style: none;
  border-top-color: initial;
  border-left: none;
  border-left-width: initial;
  border-left-style: none;
  border-left-color: initial;
}
/deep/ .blue-checkbox .el-checkbox__label{
  color: #5870C6;
}
/deep/ .green-checkbox .el-checkbox__inner:after{
  border: 2px solid #90CB74;
  border-top-width: 2px;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  border-top-color: #90CB74;
  border-right-color: #90CB74;
  border-bottom-color: #90CB74;
  border-left-color: #90CB74;
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  border-top: none;
  border-top-width: initial;
  border-top-style: none;
  border-top-color: initial;
  border-left: none;
  border-left-width: initial;
  border-left-style: none;
  border-left-color: initial;
}
/deep/ .green-checkbox .el-checkbox__label{
  color: #90CB74;
}
/deep/ .purple-checkbox .el-checkbox__inner:after{
  border: 2px solid #A349A4;
  border-top-width: 2px;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  border-top-color: #A349A4;
  border-right-color: #A349A4;
  border-bottom-color: #A349A4;
  border-left-color: #A349A4;
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  border-top: none;
  border-top-width: initial;
  border-top-style: none;
  border-top-color: initial;
  border-left: none;
  border-left-width: initial;
  border-left-style: none;
  border-left-color: initial;
}
/deep/ .purple-checkbox .el-checkbox__label{
  color: #A349A4;
}
</style>
