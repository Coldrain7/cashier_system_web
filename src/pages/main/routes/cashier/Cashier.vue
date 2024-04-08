<template>
<el-container style="background-color: #1F1F1F">
  <el-header style="background-color: #1F1F1F">
    <el-button icon="el-icon-plus" class="navi-button">新增会员</el-button>
    <el-button icon="el-icon-s-order" class="navi-button">销售单据</el-button>
    <el-button icon="el-icon-s-finance" class="navi-button">退货</el-button>
    <el-button icon="el-icon-switch-button" class="navi-button" @click="quit">退出登录</el-button>
  </el-header>
  <el-main>
    <el-table
        :data="tableData"
        :row-style="{height: 40 +'px',background:'#2B2D30',color:'#CCCCCC'}"
        :cell-style="tableRow"
        :header-cell-style="{background:'#2B2D30',color:'#CCCCCC'}"
        :height="tableHeight"
        :highlight-selection-row="false"
        style="background-color: #2B2D30">
      <el-table-column
          type="index"
          :index="indexMethod"
          label="序号"
          width="50">
      </el-table-column>
      <el-table-column
          prop="barcode"
          label="条码"
          width="300">
      </el-table-column>
      <el-table-column
          prop="name"
          label="商品名称"
          width="450">
      </el-table-column>
      <el-table-column
          prop="price"
          label="单价（元）"
          width="200">
      </el-table-column>
      <el-table-column
          prop="num"
          label="数量"
          width="200">
      </el-table-column>
      <el-table-column
          prop="nowPrice"
          label="现价（元）"
          width="200">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.nowPrice">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="sum"
          label="小计（元）"
          width="218">
      </el-table-column>
    </el-table>
    <el-dialog title="选择商品" class="dialog-table" width="40%"
     :modal="false" :visible.sync="commodityDialogVisible">
      <div style="padding-top: 0px">
        <el-table :data="dialogTableData"
                  :row-style="{height: 40 +'px',background:'#2E2E2E',color:'#CCCCCC'}"
                  :cell-style="dialogTableRow"
                  :header-cell-style="{background:'#2E2E2E',color:'#CCCCCC'}"
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
    <el-dialog title="选择会员" :visible.sync="memberDialogVisible">
      <div style="padding-top: 0px">
        <el-table :data="memberData"
                  max-height="300"
                  :show-header="false">
          <el-table-column
              prop="id"
              label="会员号"
              width="200">
          </el-table-column>
          <el-table-column
              prop="name"
              label="姓名"
              width="200">
          </el-table-column>
          <el-table-column
              prop="phone"
              label="电话"
              width="100">
          </el-table-column>
          <el-table-column
              prop="point"
              label="积分"
              width="100">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </el-main>
  <el-footer>
    <div class="space-container">
      <div>
        <div class="space-container">
          <span style="color: #CCCCCC;">共计{{rowSize}}行{{commodityNum}}件商品</span>
          <span style="color: #CCCCCC;">姓名：{{member.name}}  积分：{{member.point}}</span>
        </div>
        <el-form :inline="true" style="padding: 0px;text-align: left;">
          <el-form-item style="margin: 0px;padding-left: 0px;">
            <el-input size="mini" placeholder="商品名称/条码" prefix-icon="el-icon-search"
                      @focus="isCommodityFocused = true; inputMode = 0" @blur="isCommodityFocused = false"
                      ref="keywordInput" v-model.trim="query.barcode">
            </el-input>
          </el-form-item>
          <el-form-item style="margin: 0px;padding-left: 0px">
            <el-input size="mini" placeholder="会员号/手机号" prefix-icon="el-icon-search"
                      @focus="isMemberFocused = true;inputMode = 1" @blur="isMemberFocused = false"
                      ref="memberInput" v-model.trim="query.phone"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button size="medium" >取 单</el-button>
        <el-button size="medium" >挂 单</el-button>
        <el-button size="medium" >删 除</el-button>
        <el-button size="medium" style="background-color: #F56C6C;color: white">收 款</el-button>
      </div>
    </div>
  </el-footer>
