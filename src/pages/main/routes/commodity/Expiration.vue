<template>
  <div>
      <div>
          <el-form :inline="true" :model="query" :rules="rules" ref="query" style="padding: 0px;text-align: right;">
              <el-form-item  style="margin: 0px;padding-left: 10px">
                  <template>
                      <el-select size="mini" v-model="query.claId" filterable placeholder="选择分类">
                          <el-option
                              v-for="item in classificationOptions"
                              :key="item.id"
                              :label="item.classification"
                              :value="item.id">
                          </el-option>
                      </el-select>
                  </template>
              </el-form-item>
              <el-form-item  style="margin: 0px;padding-left: 10px">
                  <template>
                      <el-select size="mini" v-model="query.supplierId" filterable placeholder="选择供应商">
                          <el-option
                              v-for="item in supplierOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                          </el-option>
                      </el-select>
                  </template>
              </el-form-item>
              <el-form-item  style="margin: 0px;padding-left: 10px">
                  <template>
                      <el-select @change="handleSelectChange" size="mini" v-model="query.funcId">
                          <el-option
                              v-for="item in functionOptions"
                              :key="item.id"
                              :label="item.func"
                              :value="item.id">
                          </el-option>
                      </el-select>
                  </template>
              </el-form-item>
              <el-form-item style="margin: 0px;padding-left: 10px" prop="num">
                  <el-input size="mini" v-model="query.num" placeholder="设置数量/天数"></el-input>
              </el-form-item>
              <el-form-item style="margin: 0px;">
                  <el-button type="primary" icon="el-icon-search" @click="getCommodities" size="mini">查询</el-button>
              </el-form-item>
          </el-form>
      </div>
      <div v-show="query.funcId !== 2" style="padding-top: 20px">
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
                  width="50">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="商品名称"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="barcode"
                  label="条码"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="classification.classification"
                  label="分类"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="inventory"
                  label="库存"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="supplier.name"
                  label="供货商"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="produceDate"
                  :formatter="formatDate"
                  label="生产日期"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="expirationTime"
                  label="保质期"
                  :formatter="formatExpiration"
                  width="180">
              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                      <el-button @click="editRow(scope.$index)" type="text" size="small">修改库存</el-button>
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
          <el-dialog
              :title="form.name"
              :close-on-click-modal="false"
              :visible.sync="editDialog">
              <el-input v-model="form.inventory" placeholder="修改库存"></el-input>
              <div style="padding-top: 20px">
                  <div class="bottom-container">
                      <el-button @click="editDialog = false">取 消</el-button>
                      <el-button style="background-color: #67C23A;color: white" @click="saveInventory">保 存</el-button>
                  </div>
              </div>
          </el-dialog>
      </div>
      <el-timeline v-show="query.funcId === 2" :reverse="false" style="padding-top: 20px">
          <el-timeline-item
              v-for="(data, index) in tableData"
              :key="index"
              :type="data.type"
              :icon="data.icon"
              :color="data.color"
              size="large"
              :timestamp="data.timestamp">
              <el-card>
                  <h4>
                      <span style="margin-right: 20px;">{{data.name}}</span>
                      <span style="margin-right: 20px;">条码：{{data.barcode}}</span>
                      <el-button type="text" size="medium" @click="editRow(index)">修改日期信息</el-button>
                  </h4>
                      <span style="margin-right: 20px;">距离过期还剩：{{ data.gapDays }}天</span>
                      <span style="margin-right: 20px;">生产日期：{{data.produceDate}}</span>
                      <span style="margin-right: 20px;">保质期{{data.expirationTime}}</span>
                      <span style="margin-right: 20px;">分类：{{data.classification.classification}}</span>
                      <span style="margin-right: 20px;">供应商：{{data.supplier.name}}</span>
              </el-card>
          </el-timeline-item>
      </el-timeline>
      <el-dialog
          :title="form.name"
          :close-on-click-modal="false"
          :visible.sync="timeLineDialog">
          <div style="padding-top: 20px">
              <div class="bottom-container">
                  <el-date-picker
                      v-model="timeInfo.produceDate"
                      type="date"
                      value-format="yyyy-MM-dd'T'HH:mm:ss"
                      placeholder="选择生产日期">
                  </el-date-picker>
                  <el-input v-model.trim="timeInfo.expirationTime" placeholder="请填整数数字">
                      <template slot="prepend">保质期</template><template slot="append">天</template>
                  </el-input>
              </div>
              <div style="padding-top: 10px">
                  <div class="bottom-container">
                      <el-button @click="timeLineDialog = false">取 消</el-button>
                      <el-button style="background-color: #67C23A;color: white" @click="saveDate">保 存</el-button>
                  </div>
              </div>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import {getSupIdById} from '@api/user'
