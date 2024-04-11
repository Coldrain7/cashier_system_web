<template>
<el-container style="background-color: #1F1F1F">
  <el-header style="background-color: #1F1F1F">
    <el-button icon="el-icon-plus" class="navi-button" @click="addMemberVisible = true">新增会员</el-button>
    <el-button icon="el-icon-s-order" class="navi-button" @click="toRecords">销售单据</el-button>
    <el-button v-show="!isRefund" icon="el-icon-s-finance" class="navi-button" @click="isRefund=true">退货</el-button>
    <el-button v-show="isRefund" icon="el-icon-shopping-cart-1" class="navi-button" @click="isRefund=false">收款</el-button>
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
        <template slot-scope="scope">
          <el-input type="number" @focus="handleNumFocus(scope.$index)" @blur="handleNumBlur(scope.$index)"
                    :ref="'numInputRef'+scope.$index" @keydown.native.up.prevent
                    @keydown.native.down.prevent v-model="scope.row.num">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="nowPrice"
          label="现价（元）"
          width="200">
        <template slot-scope="scope">
          <el-input type="number" @focus="handlePriceFocus(scope.$index)" @blur="handlePriceBlur(scope.$index)"
                    :ref="'priceInputRef'+scope.$index" @keydown.native.up.prevent
                    @keydown.native.down.prevent v-model="scope.row.nowPrice">
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
    <el-dialog title="选择会员" class="dialog-table" width="40%" :modal="false" :visible.sync="memberDialogVisible">
      <div style="padding-top: 0px">
        <el-table :data="memberData"
                  :row-style="{height: 40 +'px',background:'#2E2E2E',color:'#CCCCCC'}"
                  :cell-style="dialogTableRow"
                  :header-cell-style="{background:'#2E2E2E',color:'#CCCCCC'}"
                  max-height="300">
          <el-table-column
              prop="id"
              label="会员号"
              width="100">
          </el-table-column>
          <el-table-column
              prop="name"
              label="姓名"
              width="150">
          </el-table-column>
          <el-table-column
              prop="phone"
              label="电话"
              width="150">
          </el-table-column>
          <el-table-column
              prop="point"
              label="积分"
              width="100">
          </el-table-column>
          <el-table-column
              label="操作"
              width="124">
            <template slot-scope="scope">
              <el-button @click="addMember(scope.$index)" type="text" size="small">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog class="dialog-table" width="40%" :visible.sync="cashDialogVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item style="margin: 0px;" label="金 额（元）：">
          <el-input style="width: 500px" :disabled="true" v-model="form.totalPrice"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px;" label="实 收（元）：" prop="realPayment">
          <el-input style="width: 500px" v-model="form.realPayment"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button-group>
            <el-button :style="{ backgroundColor: cashButtonColor,color:'white' }"
                       @click="sellCommodities(0)">现金支付</el-button>
            <el-button :style="{ backgroundColor: mobileButtonColor,color:'white' }"
                       @click="sellCommodities(1)">移动支付</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog class="dialog-table" width="30%" :visible.sync="refundDialogVisible">
      <el-form>
        <el-form-item style="margin-left: 20px">
          <span style="color: #CCCCCC;font-size: 20px">会员姓名：{{member.name}}</span>
        </el-form-item>
        <el-form-item style="margin-left: 20px">
          <span style="color: #CCCCCC;font-size: 20px">退款金额：{{form.totalPrice}} 元</span>
        </el-form-item>
        <el-form-item >
          <div class="space-container">
            <el-button type="info" style="width: 100px;margin-top: 20px;margin-left: 50px"
                       @click="refundDialogVisible=false">取 消</el-button>
            <el-button type="success" style="width: 100px;margin-top: 20px;margin-right: 50px" @click="refundCommodities">退 款</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="新增会员" class="dialog-table" width="40%" :visible.sync="addMemberVisible">
      <el-form :model="memberForm" :rules="memberRules" ref="memberForm">
          <el-form-item prop="name" label="姓名：">
            <el-input v-model="memberForm.name" style="width: 500px">
            </el-input>
          </el-form-item>
          <el-form-item prop="phone" label="电话：">
            <el-input v-model="memberForm.phone" style="width: 500px">
            </el-input>
          </el-form-item>
          <el-form-item prop="point" label=" 积分：" style="padding-left: 10px">
            <el-input v-model="memberForm.point" style="width: 500px">
            </el-input>
          </el-form-item>
        <div class="space-container">
          <el-button style="margin-left: 65px;width: 100px" @click="addMemberVisible = false">取消</el-button>
          <el-button style="margin-right: 60px;width: 100px" type="primary" @click="saveMember">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="选择挂单" class="dialog-table" width="40%" :visible.sync="pendedRecordVisible">
      <el-table
          :data="pendedRecordData"
          :row-style="{height: 40 +'px',background:'#2B2D30',color:'#CCCCCC'}"
          :cell-style="tableRow"
          :header-cell-style="{background:'#2B2D30',color:'#CCCCCC'}"
          :highlight-selection-row="false"
          style="background-color: #2B2D30">
        <el-table-column
            type="index"
            label="序号"
            width="50">
        </el-table-column>
        <el-table-column
            prop="payment"
            label="金额（元）"
            width="135">
        </el-table-column>
        <el-table-column
            prop="number"
            label="商品件数"
            width="135">
        </el-table-column>
        <el-table-column
            prop="createTime"
            :formatter="formatTime"
            label="时间"
            width="200">
        </el-table-column>
        <el-table-column
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" >取单</el-button>
            <el-button type="text" size="small" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        <el-button v-show="!isRefund" type="primary" size="medium" @click="clickGetPendedButton">取 单</el-button>
        <el-button v-show="!isRefund" type="primary" size="medium" @click="pendOrder">挂 单</el-button>
        <el-button size="medium" type="primary" @click="deleteRow">删 除</el-button>
        <el-button v-show="!isRefund" size="medium" style="background-color: #F56C6C;color: white" @click="clickPayButton">收款: {{form.totalPrice}} 元</el-button>
        <el-button v-show="isRefund" size="medium" type="success" @click="clickRefundButton">退款: {{form.totalPrice}} 元</el-button>
      </div>
    </div>
  </el-footer>