</el-container>
</template>
<script>
import {getCommoditiesByKeyword} from '@api/commodity'
import {getSupIdById} from '@api/user'
import {getMembers} from '@api/member'
import store from '../../../../store'
export default {
  data () {
    return {
      id: '',
      currentRow: -1,
      commodityDialogVisible: false,
      memberDialogVisible: false,
      isCommodityFocused: false,
      isMemberFocused: false,
      rowSize: 0,
      inputMode: 0,
      commodityNum: 0,
      member: {
        name: '',
        point: ''
      },
      query: {
        supId: '',
        barcode: '',
        phone: ''
      },
      tableHeight: window.innerHeight - 160,
      tableData: [], // 主页面表格数据
      commodityData: [], // 选中的商品数据
      dialogTableData: [], // dialog表格的商品数据
      memberData: [],
      placeholderData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    }
  },
  methods: {
    addCommodity (index) {
      this.commodityNum++
      for (let i = 0; i < this.commodityData.length; i++) {
        // 如果commodityData中已有此商品，数量加1,小计加上现价
        if (this.commodityData[i]['barcode'] === this.dialogTableData[index].barcode) {
          this.commodityData[i].num += 1
          this.commodityData[i].sum += this.commodityData[i].nowPrice
          this.query.barcode = ''
          return
        }
      }
      let commodity = {}
      commodity.barcode = this.dialogTableData[index].barcode
      commodity.name = this.dialogTableData[index].name
      commodity.price = this.dialogTableData[index].price
      commodity.nowPrice = this.dialogTableData[index].price
      commodity.num = 1
      commodity.sum = this.dialogTableData[index].price
      this.commodityData.push(commodity)
      this.rowSize++
      this.currentRow++
      this.tableData = this.commodityData.concat(this.placeholderData.slice(0, this.max(18 - this.rowSize, 0)))
      this.commodityDialogVisible = false
    },
    quit () {
      // 清空本地浏览器用户信息
      store.dispatch('user/clearUserInfo')
      this.$router.push({path: '/login'})
    },
    max (a, b) {
      return a >= b ? a : b
    },
    getMembers () {
      if (this.query.phone === '') return
      getMembers(this.query).then(res => {
        if (res.data.length === 1) {
          this.member.name = res.data[0].name
          this.member.point = res.data[0].point
        } else if (res.data.length > 1) {
          this.memberData = res.data
          this.memberDialogVisible = true
        }
        this.query.phone = ''
      })
    },
    getCommodities () {
      if (this.query.barcode === '') return
      getCommoditiesByKeyword(this.query).then(res => {
        if (res.status) {
          if (res.data.length === 1) { // 后端只查询到一个商品，直接对该商品进行操作
            this.commodityNum++
            for (let i = 0; i < this.commodityData.length; i++) {
              // 如果commodityData中已有此商品，数量加1,小计加上现价
              if (this.commodityData[i]['barcode'] === res.data[0].barcode) {
                this.commodityData[i].num += 1
                this.commodityData[i].sum += this.commodityData[i].nowPrice
                this.query.barcode = ''
                return
              }
            }
            // commodityData中没有此商品，插入到commodityData中
            let commodity = {}
            commodity.barcode = res.data[0].barcode
            commodity.name = res.data[0].name
            commodity.price = res.data[0].price
            commodity.nowPrice = res.data[0].price
            commodity.num = 1
            commodity.sum = res.data[0].price
            this.commodityData.push(commodity)
            this.rowSize++
            this.currentRow++
            this.tableData = this.commodityData.concat(this.placeholderData.slice(0, this.max(18 - this.rowSize, 0)))
          } else if (res.data.length > 1) { // 后端查询到多个商品，显示出对话框表格
            this.dialogTableData = res.data
            this.commodityDialogVisible = true
          }// 没有符合条件的商品则跳过
        } else {
          this.$message.warning(res.message)
        }
        this.query.barcode = ''
      })
    },
    tableRow ({row, rowIndex}) {
      if (rowIndex === this.currentRow) {
        return 'background: #3C658C; padding: 0px'
      } else { return 'background: #2B2D30; padding: 0px' }
    },
    dialogTableRow ({row, rowIndex}) {
      return 'background: #2E2E2E; padding: 0px;'
    },
    indexMethod (index) {
      if (index < this.rowSize) {
        return index + 1
      }
    },
    /* 页面按键功能定义如下：
  * F1, F2, F3对应header部分从左往右3个按钮
  * esc退出登录
  * shift用于切换输入框
  * ctrl+a删除商品
  * ctrl+m清空会员信息
  * ctrl+b取单
  * ctrl+c挂单
  * up/down光标栏上/下移
  * ctrl+up/ctrl+down光标商品数量加/减
  * ctrl+n聚焦到表格中的一行修改数量
  * */
    handlePressKey (e) {
      if (e.key === 'Enter') {
        if (this.inputMode === 0) { // 如果聚焦在商品输入框上
          this.getCommodities()
        } else {
          this.getMembers()
        }
      } else if (e.key === 'Shift') {
        if (this.isCommodityFocused || this.isMemberFocused) { // 如果两个输入框有一个聚焦，切换输入框
          this.inputMode = this.inputMode === 0 ? 1 : 0
        }
        this.setFocus()
      } else if (e.ctrlKey && e.key === 'm') {
        this.member.name = ''
        this.member.point = ''
      } else if (e.ctrlKey && e.key === 'a') {
        let n = this.tableData[this.currentRow]['num']
        this.commodityData.splice(this.currentRow, 1)
        this.tableData = this.commodityData.concat(this.placeholderData.slice(0, this.max(18 - this.rowSize, 0)))
        this.currentRow--
        this.rowSize--
        this.commodityNum -= n
      }
    },
    setFocus () { // 聚焦到一个输入框
      if (this.inputMode === 0) { // inputMode为0时聚焦到商品输入框
        this.$refs.keywordInput.focus()
      } else if (this.inputMode === 1) {
        this.$refs.memberInput.focus()
      }
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    this.tableData = this.placeholderData
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
    })
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

</style>
