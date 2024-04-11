<template>
  <el-container style="background-color: #1F1F1F">
    <el-header style="background-color: #1F1F1F">
      <el-button icon="el-icon-d-arrow-left" class="navi-button" @click="back">返回</el-button>
      <el-button v-show="!isRefund" icon="el-icon-sold-out" class="navi-button" @click="clickRefund">退款单据</el-button>
      <el-button v-show="isRefund" icon="el-icon-sell" class="navi-button" @click="clickRefund">收款单据</el-button>
    </el-header>
    <el-main>
      <el-table
          :data="tableData"
          :row-style="{height: 40 +'px',background:'#2B2D30',color:'#CCCCCC'}"
          :cell-style="tableRow"
          :header-cell-style="{background:'#2B2D30',color:'#CCCCCC'}"
          :height="tableHeight"
          :highlight-selection-row="false"
          style="background-color: #2B2D30"
          v-show="!isRefund">
        <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="200">
        </el-table-column>
        <el-table-column
            prop="payment"
            label="实收金额（元）"
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
            width="300">
        </el-table-column>
        <el-table-column
            prop="createTime"
            :formatter="formatTime"
            label="时间"
            width="319">
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkRecord(scope.$index)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
          :data="tableData"
          :row-style="{height: 40 +'px',background:'#2B2D30',color:'#CCCCCC'}"
          :cell-style="tableRow"
          :header-cell-style="{background:'#2B2D30',color:'#CCCCCC'}"
          :height="tableHeight"
          :highlight-selection-row="false"
          style="background-color: #2B2D30"
          v-show="isRefund">
        <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="200">
        </el-table-column>
        <el-table-column
            prop="payment"
            label="退款金额（元）"
            width="400">
        </el-table-column>
        <el-table-column
            prop="member.name"
            label="会员姓名"
            width="400">
        </el-table-column>
        <el-table-column
            prop="createTime"
            :formatter="formatTime"
            label="时间"
            width="419">
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkRecord(scope.$index)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="'总金额：' + this.title.totalPrice.toString() + '（元） 会员：' + this.title.name" class="dialog-table"
                 width="50%" :visible.sync="recordDialogVisible">
        <div style="padding-top: 0px">
          <el-table :data="dialogTableData"
                    :row-style="{height: 40 +'px',background:'#2E2E2E',color:'#CCCCCC'}"
                    :cell-style="dialogTableRow"
                    :header-cell-style="{background:'#2E2E2E',color:'#CCCCCC'}"
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
    </el-main>
    <el-footer>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNo"
          :page-sizes="[20, 50, 100]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          style="color: #CCCCCC"
          :total="total">
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
import store from '../../../../store'
import {getRecordsWithMember, getRecordWithCommodity} from '@api/record'
export default {
  data () {
    return {
      tableHeight: window.innerHeight - 160,
      recordDialogVisible: false,
      isRefund: false,
      query: {
        workerId: 0,
        type: 0,
        pageNo: 1,
        pageSize: 20
      },
      title: {
        totalPrice: 0,
        name: ''
      },
      total: 0,
      tableData: [],
      dialogTableData: []
    }
  },
  methods: {
    clickRefund () {
      this.isRefund = !this.isRefund
      this.getRecordsWithMember()
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
    dialogTableRow ({row, rowIndex}) {
      return 'background: #2E2E2E; padding: 0px;'
    },
    handleSizeChange (value) {
      this.query.pageSize = value
      this.getRecordsWithMember()
    },
    handleCurrentChange (value) {
      this.query.pageNo = value
      this.getRecordsWithMember()
    },
    formatMethod (row) {
      if (row.method === 0) {
        return '现金支付'
      } else {
        return '移动支付'
      }
    },
    getRecordsWithMember () {
      this.query.type = this.isRefund ? 1 : 0
      getRecordsWithMember(this.query).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    back () {
      this.$router.push({path: '/cashier'})
    },
    tableRow ({row, rowIndex}) {
      if (rowIndex === this.currentRow) {
        return 'background: #3C658C; padding: 0px'
      } else { return 'background: #2B2D30; padding: 0px' }
    },
    indexMethod (index) {
      return (this.query.pageNo - 1) * this.query.pageSize + index + 1
    },
    formatTime (row) {
      const date = new Date(row.createTime)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    handlePressKey (e) {
      if (e.key === 'Escape') {
        this.back()
      } else if (e.ctrlKey && e.key === 'F1') {
        this.clickRefund()
      }
    }
  },
  created () {
    this.query.workerId = store.getters['user/getUserId']
    this.getRecordsWithMember()
  },
  beforeDestroy () {
    // 在组件销毁前移除键盘事件监听器
    window.removeEventListener('keydown', this.handlePressKey)
  },
  mounted () {
    document.addEventListener('keydown', this.handlePressKey)
    // window.onresize:浏览器尺寸变化响应事件
    window.onresize = () => {
      return (() => {
        // window.innerHeight:浏览器的可用高度
        this.tableHeight = window.innerHeight - 160
        // console.info(this.tableHeight)
      })()
    }
  }
}
</script>
<style scoped>
.navi-button{
  margin-top: 20px;
  background-color: #1F1F1F;
  color: #CCCCCC;
  border: #1F1F1F;
}
.navi-button:hover{
  background-color: #37373D;
  color: #CCCCCC
}
.space-container{
  display: flex;
  justify-content: space-between;

}
.el-input /deep/ .el-input__inner {
  background-color: #37373D ;
  color: #CCCCCC
}
::v-deep  .el-table .el-table__body tr.hover-row > td{
  background-color:#2E2E2E!important
}
::v-deep  .el-table--enable-row-hover .el-table__body tr:hover > td{
  background-color:#2E2E2E!important
}
/deep/ .dialog-table .el-dialog__header  {
  background-color: #2E2E2E;
}
/deep/ .dialog-table .el-dialog__title  {
  color: #CCCCCC;
}
/deep/ .dialog-table .el-dialog__body  {
  background-color: #2E2E2E
}
/deep/ .el-form-item__label {
  color: #CCCCCC; /* 设置你想要的颜色 */
}
/deep/ .el-pagination__total{
  color: #CCCCCC;
}
/deep/ .el-pagination__jump{
  color: #CCCCCC;
}
</style>
