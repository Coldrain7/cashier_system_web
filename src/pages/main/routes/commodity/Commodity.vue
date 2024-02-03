<template>
    <div>
        <div style="background-color: white">
                <el-form :inline="true" style="padding: 0px;text-align: right;">
                    <el-form-item style="margin: 0px;padding-left: 10px">
                        <el-input size="mini" v-model="query.name" placeholder="商品名称/条码"></el-input>
                    </el-form-item>
                    <el-form-item  style="margin: 0px;padding-left: 10px">
                        <template>
                            <el-select size="mini" v-model="query.claId" placeholder="选择分类">
                                <el-option
                                    v-for="item in classificationOptions"
                                    :key="item.id"
                                    :label="item.classification"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item style="margin: 0px;">
                        <el-button type="primary" icon="el-icon-search" @click="searchCommodities" size="mini">搜索</el-button>
                    </el-form-item>
                    <el-form-item style="margin: 0px;">
                        <el-button type="primary" icon="el-icon-plus" @click="addCommodity" size="mini">新增</el-button>
                    </el-form-item>
                    <el-form-item style="margin: 0px;">
                        <el-button type="primary" icon="el-icon-upload2" @click="getEvents()" size="mini">导入</el-button>
                    </el-form-item>
                    <el-form-item style="margin: 0px;padding-right: 20px">
                        <el-button type="primary" icon="el-icon-download" @click="getEvents()" size="mini">导出</el-button>
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
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="商品名称"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="barcode"
                    label="条码"
                    sortable
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
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="unit.unit"
                    label="单位"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="purchasePrice"
                    label="进货价"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="销售价"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="wholesalePrice"
                    label="批发价"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="isDiscount"
                    :formatter="formatDiscount"
                    label="会员折扣"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="supplier.name"
                    label="供货商"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="produceDate"
                    :formatter="formatDate"
                    label="生产日期"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="expirationTime"
                    label="保质期"
                    :formatter="formatExpiration"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    :formatter="formatTime"
                    sortable
                    width="180">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="editRow(scope.$index)" type="text" size="small">编辑</el-button>
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

            <el-drawer :visible.sync="drawer" size="610px" :with-header="false">
                <el-form :model="form" :rules="rules" ref="form" label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
                    <div  style="width: 600px;">
                        <el-form-item prop="name">
                            <el-input v-model="form.name" >
                                <template slot="prepend"><a style="color: red">* </a>商品名称</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div  style="width: 600px;">
                        <el-form-item prop="barcode">
                            <el-input v-model="form.barcode">
                                <template slot="prepend"><a style="color: red">* </a>商品条码</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="flex-container">
                        <div  style="width: 200px;">
                            <el-form-item prop="purchasePrice">
                                <el-input v-model="form.purchasePrice">
                                    <template slot="prepend"><a style="color: red">* </a>进价</template>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div  style="width: 200px;">
                            <el-form-item prop="price">
                                <el-input v-model="form.price">
                                    <template slot="prepend"><a style="color: red">* </a>售价</template>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div  style="width: 200px;">
                            <el-form-item prop="inventory">
                                <el-input v-model="form.inventory">
                                    <template slot="prepend">库存</template>
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="flex-container">
                        <el-form-item label="会员折扣" label-width="80px" style="padding-left: 20px;width: 100px">
                            <el-switch v-model="form.isDiscount">
                            </el-switch>
                        </el-form-item>
                        <el-form-item style="padding-left: 50px;width: 250px">
                            <el-input v-model="form.wholesalePrice"><template slot="prepend">批发价</template></el-input>
                        </el-form-item>
                        <el-form-item style="width: 300px;padding-right: 5px">
                            <el-input v-model="form.specification"><template slot="prepend">商品规格</template></el-input>
                        </el-form-item>
                    </div>
                    <div class="flex-container">
                        <el-form-item label="商品分类" label-width="80px">
                            <template>
                                <el-select v-model="form.claId" placeholder="选择分类" style="width: 220px">
                                    <el-option
                                        v-for="item in classificationSelection"
                                        :key="item.id"
                                        :label="item.classification"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item label="单位" label-width="40px" style="padding-left: 20px;">
                            <template>
                                <el-select v-model="form.unitId" placeholder="选择单位" style="width: 240px;">
                                    <el-option
                                        v-for="item in unitOptions"
                                        :key="item.id"
                                        :label="item.unit"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </div>
                    <el-form-item label="供货商" label-width="60px">
                        <template>
                            <el-select v-model="form.supplierId" style="width: 540px" placeholder="选择供货商">
                                <el-option
                                    v-for="item in supplierOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                    <div class="flex-container">
                        <div>
                            <label class="el-form-item__label">生产日期</label>
                            <el-date-picker
                                v-model="form.produceDate"
                                type="date"
                                value-format="yyyy-MM-dd'T'HH:mm:ss"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <el-form-item style="width: 312px;padding-right: 5px">
                            <el-input v-model="form.expirationTime"><template slot="prepend">保质期</template><template slot="append">天</template></el-input>
                        </el-form-item>
                    </div>
                        <div v-show="!isVisible" style="position:absolute;bottom:5px;left: 10px;display: none">
                            <el-button type="danger" style="background-color: #F56C6C" @click="deleteCommodity">删除</el-button>
                        </div>
                        <div v-show="!isVisible" style="position:absolute;bottom:5px;right: 10px;display: none">
                            <el-button type="primary" @click="saveChange">保存</el-button>
                        </div>
                    <div v-show="isVisible" ref="addButton" style="position:absolute;bottom:5px;right: 10px;display: none">
                        <el-button type="primary" @click="saveCommodity">新增</el-button>
                    </div>
                </el-form>
            </el-drawer>
        </div>
    </div>

