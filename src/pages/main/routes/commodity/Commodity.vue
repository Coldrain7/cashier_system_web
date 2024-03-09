<template>
    <div>
        <div>
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
                        <el-button type="primary" icon="el-icon-search" @click="getCommodities" size="mini">搜索</el-button>
                    </el-form-item>
                    <el-form-item style="margin: 0px;text-align: left;">
                        <el-button type="primary" size="mini" @click="advanceVisible = true">高级搜索</el-button>
                    </el-form-item>
                    <el-form-item style="margin: 0px;">
                        <el-button type="primary" icon="el-icon-plus" @click="addCommodity" size="mini">新增</el-button>
                    </el-form-item>
                    <el-form-item style="margin: 0px;">
                        <el-button type="primary" icon="el-icon-upload2" @click="isImport = true" size="mini">导入</el-button>
                    </el-form-item>
                    <el-form-item style="margin: 0px;padding-right: 20px">
                        <el-button type="primary" icon="el-icon-download" @click="exportCommodities" size="mini">导出</el-button>
                    </el-form-item>
                </el-form>
        </div>
        <div>
            <el-table
                :data="tableData"
                :row-style="{height: 40 +'px'}"
                :cell-style="{padding:0+'px'}"
                :height="tableHeight"
                @sort-change="handleSortChange"
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
                    sortableF
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
            <el-dialog width="30%" title="导入商品" :visible.sync="isImport">
                <el-upload
                    class="upload-demo"
                    drag
                    action="./api/commodity/importCommodities"
                    accept=".xls, .xlsx"
                    :limit="1"
                    :data="{supId: query.supId}"
                    :on-exceed="importExceed"
                    :on-success="importSuccess">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
                </el-upload>
                <el-button type="text" @click="exportTemplate">下载模板</el-button>
            </el-dialog>
            <el-drawer :visible.sync="drawer" size="610px" :with-header="false">
                <el-form :model="form" :rules="rules" ref="form" label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
                    <div  style="width: 600px;">
                        <el-form-item prop="name">
                            <el-input v-model="form.name" >
                                <template slot="prepend"><a style="color: red">* </a>商品名称</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="flex-container">
                        <div style="width: 350px">
                            <el-form-item prop="barcode">
                                <el-input v-model="form.barcode">
                                    <template slot="prepend"><a style="color: red">* </a>商品条码</template>
                                    <el-button v-show="form.isMultibarcode" slot="append" class="edit-button"
                                               @click="editBarcodes" icon="el-icon-edit-outline"></el-button>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item label="是否一品多码" label-width="120px" style="padding-left: 20px;width: 150px">
                                <el-switch v-model="form.isMultibarcode">
                                </el-switch>
                            </el-form-item>
                        </div>
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
                                    <el-button type="primary" size="small" class="select-button" @click="editUnitOption">编辑单位</el-button>
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
                <el-dialog class="el-dialog__body" :title="form.name" :visible.sync="dialogTableVisible" append-to-body>
                    <div style="padding-top: 0px">
                        <el-input style="width: 600px; padding-left: 10px" v-model="form.barcode"><template slot="prepend">主条码</template></el-input>、
                            <el-table ref="barcodeTable" :data="barcodes"
                                      max-height="300"
                                      :show-header="false">
                                <el-table-column prop="barcode">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.barcode" @change="editBarcode(scope.$index)" placeholder="请输入条形码">
                                            <template slot="append">
                                                <el-button icon="el-icon-circle-close" @click="deleteBarcode(scope.$index)" class="delete-button"></el-button>
                                            </template>
                                        </el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        <div class="flex-container">
                            <div style="width: 40%;padding-left: 10px">
                                <el-button class="add_btn" @click="addBarcode">添加</el-button>
                            </div>
                            <div style="width: 40%;position: absolute;right: 30px">
                                <el-button class="save_btn" @click="saveBarcodes">保存</el-button>
                            </div>
                        </div>
                    </div>
                </el-dialog>
            </el-drawer>
            <el-drawer :visible.sync="advanceVisible" size="610px" :with-header="false">
                <el-form :model="advanceQuery" label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
                    <div  class="flex-container">
                        <el-form-item>
                            <a>分类：{{ advanceQuery.claIds.length?  `已选${advanceQuery.claIds.length}种分类` : '不限分类' }}</a>
                        </el-form-item>
                        <el-form-item style="padding-left: 10px">
                            <el-button type="text" size="medium" @click="advanceClaVisible=true">选择分类</el-button>
                        </el-form-item>
                    </div>
                    <el-divider></el-divider>
                    <div  class="flex-container">
                        <el-form-item>
                            <a>供应商：{{ advanceQuery.supplierIds.length ?  `已选${advanceQuery.supplierIds.length}个供应商` : '不限供应商' }}</a>
                        </el-form-item>
                        <el-form-item style="padding-left: 10px">
                            <el-button type="text" size="medium" @click="advanceSupplierVisible=true">选择供应商</el-button>
                        </el-form-item>
                    </div>
                    <el-divider></el-divider>
                    <div  class="flex-container">
                        <el-form-item>
                            <p>录入时间：
                                <el-date-picker
                                v-model="advanceQuery.timeFrom"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="选择开始日期">
                                </el-date-picker>
                                <el-date-picker
                                    v-model="advanceQuery.timeTo"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="date"
                                    placeholder="选择结束日期">
                                </el-date-picker></p>
                        </el-form-item>
                    </div>
                    <el-divider></el-divider>
                    <div  class="flex-container">
                        <el-form-item>
                            <p>价格区间：</p>
                        </el-form-item>
                        <el-form-item>
                            <el-input style="padding-top: 15px" v-model="advanceQuery.priceFrom"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input style="padding-top: 15px" v-model="advanceQuery.priceTo"><template slot="append">元</template></el-input>
                        </el-form-item>
                    </div>
                    <el-divider></el-divider>
                    <div  class="flex-container">
                        <el-form-item>
                            <p>库存区间：</p>
                        </el-form-item>
                        <el-form-item>
                            <el-input style="padding-top: 15px" v-model="advanceQuery.inventoryFrom"><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input style="padding-top: 15px" v-model="advanceQuery.inventoryTo"><template slot="append">元</template></el-input>
                        </el-form-item>
                    </div>
                    <el-divider></el-divider>
                    <div  class="flex-container">
                        <el-form-item>
                            <p>关键字：</p>
                        </el-form-item>
                        <el-form-item>
                            <el-input style="padding-top: 15px" v-model="advanceQuery.name" placeholder="商品名称/条码"></el-input>
                        </el-form-item>
                    </div>
                    <el-divider></el-divider>
                    <div  class="flex-container">
                        <el-form-item>
                            <p>规格：</p>
                        </el-form-item>
                        <el-form-item>
                            <el-input style="padding-top: 15px" v-model="advanceQuery.specification" placeholder="商品名称/条码"></el-input>
                        </el-form-item>
                    </div>
                    <el-divider></el-divider>
                    <div  class="flex-container">
                        <el-form-item>
                            <p>会员折扣：
                                <el-switch
                                    active-text="是"
                                    inactive-text="否"
                                    v-model="advanceQuery.isDiscount">
                                </el-switch>
                            </p>
                        </el-form-item>
                        <el-form-item style="padding-left: 50px">
                            <p>一品多码：
                                <el-switch
                                    active-text="是"
                                    inactive-text="否"
                                    v-model="advanceQuery.isMultibarcode">
                                </el-switch>
                            </p>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="bottom-container">
                    <el-button icon="el-icon-delete" @click="clearAdvanceQuery">清空条件</el-button>
                    <el-button type="primary" @click="advanceSearch">搜索</el-button>
                </div>
                <el-dialog title="选择分类" :visible.sync="advanceClaVisible" append-to-body>
                    <el-input v-model="searchPattern" placeholder="输入关键字搜索" prefix-icon="el-icon-search">
                    </el-input>
                    <el-table
                        ref="multipleClassification"
                        :data="filteredClassifications"
                        :row-style="{height: 40 +'px'}"
                        height="400px"
                        border
                        @selection-change="claSelectionChange"
                        style="width: 100%">
                        <el-table-column
                            type="selection"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="classification"
                            label="分类名称"
                            width="590">
                        </el-table-column>
                    </el-table>
                </el-dialog>
                <el-dialog title="选择供应商" :visible.sync="advanceSupplierVisible" append-to-body>
                    <el-input v-model="searchPattern" placeholder="输入关键字搜索" prefix-icon="el-icon-search">
                    </el-input>
                    <el-table
                        ref="multipleSupplier"
                        :data="filteredSuppliers"
                        :row-style="{height: 40 +'px'}"
                        height="400px"
                        border
                        @selection-change="supplierSelectionChange"
                        style="width: 100%">
                        <el-table-column
                            type="selection"
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="供应商 "
                            width="590">
                        </el-table-column>
                    </el-table>
                </el-dialog>
            </el-drawer>
        </div>
        <div>
            <el-dialog width="28%"
                       title="编辑单位"
                       :visible.sync="unitEditVisible">
                <el-input style="width: 330px" v-model.trim="newUnit.unit">
                    <template slot="prepend">新建单位</template>
                    <el-button slot="append" class="edit-button" @click="addUnit" icon="el-icon-plus"></el-button>
                </el-input>
                    <div v-for="(row, rowIndex) in formattedUnits" :key="rowIndex" class="button-row">
                        <el-popover
                            placement="top"
                            width="160"
                            v-for="(item, index) in row"
                            :key="index"
                            v-model="popoverVisible[rowIndex * 6 + index]"
                        >
                            <div style="text-align: center; margin: 0;">
                                <el-button size="mini" @click="closePopover(rowIndex, index)">取消</el-button>
                                <el-button type="primary" size="mini" @click="deleteUnit(item)">删除</el-button>
                            </div>
                            <el-button slot="reference">{{item.unit}}</el-button>
                        </el-popover>
                    </div>
            </el-dialog>
        </div>
    </div>

