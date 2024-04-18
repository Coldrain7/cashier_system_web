<template>
  <div>
    <div>
      <el-form :inline="true" style="padding: 0px;text-align: right;">
        <el-form-item style="margin: 0px;padding-left: 10px">
          <el-input size="mini" v-model="query.name" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item style="margin: 0px;">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getEvents">搜索</el-button>
        </el-form-item>
        <el-form-item style="margin: 0px;margin-right:20px">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="clickAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
          :data="tableData"
          :row-style="{height: 40 +'px'}"
          :cell-style="{padding:0+'px'}"
          :height="tableHeight"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="100">
        </el-table-column>
        <el-table-column
            prop="name"
            label="活动名称"
            width="240">
        </el-table-column>
        <el-table-column
            prop="beginTime"
            label="开始时间"
            width="200">
        </el-table-column>
        <el-table-column
            prop="endTime"
            label="结束时间"
            width="200">
        </el-table-column>
        <el-table-column
            prop="amount"
            label="活动商品数量"
            width="200">
        </el-table-column>
        <el-table-column
            prop="isDone"
            label="是否结束"
            :formatter="formatIsDone"
            width="100">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            :formatter="formatTime"
            width="200">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="150">
          <template slot-scope="scope">
            <el-button @click="editEvent(scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click="clickDelete(scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNo"
          :page-sizes="[20, 50, 100]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <!--点击新增或者编辑活动弹出对话框-->
      <el-dialog :title="isAddEvent?'新增活动':'编辑活动'" :visible.sync="eventDialogVisible" width="60%">
        <el-input size="mini" v-model="event.name" placeholder="输入活动名称" style="width: 200px"></el-input>
        <el-date-picker
            v-model="event.beginTime"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 150px"
            placeholder="选择开始日期">
        </el-date-picker>
        <el-date-picker
            v-model="event.endTime"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 150px"
            placeholder="选择结束日期">
        </el-date-picker>
        <el-input size="mini" v-model="barcode" placeholder="输入商品名称/条码" style="width: 200px"></el-input>
        <el-button type="primary" size="mini" @click="getCommodities">添加商品</el-button>
        <el-button type="primary" size="mini" @click="saveEvent">保 存</el-button>
        <el-table :data="eventCommodities"
                  :row-style="{height: 40 +'px'}"
                  :cell-style="{padding:0+'px'}"
                  max-height="300">
          <el-table-column
              type="index"
              label="序号"
              width="100">
          </el-table-column>
          <el-table-column
              prop="name"
              label="商品名称"
              width="300">
          </el-table-column>
          <el-table-column
              prop="price"
              label="单价（元）"
              width="200">
          </el-table-column>
          <el-table-column
              label="活动单价（元）"
              width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.eventPrice" @focus="handleInputFocus(scope.$index)" @blur="handleInputBlur(scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="124">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="removeCommodityFromEvent(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="选择商品" class="dialog-table" width="40%"
                 :modal="false" :visible.sync="commodityDialogVisible">
        <div style="padding-top: 0px">
          <el-table :data="dialogTableData"
                    :row-style="{height: 40 +'px'}"
                    :cell-style="{padding:0+'px'}"
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
                <el-button @click="addCommodity(scope.$index)" type="text" size="small">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <el-dialog
          title="确认删除活动吗？"
          :close-on-click-modal="false"
          width="30%"
          :visible.sync="deleteDialog">
        <div class="bottom-container">
          <el-button @click="deleteDialog = false">取 消</el-button>
          <el-button style="background-color: #F56C6C;color: white" @click="deleteEventById">确 认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import store from '../../../../store'
import {getSupIdById} from '@api/user'
import {getEvents, createEvents, getEventById, getEventCommodities, updateEventCommodities, deleteEventById} from '@api/event'
import {getCommoditiesByKeyword} from '@api/commodity'
export default {
  data () {
    return {
      id: '',
      isAddEvent: false,
      commodityDialogVisible: false,
      eventDialogVisible: false,
      deleteDialog: false,
      query: {
        supId: '',
        id: '',
        name: '',
        pageNo: 1,
        pageSize: 20
      },
      event: {
        id: '', // 编辑保存时用
        beginTime: '',
        endTime: '',
        name: '',
        prices: [],
        eventPrices: [],
        comIds: [],
        isDeleted: []// 编辑保存时用
      },
      barcode: '',
      total: 0,
      rowIndex: 0,
      tableData: [],
      dialogTableData: [],
      eventCommodities: [],
      removedCommodities: [],
      addedEvents: [], // 存储编辑模式下加入活动的商品
      lastPrice: 0,
      tableHeight: window.innerHeight - 140 // 表格动态高度
    }
  },
  methods: {
    handleInputBlur (index) {
      let regex = /^\d+(\.\d+)?$/
      if (!regex.test(this.eventCommodities[index].eventPrice)) {
        this.eventCommodities[index].eventPrice = this.lastPrice
      }
    },
    handleInputFocus (index) {
      this.lastPrice = this.eventCommodities[index].eventPrice
    },
    clickDelete (index) {
      this.rowIndex = index
      this.deleteDialog = true
    },
    deleteEventById () {
      deleteEventById(this.tableData[this.rowIndex].id).then(res => {
        if (res.data) {
          this.$message.success('删除成功')
          this.deleteDialog = false
          this.getEvents()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    editEvent (index) {
      this.event.id = this.tableData[index].id // 给event.id赋值让后端往已有活动中插入
      this.addedEvents = []
      this.removedCommodities = []
      this.isAddEvent = false// 控制dialog标题
      this.eventDialogVisible = true// 控制dialog显示
      getEventCommodities(this.tableData[index].id).then(res => {
        this.eventCommodities = res.data
        this.event.beginTime = this.tableData[index].beginTime
        this.event.endTime = this.tableData[index].endTime
        this.event.name = this.tableData[index].name
      })
    },
    getOneEvent (id) {
      getEventById(id).then(res => {
        this.tableData = []
        this.tableData.push(res.data)
      })
    },
    saveEvent () {
      if (this.event.beginTime === '' || this.event.beginTime === '') {
        this.$message.warning('请输入时间信息')
      } else if (this.eventCommodities.length <= 0) {
        this.$message.warning('商品数量不能为0')
      } else if (this.isAddEvent) { // 新增模式
        this.event.eventPrices = []
        this.event.prices = []
        this.event.comIds = []
        for (let item of this.eventCommodities) {
          this.event.prices.push(item.price)
          this.event.eventPrices.push(item.eventPrice)
          this.event.comIds.push(item.comId)
        }
        createEvents(this.event).then(res => {
          if (res.status) {
            this.$message.success('创建成功')
            this.getOneEvent(res.data)
            this.total = 1
            this.eventDialogVisible = false
          } else {
            this.$message.error(res.message)
          }
        })
      } else { // 编辑模式
        // 先插入新添加的商品，在对商品统一更新
        if (this.addedEvents.length > 0) { // 有新添加的商品
          let obj = {
            id: '', // 编辑保存时用
            beginTime: '',
            endTime: '',
            name: '',
            prices: [],
            eventPrices: [],
            comIds: []
          }
          obj.id = this.event.id
          obj.beginTime = this.event.beginTime
          obj.endTime = this.event.endTime
          obj.name = this.event.name
          for (let item of this.addedEvents) {
            obj.prices.push(item.price)
            obj.eventPrices.push(item.eventPrice)
            obj.comIds.push(item.comId)
          }
          let flag = false
          // console.info(this.event)
          console.info(this.obj)
          createEvents(obj).then(res => {
            if (!res.status) {
              this.$message.error('添加商品失败,请重试')
              flag = true
            }
          })
          if (flag) return
        }
        // prices: [],
        //     eventPrices: [],
        //     comIds: [],
        //     isDeleted: []/
        this.event.eventPrices = []
        this.event.prices = []
        this.event.comIds = []
        this.event.isDeleted = []
        // 插入时不用isDeleted数组
        for (let item of this.eventCommodities) {
          this.event.prices.push(item.price)
          this.event.eventPrices.push(item.eventPrice)
          this.event.comIds.push(item.comId)
          this.event.isDeleted.push(false)
        }
        for (let item of this.removedCommodities) {
          this.event.prices.push(item.price)
          this.event.eventPrices.push(item.eventPrice)
          this.event.comIds.push(item.comId)
          this.event.isDeleted.push(true)
        }
        updateEventCommodities(this.event).then(res => {
          if (res.status) {
            this.$message.success('保存成功')
            this.eventDialogVisible = false
            this.getOneEvent(res.data)
            this.total = 1
          } else {
            this.$message.error('更新失败')
          }
        })
      }
    },
    removeCommodityFromEvent (index) {
      if (!this.isAddEvent) {
        this.removedCommodities.push(this.eventCommodities[index])
      }
      this.eventCommodities.splice(index, 1)
    },
    addCommodity (index) {
      for (let item of this.eventCommodities) {
        if (item.comId === this.dialogTableData[index].id) {
          this.$message.warning('商品已存在')
          return
        }
      }
      let obj = {
        id: '',
        name: '',
        price: '',
        eventPrice: ''
      }
      obj.comId = this.dialogTableData[index].id
      obj.name = this.dialogTableData[index].name
      obj.price = this.dialogTableData[index].price
      obj.eventPrice = obj.price
      this.eventCommodities.push(obj)
      if (!this.isAddEvent) { // 如果编辑模式下给活动添加了商品，商品信息加入addedEvents
        this.addedEvents.push(obj)
      }
      this.commodityDialogVisible = false
    },
    getCommodities () {
      if (this.barcode === '') {
        this.$message.warning('请输入关键字查询')
      } else {
        let query = {}
        query.barcode = this.barcode
        query.supId = this.query.supId
        getCommoditiesByKeyword(query).then(res => {
          if (res.status) {
            if (res.data.length > 1) {
              this.dialogTableData = res.data
              this.commodityDialogVisible = true
            } else if (res.data.length === 1) {
              for (let item of this.eventCommodities) {
                if (item.comId === this.dialogTableData[0].id) {
                  this.$message.warning('商品已存在')
                  return
                }
              }
              let obj = {
                id: '',
                name: '',
                price: '',
                eventPrice: ''
              }
              obj.comId = this.dialogTableData[0].id
              obj.name = this.dialogTableData[0].name
              obj.price = this.dialogTableData[0].price
              obj.eventPrice = obj.price
              this.eventCommodities.push(obj)
            } else {
              this.$message.error('没有查询到对应商品数据')
            }
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    clickAdd () {
      this.event.id = ''
      this.isAddEvent = true
      this.eventDialogVisible = true
      this.event.beginTime = ''
      this.event.endTime = ''
      this.barcode = ''
      this.event.name = ''
      this.eventCommodities = []
      this.addedEvents = []
    },
    handleSizeChange (value) {
      this.query.pageSize = value
      this.getEvents()
    },
    handleCurrentChange (value) {
      this.query.pageNo = value
      this.getEvents()
    },
    formatIsDone (row) {
      return row.isDone ? '是' : '否'
    },
    getEvents () {
      getEvents(this.query).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    formatTime (row) {
      const date = new Date(row.createTime)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    indexMethod (index) {
      return (this.query.pageNo - 1) * this.query.pageSize + index + 1
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.getEvents()
    })
  },
  mounted: function () {
    // window.onresize:浏览器尺寸变化响应事件
    window.onresize = () => {
      return (() => {
        // window.innerHeight:浏览器的可用高度
        this.tableHeight = window.innerHeight - 140
        // console.info(this.tableHeight)
      })()
    }
  }
}
</script>
<style scoped>
.bottom-container{
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