</template>

<script>
import { commodityPage, updateCommodity, deleteCommodityById, addCommodity, getCommodityById } from '@api/commodity'
import {getSupIdById} from '@api/user'
import {getClaOptions} from '@api/classification'
import {getSupplierOptions} from '@api/supplier'
import {getUnitOptions} from '@api/unit'
import store from '../../../../store'
export default {
  name: 'Second',
  data () {
    var validateNumber = (rule, value, callback) => {
      if (!/\d+/.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      isVisible: true,
      index: 1,
      tableData: [],
      classificationOptions: [{id: 0, classification: '全部分类'}],
      classificationSelection: [],
      unitOptions: [],
      supplierOptions: [],
      tableHeight: window.innerHeight - 140, // 表格动态高度
      total: '',
      drawer: false,
      query: {
        pageNo: 1,
        pageSize: 20,
        name: '',
        barcode: '',
        supId: '',
        claId: '',
        id: ''
      },
      form: {
        id: '',
        name: '',
        supId: '',
        barcode: '',
        claId: '',
        price: '',
        purchasePrice: '',
        inventory: '',
        isDiscount: '',
        wholesalePrice: '',
        unitId: '',
        specification: '',
        supplierId: '',
        produceDate: '',
        expirationTime: ''
      },
      rules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        barcode: [
          { required: true, message: '商品条码不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '售价不能为空', trigger: 'blur' },
          {validator: validateNumber, message: '请输入数字', trigger: 'blur'}
        ],
        purchasePrice: [
          { required: true, message: '进价不能为空', trigger: 'blur' },
          {validator: validateNumber, message: '请输入数字', trigger: 'blur'}
        ],
        wholesalePrice: [
          {validator: validateNumber, message: '请输入数字', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getCommodities () {
      commodityPage(this.query).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        // console.info(res.data)
      })
    },
    formatTime (row) {
      const date = new Date(row.createTime)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    formatDate (row) {
      if (row.produceDate !== null) {
        const date = new Date(row.produceDate)
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      }
    },
    formatDiscount (row) {
      if (row.isDiscount) {
        return '是'
      } else {
        return '否'
      }
    },
    formatExpiration (row) {
      if (row.expirationTime !== null) {
        return row.expirationTime.toString() + '天'
      }
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
    searchCommodities () {
      commodityPage(this.query).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        // console.info(res.data)
        this.query.barcode = this.query.name
        this.query.name = ''
        return commodityPage(this.query)
      }).then(res => {
        this.tableData = this.tableData.concat(res.data.records)
        this.total += res.data.total
      })
    },
    editRow (rowIndex) {
      this.drawer = true
      this.isVisible = false
      // console.info(this.tableData[rowIndex])
      for (const key in this.form) {
        // 如果 data 对象中存在与 form 对象相同的属性
        if (this.tableData[rowIndex].hasOwnProperty(key)) {
          // 将 data 对象的属性值赋给 form 对象的相应属性
          this.form[key] = this.tableData[rowIndex][key]
        }
      }
      // console.info(this.form)
    },
    saveChange () {
      // console.info(this.form)
      updateCommodity(this.form).then(res => {
        if (res.data === true) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getCommodities()
        } else {
          this.$message.error('保存失败')
        }
        this.drawer = false
      })
    },
    deleteCommodity () {
      deleteCommodityById(this.form).then(res => {
        if (res.data) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getCommodities()
        } else {
          this.$message.error('删除失败')
        }
      })
      this.drawer = false
    },
    // 点击新增键弹出抽屉
    addCommodity () {
      this.drawer = true
      this.isVisible = true
      for (const key in this.form) {
        this.form[key] = ''
      }
    },
    // 保存新增商品到数据库
    saveCommodity () {
      if (this.form.wholesalePrice === '') {
        this.form.wholesalePrice = this.form.price
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 数据校验通过，执行相应的操作，例如跳转到其他页面或提交表单等。
          // console.log('数据校验通过')
          addCommodity(this.form).then(res => {
            if (res.data !== null) {
              this.$message({
                message: '新增商品成功',
                type: 'success'
              })
              return getCommodityById({id: res.data})
            } else {
              this.$message.error('新增商品失败')
            }
          }).then(res => {
            this.tableData = [res.data]
            // console.info(this.tableData)
            this.total = 1
          })
          this.drawer = false
        } else {
          // 数据校验失败，可以给按钮添加一个禁用状态或显示提示信息。
          this.$refs.addButton.disabled = true // el-button 的 ref 名为 "addButton"
        }
      })
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.getCommodities()
      return getClaOptions({supId: this.query.supId})
    }).then(res => {
      this.classificationSelection = res.data
      this.classificationOptions = this.classificationOptions.concat(res.data)
      return getUnitOptions({supId: this.query.supId})
    }).then(res => {
      this.unitOptions = res.data
      return getSupplierOptions({supId: this.query.supId})
    }).then(res => {
      this.supplierOptions = res.data
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
.flex-container{
    display: flex;
}
.bottom-container{
    position: absolute;
    display: flex;
    bottom: 5px;
}
</style>
