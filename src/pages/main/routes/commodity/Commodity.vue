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
                        <el-button type="primary" icon="el-icon-plus" @click="getEvents()" size="mini">新增</el-button>
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

            <el-drawer :visible.sync="drawer" size="650px" :with-header="false">
                <el-form :inline="true" :rules="rules" ref="form" label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
                    <el-form-item label=" " prop="name">
                        <el-input v-model="form.name"><template slot="prepend">商品名称</template></el-input>
                    </el-form-item>
                    <el-form-item label=" " prop="barcode">
                        <el-input v-model="form.barcode"><template slot="prepend">商品条码</template></el-input>
                    </el-form-item>
                    <el-form-item label=" " prop="price">
                        <el-input v-model="form.price"><template slot="prepend">售价</template></el-input>
                    </el-form-item>
                    <el-form-item label=" " prop="purchase_price">
                        <el-input v-model="form.purchase_price"><template slot="prepend">进价</template></el-input>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-input v-model="form.inventory"><template slot="prepend">库存</template></el-input>
                    </el-form-item>
                    <el-form-item label="会员折扣" label-width="80px">
                        <el-switch v-model="form.isDiscount">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-input v-model="form.wholesalePrice"><template slot="prepend">批发价</template></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" label-width="80px">
                        <template>
                            <el-select v-model="form.claId" placeholder="选择分类">
                                <el-option
                                    v-for="item in classificationOptions"
                                    :key="item.id"
                                    :label="item.classification"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item label="单位" label-width="40px">
                        <template>
                            <el-select v-model="form.unitId" placeholder="选择单位">
                                <el-option
                                    v-for="item in classificationOptions"
                                    :key="item.id"
                                    :label="item.classification"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-input v-model="form.specification"><template slot="prepend">商品规格</template></el-input>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-input v-model="form.supplier"><template slot="prepend">供应商</template></el-input>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-input v-model="form.produceDate"> <template slot="prepend">生产日期</template></el-input>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-input v-model="form.expirationTime"><template slot="prepend">保质期</template></el-input>
                    </el-form-item>
                </el-form>
            </el-drawer>
        </div>
    </div>

</template>

<script>
import { commodityPage } from '@api/commodity'
import {getSupIdById} from '@api/user'
import {getClaOptions} from '@api/classification'
import store from '../../../../store'
export default {
  name: 'Second',
  data () {
    return {
      id: '',
      index: 1,
      tableData: [],
      classificationOptions: [{id: 0, classification: '全部分类'}],
      tableHeight: window.innerHeight - 140, // 表格动态高度
      total: '',
      drawer: false,
      query: {
        pageNo: 1,
        pageSize: 20,
        name: '',
        barcode: '',
        supId: '',
        claId: ''
      },
      form: {
        name: '',
        supId: '',
        barcode: '',
        claId: '',
        price: '',
        purchase_price: '',
        inventory: '',
        isDiscount: '',
        wholesalePrice: '',
        unitId: '',
        specification: '',
        supplier: '',
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
          { required: true, message: '售价不能为空', trigger: 'blur' }
        ],
        purchase_price: [
          { required: true, message: '进价不能为空', trigger: 'blur' }
        ],
        unit_id: [
          { required: true, message: '单位不能为空', trigger: 'blur' }
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
      console.info(rowIndex)
      console.info(this.tableData[rowIndex])
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.getCommodities()
      return getClaOptions({supId: this.query.supId})
    }).then(res => {
      this.classificationOptions = this.classificationOptions.concat(res.data)
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
.no-border {
    border: none !important; /* 去掉边框线 */
}
</style>