</template>

<script>
import { commodityPage, updateCommodity, deleteCommodityById, addCommodity, getCommodityById,
  getBarcodesByComId, updateBarcodes, addBarcodes, deleteBarcodes, commodityPageInOrder,
  searchCommodities, advanceSearchPage, exportCommodities, advanceExport, exportTemplate } from '@api/commodity'
import {getSupIdById} from '@api/user'
import {getClaOptions} from '@api/classification'
import {getSupplierOptions} from '@api/supplier'
import {getUnitOptions, addUnit, deleteUnitById} from '@api/unit'
import store from '../../../../store'
export default {
  name: 'Commodity',
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
      isImport: false,
      isAdvanceSearch: false,
      searchPattern: '',
      isVisible: true,
      dialogTableVisible: false,
      unitEditVisible: false,
      advanceVisible: false,
      advanceSupplierVisible: false,
      advanceClaVisible: false,
      popoverVisible: [],
      currentPopoverCell: null,
      originBarcodesLength: 0,
      tableData: [],
      barcodes: [],
      changedBarcodes: [],
      deleteIds: [],
      newBarcode: {
        comId: '',
        barcode: ''
      },
      newUnit: {
        supId: '',
        unit: ''
      },
      classificationOptions: [{id: 0, classification: '全部分类'}],
      classificationSelection: [],
      unitOptions: [],
      formattedUnits: [],
      supplierOptions: [],
      tableHeight: window.innerHeight - 140, // 表格动态高度
      total: 0,
      drawer: false,
      query: {
        pageNo: 1,
        pageSize: 20,
        name: '',
        barcode: '',
        supId: '',
        claId: '',
        id: '',
        order: null,
        prop: ''
      },
      advanceQuery: {
        claIds: [],
        supplierIds: [],
        isDiscount: true,
        timeFrom: '',
        timeTo: '',
        priceFrom: '',
        priceTo: '',
        inventoryFrom: '',
        inventoryTo: '',
        name: '',
        specification: '',
        isMultibarcode: false,
        order: null,
        prop: '',
        pageNo: 1,
        pageSize: 20,
        supId: ''
      },
      form: {
        id: '',
        name: '',
        supId: '',
        barcode: '',
        claId: '',
        price: '',
        isMultibarcode: '',
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
  computed: {
    filteredClassifications () {
      // 使用map方法遍历items数组，并使用likeSearch方法过滤出匹配的项
      return this.classificationSelection.filter(item => this.likeSearch(item.classification, this.searchPattern))
    },
    filteredSuppliers () {
      return this.supplierOptions.filter(item => this.likeSearch(item.name, this.searchPattern))
    }
  },
  methods: {
    // columnStyle ({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     return 'background: #F6F6F7'
    //   }
    // },
    importExceed (files, fileList) {
      this.$message.warning('只能上传一个Excel文件！')
    },
    importSuccess (res, file) {
      if (res.status) {
        this.$notify({
          title: res.data,
          message: res.message,
          type: 'success',
          duration: 0
        })
      } else {
        this.$notify.error({
          title: '导入错误',
          message: res.message,
          duration: 0
        })
      }
      this.isImport = false
      this.getCommodities()
    },
    exportTemplate () {
      exportTemplate().then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = '导入模板.xls'
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    exportCommodities () {
      if (this.isAdvanceSearch) {
        advanceExport(this.advanceQuery).then(res => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let url = window.URL.createObjectURL(blob)
          let a = document.createElement('a')
          a.href = url
          a.download = '商品资料.xls'
          a.click()
          window.URL.revokeObjectURL(url)
        })
      } else {
        exportCommodities(this.query).then(res => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let url = window.URL.createObjectURL(blob)
          let a = document.createElement('a')
          a.href = url
          a.download = '商品资料.xls'
          a.click()
          window.URL.revokeObjectURL(url)
        })
      }
    },
    clearAdvanceQuery () {
      this.advanceQuery.claIds = []
      this.advanceQuery.supplierIds = []
      this.advanceQuery.isDiscount = true
      this.advanceQuery.timeFrom = ''
      this.advanceQuery.timeTo = ''
      this.advanceQuery.priceFrom = ''
      this.advanceQuery.priceTo = ''
      this.advanceQuery.inventoryFrom = ''
      this.advanceQuery.inventoryTo = ''
      this.advanceQuery.name = ''
      this.advanceQuery.specification = ''
      this.advanceQuery.isMultibarcode = false
      this.$refs.multipleClassification.clearSelection()
      this.$refs.multipleSupplier.clearSelection()
    },
    advanceSearch () {
      this.isAdvanceSearch = true
      this.advanceQuery.pageNo = this.query.pageNo
      this.advanceQuery.pageSize = this.query.pageSize
      advanceSearchPage(this.advanceQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    likeSearch (text, searchPattern) {
      const pattern = '.*' + searchPattern + '.*'
      const regex = new RegExp(pattern, 'i')
      return regex.test(text)
    },
    claSelectionChange (val) {
      this.advanceQuery.claIds = []
      for (let item of val) {
        this.advanceQuery.claIds.push(item.id)
      }
    },
    supplierSelectionChange (val) {
      this.advanceQuery.supplierIds = []
      for (let item of val) {
        this.advanceQuery.supplierIds.push(item.id)
      }
    },
    deleteUnit (item) {
      deleteUnitById(item).then(res => {
        if (res.data) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          getUnitOptions({supId: this.query.supId}).then(res => {
            this.unitOptions = res.data
            this.formatUnit()
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    addUnit () {
      addUnit(this.newUnit).then(res => {
        if (res.data) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          getUnitOptions({supId: this.query.supId}).then(res => {
            this.unitOptions = res.data
            this.formatUnit()
          })
        } else {
          this.$message.error('创建失败，单位已存在')
        }
      })
    },
    closePopover (rowIndex, index) {
      this.$set(this.popoverVisible, rowIndex * 6 + index, false)
    },
    formatUnit () {
      this.formattedUnits = []
      const itemsPerRow = 6 // 每行显示的元素数量
      const numRows = Math.ceil(this.unitOptions.length / itemsPerRow) // 计算需要多少行
      for (let i = 0; i < numRows; i++) {
        const start = i * itemsPerRow
        const end = start + itemsPerRow
        this.formattedUnits.push(this.unitOptions.slice(start, end))
      }
      for (let i = 0; i < this.unitOptions.length; i++) {
        this.popoverVisible.push(false)
      }
    },
    editUnitOption () {
      this.unitEditVisible = true
    },
    handleSortChange ({ prop, order }) {
      this.query.prop = prop
      this.query.order = order
      this.advanceQuery.prop = prop
      this.advanceQuery.order = order
      if (this.isAdvanceSearch) {
        this.advanceSearch()
      } else {
        this.getCommodities()
      }
    },
    async saveBarcodes () {
      let res1 = true
      let res2 = true
      let res3 = true
      if (this.changedBarcodes.length > 0) {
        let param = JSON.stringify(this.changedBarcodes)
        await updateBarcodes(param).then(res => {
          res1 = res.data
        })
      }
      if (this.barcodes.length > this.originBarcodesLength) {
        // console.info(this.barcodes.length)
        // console.info(this.originBarcodesLength)
        let param = JSON.stringify(this.barcodes.slice(this.originBarcodesLength, this.barcodes.length))
        await addBarcodes(param, this.query).then(res => {
          res2 = res.data
        })
      }
      if (this.deleteIds.length > 0) {
        let param = JSON.stringify(this.deleteIds)
        await deleteBarcodes(param).then(res => {
          res3 = res.data
        })
      }
      if (res1 && res2 && res3) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      } else {
        this.$message.error('保存失败')
      }
    },
    getCommodities () {
      this.isAdvanceSearch = false
      this.query.barcode = this.query.name
      // 名称搜索栏不为空时,搜索商品
      if (this.query.name !== '') {
        searchCommodities(this.query).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
        })
      } else {
        // 搜索栏为空时，直接查询
        if (this.query.order === null) {
          // console.info(this.query)
          commodityPage(this.query).then(res => {
            this.tableData = res.data.records
            this.total = res.data.total
            // console.info(res.data)
          })
        } else {
          commodityPageInOrder(this.query).then(res => {
            this.tableData = res.data.records
            this.total = res.data.total
          })
        }
      }
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
      this.advanceQuery.pageSize = value
      if (this.isAdvanceSearch) {
        this.advanceSearch()
      } else {
        this.getCommodities()
      }
    },
    handleCurrentChange (value) {
      this.query.pageNo = value
      this.advanceQuery.pageNo = value
      if (this.isAdvanceSearch) {
        this.advanceSearch()
      } else {
        this.getCommodities()
      }
    },
    indexMethod (index) {
      return (this.query.pageNo - 1) * this.query.pageSize + index + 1
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
      // getBarcodesByComId({id: this.form.id}).then(res => {
      //   // console.info(res.data.length)
      //   if (res.data.length <= 0) {
      //     this.isMultiBarcode = false
      //   } else {
      //     this.isMultiBarcode = true
      //     this.barcodes = res.data
      //     // console.info(this.barcodes.length)
      //   }
      // })
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
      this.form.isDiscount = true
      this.form.isMultibarcode = false
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
          this.form.supId = this.query.supId
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
    },
    // 点击编辑一品多码按钮
    editBarcodes () {
      this.dialogTableVisible = true
      this.changedBarcodes = []
      // console.info(this.barcodes.length)
      getBarcodesByComId({id: this.form.id}).then(res => {
        // console.info(res.data)
        this.barcodes = res.data
        this.originBarcodesLength = this.barcodes.length
      })
    },
    // 输入框编辑条形码
    editBarcode (rowIndex) {
      if (this.originBarcodesLength > rowIndex) {
        this.changedBarcodes.push(
          {
            id: this.barcodes[rowIndex].id,
            barcode: this.barcodes[rowIndex].barcode
          }
        )
      }
    },
    addBarcode () {
      this.barcodes.push(
        {id: '',
          comId: this.form.id,
          barcode: '',
          isDeleted: false,
          createTime: '',
          updateTime: ''})
      this.$nextTick(() => {
        // 使用$refs获取el-table的DOM元素
        const tableBodyWrapper = this.$refs.barcodeTable.$el.querySelector('.el-table__body-wrapper')
        // 确保tableBodyWrapper存在
        if (tableBodyWrapper) {
          // 滚动到底部
          tableBodyWrapper.scrollTop = tableBodyWrapper.scrollHeight
        }
      })
    },
    deleteBarcode (rowIndex) {
      // 行号小于数组长度时，将条形码id加入待删除数组
      if (rowIndex < this.barcodes.length) {
        this.deleteIds.push(this.barcodes[rowIndex].id)
        this.originBarcodesLength--
      }
      this.barcodes.splice(rowIndex, 1)
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.newUnit.supId = this.query.supId
      this.advanceQuery.supId = this.query.supId
      this.getCommodities()
      return getClaOptions({supId: this.query.supId})
    }).then(res => {
      this.classificationSelection = res.data
      this.classificationOptions = this.classificationOptions.concat(res.data)
      return getUnitOptions({supId: this.query.supId})
    }).then(res => {
      this.unitOptions = res.data
      this.formatUnit()
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
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
}
.add_btn {
    text-align: center;
    padding: 12px;
    width: 100%;
    margin-top: 0px;
    background-color: #67C23A;
    color: #fff;
}
.save_btn{
    text-align: center;
    padding: 12px;
    width: 100%;
    margin-top: 0px;
    background-color: #409EFF;
    color: #fff;
}
.el-dialog__body {
    padding: 0px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
}

.delete-button:hover{
    background-color: #F56C6C;
    color: white;
}
.select-button{
    width: 100%;
}
.edit-button:hover{
    background-color: #67C23A;
    color: white;
}
.el-divider--horizontal{
    margin-top: -20px;
    margin-bottom: 0px;
}
</style>
