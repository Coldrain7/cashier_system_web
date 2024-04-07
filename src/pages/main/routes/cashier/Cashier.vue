<template>
<el-container style="background-color: #181818">
  <el-header style="background-color: #181818">
    <el-button icon="el-icon-plus" class="navi-button">新增会员</el-button>
    <el-button icon="el-icon-s-order" class="navi-button">销售单据</el-button>
    <el-button icon="el-icon-s-finance" class="navi-button">退货</el-button>
    <el-button icon="el-icon-switch-button" class="navi-button" @click="quit">退出登录</el-button>
  </el-header>
  <el-main>
    <el-table
        :data="tableData"
        :row-style="{height: 40 +'px',background:'#1F1F1F',color:'#CCCCCC'}"
        :cell-style="tableRow"
        :height="tableHeight"
        :border="true"
        :highlight-selection-row="false"
        :header-cell-style="{background:'#1F1F1F',color:'#CCCCCC'}"
        style="background-color: #1F1F1F">
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
          <el-input v-model="scope.row.nowPrice" @change="editBarcode(scope.$index)">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="sum"
          label="小计（元）"
          width="218">
      </el-table-column>
    </el-table>
    <el-dialog title="选择商品" :visible.sync="dialogTableVisible">
      <div style="padding-top: 0px">
        <el-table :data="commodityData"
                  max-height="300"
                  :show-header="false">
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
        </el-table>
      </div>
    </el-dialog>
  </el-main>
  <el-footer>
    <div class="space-container">
      <div>
        <div class="space-container">
          <span style="color: #CCCCCC;">共计{{rowSize}}行{{commodityNum}}件商品</span>
          <span style="color: #CCCCCC;">姓名：{{rowSize}} 积分：{{commodityNum}}</span>
        </div>
        <el-form :inline="true" style="padding: 0px;text-align: left;">
          <el-form-item style="margin: 0px;padding-left: 0px;">
            <el-input size="mini" placeholder="商品名称/条码" prefix-icon="el-icon-search"
                      ref="keywordInput" v-model.trim="query.barcode">
            </el-input>
          </el-form-item>
          <el-form-item style="margin: 0px;padding-left: 0px">
            <el-input size="mini" placeholder="会员号/手机号" prefix-icon="el-icon-search"
                      ref="memberInput"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button size="medium" >取 单</el-button>
        <el-button size="medium" >挂 单</el-button>
        <el-button size="medium" >删 除</el-button>
        <el-button size="medium" >收 款</el-button>
      </div>
    </div>
  </el-footer>
</el-container>
</template>
<script>
import {getCommoditiesByKeyword} from '@api/commodity'
import {getSupIdById} from '@api/user'
import store from '../../../../store'
export default {
  data () {
    return {
      id: '',
      dialogTableVisible: false,
      rowSize: 0,
      inputMode: 0,
      commodityNum: 0,
      query: {
        supId: '',
        barcode: ''
      },
      tableHeight: window.innerHeight - 160,
      tableData: [],
      commodityData: [],
      placeholderData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    }
  },
  methods: {
    quit () {
      // 清空本地浏览器用户信息
      store.dispatch('user/clearUserInfo')
      this.$router.push({path: '/login'})
    },
    getCommodities () {
      getCommoditiesByKeyword(this.query).then(res => {
        if (res.data.length === 1) { // 后端只查询到一个商品，直接对该商品进行操作
          for (let i = 0; i < this.commodityData.length; i++) {
            // 如果commodityData中已有此商品，数量加1,小计加上现价
            if (this.commodityData[i]['barcode'] === res.data[0].barcode) {
              this.commodityData[i].num += 1
              this.commodityData[i].sum += this.commodityData[i].nowPrice
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
          this.commodityData.push(commodity)
        } else { // 后端查询到多个商品，显示出对话框表格
          this.dialogTableVisible = true
        }
      })
    },
    tableRow ({row, rowIndex}) {
      return 'background: #1F1F1F; padding: 0px'
    },
    indexMethod (index) {
      if (index < this.rowSize) {
        return index
      }
    },
    handlePressKey (e) {
      console.info('handlePressKey')
      if (e.key === 'Enter') {
        console.info('enter')
      } else if (e.key === 'Shift') {
        console.info('shift')
        this.setFocus()
        this.inputMode = this.inputMode === 0 ? 1 : 0
      }
    },
    setFocus () {
      if (this.inputMode === 0) {
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
  background-color: #181818;
  color: #CCCCCC;
  border: #181818;
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
    background-color: #2E2E2E ;
    color: #CCCCCC
}
::v-deep  .el-table .el-table__body tr.hover-row > td{
  background-color:#2E2E2E!important
}
::v-deep  .el-table--enable-row-hover .el-table__body tr:hover > td{
  background-color:#2E2E2E!important
}
</style>
