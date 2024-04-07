<template>
<el-container style="background-color: #181818">
  <el-header style="background-color: #181818">
    <el-button icon="el-icon-plus" class="navi-button">新增会员</el-button>
    <el-button icon="el-icon-s-order" class="navi-button">销售单据</el-button>
    <el-button icon="el-icon-s-finance" class="navi-button">退货</el-button>
    <el-button icon="el-icon-switch-button" class="navi-button">退出登录</el-button>
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
          label="单价"
          width="200">
      </el-table-column>
      <el-table-column
          prop="num"
          label="数量"
          width="200">
      </el-table-column>
      <el-table-column
          prop="nowPrice"
          label="现价"
          width="200">
      </el-table-column>
      <el-table-column
          prop="sum"
          label="小计"
          width="218">
      </el-table-column>
    </el-table>
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
            <el-input size="mini" placeholder="商品名称/条码" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item style="margin: 0px;padding-left: 0px">
            <el-input size="mini" placeholder="会员号/手机号" prefix-icon="el-icon-search"></el-input>
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
export default {
  data () {
    return {
      rowSize: 0,
      commodityNum: 0,
      tableHeight: window.innerHeight - 160,
      tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      placeholderData: [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ]
    }
  },
  methods: {
    tableRow ({row, rowIndex}) {
      return 'background: #1F1F1F; padding: 0px'
    },
    indexMethod (index) {
      if (index < this.rowSize) {
        return index
      }
    }
  },
  mounted: function () {
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