</el-container>
</template>
<script>
import {getCommoditiesByKeyword} from '@api/commodity'
import {getSupIdById} from '@api/user'
import {getMembers, updateMember, createMember} from '@api/member'
import {createRecords, getPendedRecords} from '@api/record'
import store from '../../../../store'
export default {
  data () {
    var validatePhoneNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'))
      } else if (!/^\d{11}$/.test(value)) {
        callback(new Error('请输入正确电话号码'))
      } else {
        callback()
      }
    }
    var validateDouble = (rule, value, callback) => {
      // this.$message.success(/^\d+(\.\d+)?$/.test(value))
      if (value !== '' && !/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error('请输入正确的金额'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      currentRow: -1, // 光标指向的一行
      commodityDialogVisible: false,
      memberDialogVisible: false,
      cashDialogVisible: false,
      isCommodityFocused: false,
      isMemberFocused: false,
      closeCashDialog: false, // 用于收款后判断能不能按下空格关闭收款对话框
      addMemberVisible: false,
      isRefund: false, // 是否为退款模式
      refundDialogVisible: false,
      pendedRecordVisible: false,
      rowSize: 0, // 商品行数
      inputMode: 0,
      commodityNum: 0, // 商品件数
      cashButtonColor: '#F56C6C',
      mobileButtonColor: '#37373D',
      record: {
        method: 0, // 支付方式
        type: 0// 类型，比如是否是挂单
      },
      member: {
        id: '',
        name: '',
        point: '',
        phone: ''
      },
      query: {
        supId: '',
        barcode: '',
        phone: ''
      },
      form: {
        totalPrice: 0, // 总金额
        realPayment: 0 // 实收金额
      },
      memberForm: {
        id: '',
        phone: '',
        name: '',
        point: '',
        supId: '',
        createTime: ''
      },
      lastNum: 0, // 用于记录商品数量更改前的有效值
      lastPrice: 0, // 用于记录商品上一个现价的有效值
      tableHeight: window.innerHeight - 160,
      tableData: [], // 主页面表格数据
      commodityData: [], // 选中的商品数据
      dialogTableData: [], // dialog表格的商品数据
      memberData: [],
      pendedRecordData: [],
      placeholderData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      rules: {
        realPayment: [{validator: validateDouble, message: '请输入实收金额', trigger: 'blur'}]
      },
      memberRules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' },
          {validator: validatePhoneNumber, message: '请输入正确电话号码', trigger: 'blur'}],
        point: [{validator: validateDouble, message: '请输入正确的积分', trigger: 'blur'}]
      }
    }
  },
  methods: {
    clickGetPendedButton () {
      this.pendedRecordVisible = true
      this.getPendedRecords()
    },
    formatTime (row) {
      const date = new Date(row.createTime)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    getPendedRecords () {
      getPendedRecords(this.query).then(res => {
        this.pendedRecordData = res.data
      })
    },
    toRecords () {
      this.$router.push({path: '/records'})
    },
    saveMember () {
      this.$refs.memberForm.validate((valid) => {
        if (valid) {
          this.memberForm.supId = this.query.supId
          createMember(this.memberForm).then(res => {
            if (res.status) {
              this.$message.success(res.message)
              this.addMemberVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    pendOrder () { // 挂单
      if (this.form.totalPrice > 0) {
        let query = {}
        query.data = this.tableData
        query.method = 0
        query.type = 2
        query.workerId = this.id
        query.rowSize = this.rowSize
        createRecords(query).then(res => {
          if (res.data) {
            this.closeCashDialog = true
          } else {
            this.$message.error('挂单失败')
          }
        })
        this.resetData()
      }
    },
    refundCommodities () {
      let query = {}
      query.data = this.tableData
      query.method = 0
      query.type = 1
      query.workerId = this.id
      query.memId = this.member.id
      query.rowSize = this.rowSize
      createRecords(query).then(res => {
        if (res.data) {
          this.closeCashDialog = true
        } else {
          this.$message.error('退款失败')
        }
      })
      if (this.member.id !== '') {
        this.member.point -= this.form.totalPrice
        let member = this.member
        member.supId = this.query.supId
        updateMember(member).then(res => {
          if (!res.status) {
            this.$message.error(res.message)
          }
        })
      }
    },
    sellCommodities (m) {
      // this.$message.success(/^\d+(\.\d+)?$/.test(this.realPayment))
      this.$refs.form.validate((valid) => {
        if (valid) { // 实收金额检验成功
          let query = {}
          // 把最后的实收金额与应付金额差值放在第一个商品的payment中
          this.tableData[0]['sum'] -= this.form.totalPrice - this.form.realPayment
          query.data = this.tableData
          query.method = m
          query.type = 0
          query.workerId = this.id
          query.memId = this.member.id
          query.rowSize = this.rowSize
          createRecords(query).then(res => {
            if (res.data) {
              this.closeCashDialog = true
            } else {
              this.$message.error('收银失败')
            }
          })
          if (this.member.id !== '') {
            this.member.point += this.form.realPayment
            let member = this.member
            member.supId = this.query.supId
            updateMember(member).then(res => {
              if (!res.status) {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    clickRefundButton () {
      if (this.form.totalPrice > 0) {
        this.refundDialogVisible = true
      }
    },
    clickPayButton () {
      if (this.form.totalPrice > 0) {
        this.form.realPayment = this.form.totalPrice
        this.cashDialogVisible = true
      }
    },
    // 表格中的价钱输入框
    handlePriceFocus (index) {
      this.lastPrice = this.tableData[index]['nowPrice']
    },
    handlePriceBlur (index) {
      if (this.tableData[index]['nowPrice'] <= 0 || this.lastPrice === undefined) { // 如果输入的现价小于0，改回原来的有效值
        this.tableData[index]['nowPrice'] = this.lastPrice
      } else { // 否则数量修改为新值，并重新计算小计与总价
        this.form.totalPrice -= this.tableData[index]['sum']
        this.tableData[index]['sum'] = this.tableData[index]['num'] * this.tableData[index]['nowPrice']
        // 同时还要修改commodityData中的数据
        this.commodityData[index]['nowPrice'] = this.tableData[index]['nowPrice']
        this.commodityData[index]['sum'] = this.tableData[index]['sum']
        this.form.totalPrice += this.tableData[index]['sum']
      }
    },
    // 表格中的数量输入框
    handleNumFocus (index) {
      this.lastNum = this.tableData[index]['num']
    },
    handleNumBlur (index) {
      if (this.tableData[index]['num'] <= 0 || this.lastNum === undefined) { // 如果输入的数量小于0，改回原来的有效值
        this.tableData[index]['num'] = this.lastNum
      } else { // 否则数量修改为新值，并重新计算小计与总价
        this.form.totalPrice -= this.tableData[index]['sum']
        this.tableData[index]['sum'] = this.tableData[index]['num'] * this.tableData[index]['nowPrice']
        // 同时还要修改commodityData中的数据
        this.commodityData[index]['num'] = this.tableData[index]['num']
        this.commodityData[index]['sum'] = this.tableData[index]['sum']
        this.form.totalPrice += this.tableData[index]['sum']
      }
    },
    addMember (index) {
      this.member.id = this.memberData[index]['id']
      this.member.name = this.memberData[index]['name']
      this.member.point = this.memberData[index]['point']
      this.member.phone = this.memberData[index]['phone']
      this.memberDialogVisible = false
    },
    addCommodity (index) {
      this.commodityNum++
      for (let i = 0; i < this.commodityData.length; i++) {
        // 如果commodityData中已有此商品，数量加1,小计加上现价
        if (this.commodityData[i]['barcode'] === this.dialogTableData[index].barcode) {
          this.commodityData[i].num += 1
          this.commodityData[i].sum += this.commodityData[i].nowPrice
          this.form.totalPrice += this.commodityData[i].nowPrice
          this.query.barcode = ''
          return
        }
      }
      // 如果commodityData中没有此商品
      let commodity = {}
      commodity.id = this.dialogTableData[index].id
      commodity.barcode = this.dialogTableData[index].barcode
      commodity.name = this.dialogTableData[index].name
      commodity.price = this.dialogTableData[index].price
      commodity.nowPrice = this.dialogTableData[index].price
      commodity.num = 1
      commodity.sum = this.dialogTableData[index].price
      this.form.totalPrice += commodity.price
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
          this.member.id = res.data[0].id
          this.member.name = res.data[0].name
          this.member.point = res.data[0].point
          this.member.phone = res.data[0].phone
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
                this.form.totalPrice += this.commodityData[i].nowPrice
                this.query.barcode = ''
                return
              }
            }
            // commodityData中没有此商品，插入到commodityData中
            let commodity = {}
            commodity.id = res.data[0].id
            commodity.barcode = res.data[0].barcode
            commodity.name = res.data[0].name
            commodity.price = res.data[0].price
            commodity.nowPrice = res.data[0].price
            commodity.num = 1
            commodity.sum = res.data[0].price
            this.form.totalPrice += commodity.price
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
    deleteRow () {
      if (this.currentRow >= 0) {
        let n = this.tableData[this.currentRow]['num']
        this.form.totalPrice -= this.tableData[this.currentRow]['sum']
        this.commodityData.splice(this.currentRow, 1)
        this.tableData = this.commodityData.concat(this.placeholderData.slice(0, this.max(18 - this.rowSize, 0)))
        this.currentRow--
        this.rowSize--
        this.commodityNum -= n
      }
    },
    resetData () {
      this.tableData = this.placeholderData
      this.commodityData = []
      this.rowSize = 0
      this.currentRow = -1
      this.commodityNum = 0
      this.member.id = ''
      this.member.name = ''
      this.member.point = ''
      this.member.phone = ''
      this.closeCashDialog = false
      this.record.method = 0
      this.form.totalPrice = 0
    },
    /* 页面按键功能定义如下：
  * ctrl+F1/F2/F3对应header部分从左往右3个按钮
  * esc退出登录
  * shift用于切换输入框和收款方式
  * ctrl+i删除商品
  * ctrl+m清空会员信息
  * ctrl+b取单
  * ctrl+c挂单
  * up/down光标栏上/下移
  * ctrl+up/ctrl+down光标商品数量加/减
  * ctrl+n聚焦到表格中的一行修改数量
  * */
    handlePressKey (e) {
      if (e.key === 'Enter') {
        if (this.addMemberVisible) { // 如果在新增会员界面
          this.saveMember()
          return
        }
        if (this.inputMode === 0) { // 如果聚焦在商品输入框上
          this.getCommodities()
        } else {
          this.getMembers()
        }
      } else if (e.key === 'Shift') {
        if (this.cashDialogVisible) { // 如果打开了收银对话框，切换收银方式
          let color = this.cashButtonColor
          this.cashButtonColor = this.mobileButtonColor
          this.mobileButtonColor = color
          this.record.method = this.record.method === 0 ? 1 : 0
        } else {
          if (this.isCommodityFocused || this.isMemberFocused) { // 如果两个输入框有一个聚焦，切换输入框
            this.inputMode = this.inputMode === 0 ? 1 : 0
          }
          this.setFocus()
        }
      } else if (e.ctrlKey && e.key === 'F1') {
        this.addMemberVisible = true
      } else if (e.ctrlKey && e.key === 'F2') {
        this.toRecords()
      } else if (e.ctrlKey && e.key === 'F3') {
        this.isRefund = !this.isRefund
      } else if (e.ctrlKey && e.key === 'm') {
        this.member.name = ''
        this.member.point = ''
      } else if (e.ctrlKey && e.key === 'i') {
        this.deleteRow()
      } else if (e.ctrlKey && e.key === 'c') {
        this.pendOrder()
      } else if (e.ctrlKey && e.key === 'ArrowUp') {
        if (this.currentRow >= 0) {
          this.$refs['numInputRef' + this.currentRow].focus()
          this.tableData[this.currentRow]['num']++
          this.commodityData[this.currentRow]['num'] = this.tableData[this.currentRow]['num']
        }
      } else if (e.ctrlKey && e.key === 'ArrowDown') {
        if (this.currentRow >= 0) {
          this.$refs['numInputRef' + this.currentRow].focus()
          let n = this.tableData[this.currentRow]['num']
          this.tableData[this.currentRow]['num'] = n - 1 > 0 ? n - 1 : n
          this.commodityData[this.currentRow]['num'] = this.tableData[this.currentRow]['num']
        }
      } else if (e.key === 'ArrowUp') {
        if (this.currentRow >= 0) {
          this.$refs['numInputRef' + this.currentRow].blur()
          this.$refs['priceInputRef' + this.currentRow].blur()
          this.currentRow = this.max(0, this.currentRow - 1)
        }
      } else if (e.key === 'ArrowDown') {
        if (this.currentRow >= 0) {
          this.$refs['numInputRef' + this.currentRow].blur()
          this.$refs['priceInputRef' + this.currentRow].blur()
          this.currentRow = this.currentRow + 1 < this.rowSize ? this.currentRow + 1 : this.currentRow
        }
      } else if (e.key === ' ') {
        if (this.isRefund) { // 如果是退款模式
          if (this.refundDialogVisible) { // 如果打开了退款对话框
            if (this.closeCashDialog) {
              this.resetData()
              this.refundDialogVisible = false
            } else {
              this.refundCommodities()
            }
          } else {
            this.clickRefundButton()
          }
        } else { // 收款模式
          if (this.cashDialogVisible) { // 打开了收款对话框
            if (this.closeCashDialog) { // 如果已经能够关掉对话框
              this.resetData()
              this.cashDialogVisible = false
            } else {
              this.sellCommodities(this.record.method)
            }
          } else { // 没打开收银对话框
            this.clickPayButton()
          }
        }
      }
    },
    /**
     * 聚焦到一个输入框
     */
    setFocus () {
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
/deep/ .el-form-item__label {
  color: #CCCCCC; /* 设置你想要的颜色 */
}
</style>
