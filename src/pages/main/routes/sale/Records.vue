<template>
  <div>
    <div style="text-align: right">
      <el-input size="mini" v-model="query.workerId" placeholder="输入员工号" style="width: 200px"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getRecords" size="mini">搜索</el-button>
      <el-button v-show="!isRefund" icon="el-icon-sold-out" type="primary" size="mini" @click="clickRefund"
      style="margin-right: 20px">查看退款单据</el-button>
      <el-button v-show="isRefund" icon="el-icon-sell" type="primary" size="mini" @click="clickRefund"
                 style="margin-right: 20px">查看收款单据</el-button>
    </div>
    <div>
      <el-table
          :data="tableData"
          :row-style="{height: 40 +'px'}"
          :cell-style="{padding:0+'px'}"
          :height="tableHeight"
          v-show="!isRefund">
        <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="100">
        </el-table-column>
        <el-table-column
            prop="payment"
            label="实收金额（元）"
            width="200">
        </el-table-column>
        <el-table-column
            prop="worker.name"
            label="员工姓名"
            width="300">
        </el-table-column>
        <el-table-column
            prop="member.name"
            label="会员姓名"
            width="300">
        </el-table-column>
        <el-table-column
            prop="method"
            label="支付方式"
            :formatter="formatMethod"
            width="200">
        </el-table-column>
        <el-table-column
            prop="createTime"
            :formatter="formatTime"
            label="时间"
            width="219">
        </el-table-column>
        <el-table-column
            label="操作"
            width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkRecord(scope.$index)">查看</el-button>
            <el-button type="text" size="small" @click="clickDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
          :data="tableData"
          :row-style="{height: 40 +'px'}"
          :cell-style="{padding:0+'px'}"
          :height="tableHeight"
          v-show="isRefund">
        <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="100">
        </el-table-column>
        <el-table-column
            prop="payment"
            label="退款金额（元）"
            width="300">
        </el-table-column>
        <el-table-column
            prop="worker.name"
            label="员工姓名"
            width="300">
        </el-table-column>
        <el-table-column
            prop="member.name"
            label="会员姓名"
            width="300">
        </el-table-column>
        <el-table-column
            prop="createTime"
            :formatter="formatTime"
            label="时间"
            width="239">
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkRecord(scope.$index)">查看</el-button>
            <el-button type="text" size="small" @click="clickDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="'总金额：' + this.title.totalPrice.toString() + '（元） 会员：' + this.title.name" class="dialog-table"
                 width="50%" :visible.sync="recordDialogVisible">
        <div style="padding-top: 0px">
          <el-table :data="dialogTableData"
                    :row-style="{height: 40 +'px'}"
                    max-height="300">
            <el-table-column
                type="index"
                label="序号"
                width="50">
            </el-table-column>
            <el-table-column
                prop="commodity.barcode"
                label="条码"
                width="200">
            </el-table-column>
            <el-table-column
                prop="commodity.name"
                label="商品名称"
                width="270">
            </el-table-column>
            <el-table-column
                prop="number"
                label="数量"
                width="70">
            </el-table-column>
            <el-table-column
                prop="commodity.price"
                label="单价（元）"
                width="100">
            </el-table-column>
            <el-table-column
                prop="payment"
                label="实收（元）"
                width="100">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.pageNo"
            :page-sizes="[20, 50, 100]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      <el-dialog
          title="确认删除数据吗？"
          :close-on-click-modal="false"
          :visible.sync="deleteDialog"
          width="30%">
        <div style="display: flex;justify-content: space-between">
          <el-button @click="deleteDialog = false" style="width: 150px">取 消</el-button>
          <el-button style="background-color: #F56C6C;color: white;width: 150px" @click="deleteRecord">确 认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import store from '../../../../store'
import {getSupIdById} from '@api/user'
import {getSupRecords, getRecordWithCommodity, deleteRecordById} from '@api/record'
export default {
  data () {
    return {
      tableHeight: window.innerHeight - 140,
      recordDialogVisible: false,
      isRefund: false,
      deleteDialog: false,
      id: '',
      query: {
        supId: 0,
        type: 0,
        workerId: '',
        pageNo: 1,
        pageSize: 20
      },
      title: {
        totalPrice: 0,
        name: ''
      },
      tableData: [],
      dialogTableData: [],
      total: 0,
      rowIndex: 0
    }
  },
  methods: {
    clickDelete (index) {
      this.rowIndex = index
      this.deleteDialog = true
    },
    deleteRecord () {
      let query = {}
      query.id = this.tableData[this.rowIndex]['id']
      deleteRecordById(query).then(res => {
        if (res.data) {
          this.$message.success('删除成功')
          this.getRecords()
          this.deleteDialog = false
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    checkRecord (index) {
      this.title.totalPrice = this.tableData[index]['payment']
      this.title.name = this.tableData[index]['member']['name'] === null ? ' ' : this.tableData[index]['member']['name']
      let query = {}
      query.id = this.tableData[index]['id']
      query.type = this.query.type
      getRecordWithCommodity(query).then(res => {
        this.dialogTableData = res.data
        this.recordDialogVisible = true
      })
    },
    formatMethod (row) {
      if (row.method === 0) {
        return '现金支付'
      } else {
        return '移动支付'
      }
    },
    handleSizeChange (value) {
      this.query.pageSize = value
      this.getRecords()
    },
    handleCurrentChange (value) {
      this.query.pageNo = value
      this.getRecords()
    },
    getRecords () {
      let regex = /^\d+$/
      if (regex.test(this.query.workerId) || this.query.workerId === '') {
        this.query.type = this.isRefund ? 1 : 0
        getSupRecords(this.query).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
        })
      } else {
        this.$message.warning('请输入正确形式的员工号')
      }
    },
    clickRefund () {
      this.isRefund = !this.isRefund
      this.getRecords()
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
    this.tableData = this.placeholderData
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.getRecords()
    })
  },
  mounted () {
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

</style>