import {getClaOptions} from '@api/classification'
import {getSupplierOptions} from '@api/supplier'
import {searchWarning, updateCommodity} from '@api/commodity'
import store from '../../../../store'
export default {
  name: 'Expiration',
  data () {
    var validateNumber = (rule, value, callback) => {
      if (!/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      tableData: [],
      total: 0,
      editDialog: false,
      timeLineDialog: false,
      tableHeight: window.innerHeight - 150,
      classificationOptions: [{id: 0, classification: '全部分类'}],
      supplierOptions: [{id: 0, name: '全部供应商'}],
      functionOptions: [{id: 0, func: '库存不足'}, {id: 1, func: '库存过剩'}, {id: 2, func: '过期预警'}],
      query: {
        supId: '',
        claId: '',
        supplierId: '',
        funcId: 0,
        pageNo: 1,
        pageSize: 20,
        num: ''
      },
      timeInfo: {
        id: '',
        produceDate: '',
        expirationTime: ''
      },
      form: {
        id: '',
        name: '',
        supId: '',
        barcode: '',
        claId: '',
        inventory: '',
        supplierId: '',
        produceDate: '',
        expirationTime: ''
      },
      rules: {
        num: [{ required: true, message: '请填写达到预警的数量或天数', trigger: 'blur' },
          {validator: validateNumber, message: '请输入数字，可输入小数', trigger: 'blur'}]
      }
    }
  },
  methods: {
    saveDate () {
      if (/\d+/.test(this.timeInfo.expirationTime)) {
        updateCommodity(this.timeInfo).then(res => {
          this.timeInfo.id = this.form.id
          if (res.data) {
            this.$message.success('保存成功')
            this.getCommodities()
            this.timeLineDialog = false
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.error('请输入数字')
      }
    },
    handleSelectChange () {
      this.tableData = []
    },
    saveInventory () {
      const regex = /^\d+(\.\d+)?$/ // 允许以小数点开头，但后面必须有数字
      if (regex.test(this.form.inventory)) {
        updateCommodity(this.form).then(res => {
          if (res.data) {
            this.$message.success('修改成功')
            this.getCommodities()
            this.editDialog = false
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.error('请输入数字')
      }
    },
    editRow (rowIndex) {
      // console.info(this.tableData[rowIndex])
      for (const key in this.form) {
        // 如果 data 对象中存在与 form 对象相同的属性
        if (this.tableData[rowIndex].hasOwnProperty(key)) {
          // 将 data 对象的属性值赋给 form 对象的相应属性
          this.form[key] = this.tableData[rowIndex][key]
        }
      }
      if (this.query.funcId !== 2) {
        this.editDialog = true
      } else {
        this.timeLineDialog = true
      }
    },
    computeDays () {
      for (let item of this.tableData) {
        let expireDate = new Date(item.produceDate)
        expireDate.setDate(expireDate.getDate() + item.expirationTime)
        let nowDate = new Date()
        if (expireDate > nowDate) {
          // 计算两个日期之间的毫秒差
          const diffInMilliseconds = expireDate - nowDate
          // 将毫秒转换为天
          item.gapDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))
          item.color = '#FE9900'
        } else {
          const diffInMilliseconds = nowDate - expireDate
          // 将毫秒转换为天
          item.gapDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))
          item.gapDays = -item.gapDays
          item.color = '#D90707'
        }
        item.type = 'primary'
      }
      this.tableData.sort(function (a, b) {
        return a.gapDays - b.gapDays // 升序排序
      })
    },
    getCommodities () {
      this.$refs.query.validate((valid) => {
        if (valid) {
          searchWarning(this.query).then(res => {
            this.tableData = res.data.records
            this.total = res.data.total
            if (this.query.funcId === 2) {
              this.computeDays()
              for (let item of this.tableData) {
                item.expirationTime = this.formatExpiration(item)
                item.produceDate = this.formatDate(item)
              }
            }
          })
        }
      })
    },
    handleSizeChange (value) {
      this.query.pageSize = value
      this.getCommodities()
    },
    handleCurrentChange (value) {
      this.query.pageNo = value
      this.getCommodities()
    },
    indexMethod (index) {
      return (this.query.pageNo - 1) * this.query.pageSize + index + 1
    },
    formatExpiration (row) {
      if (row.expirationTime !== null) {
        return row.expirationTime.toString() + '天'
      }
    },
    formatDate (row) {
      if (row.produceDate !== null) {
        const date = new Date(row.produceDate)
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      }
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      return getClaOptions({supId: this.query.supId})
    }).then(res => {
      this.classificationOptions = this.classificationOptions.concat(res.data)
      return getSupplierOptions({supId: this.query.supId})
    }).then(res => {
      this.supplierOptions = this.supplierOptions.concat(res.data)
    })
  },
  mounted: function () {
    // window.onresize:浏览器尺寸变化响应事件
    window.onresize = () => {
      return (() => {
        // window.innerHeight:浏览器的可用高度
        this.tableHeight = window.innerHeight - 150
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
