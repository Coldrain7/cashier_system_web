<template>
<div>
  <el-form>
    <div style="margin-left: 20px;margin-top: 20px">
      <el-form-item label="店铺名称:">
        <span v-show="!editName" style="font-size: 20px">{{supermarket.name}}</span>
        <el-input v-show="editName" v-model="supermarket.name" style="width: 300px"></el-input>
        <el-button v-show="!editName" type="text" @click="editName=true">修改店铺名称</el-button>
        <el-button v-show="editName" type="text" @click="saveSupermarket">保存</el-button>
        <el-button v-show="editName" type="text" @click="editName=false">取消</el-button>
      </el-form-item>
    </div>
    <el-divider></el-divider>
    <div style="margin-left: 20px;margin-top: 20px">
      <el-form-item label="积分兑换比率:">
        <span style="font-size: 20px">1元=</span>
        <el-input v-model="supermarket.pointRatio" style="width: 100px" @focus="ratioFocus" @blur="ratioBlur"
        placeholder="请输入积分数字"></el-input>
        <span style="font-size: 20px">分</span>
        <el-button type="text" style="margin-left: 20px" @click="saveSupermarket">保存</el-button>
      </el-form-item>
    </div>
    <el-divider></el-divider>
    <div style="margin-left: 20px;margin-top: 20px">
      <span style="font-size: 20px;font-weight: bold;color: #606266">添加不计入积分商品：</span>
      <el-button type="text" @click="selectClassificationVisible = true">按分类添加</el-button>
      <el-checkbox v-model="includeSonClass" style="padding-left: 20px">包含子分类</el-checkbox>
      <el-input size="mini" v-model="query.barcode" placeholder="输入商品名称/条码添加" style="width: 220px"></el-input>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="getCommoditiesByKeyword">添加</el-button>
      <el-input size="mini" v-model="searchWord" placeholder="输入商品名称/条码搜索已添加商品"  style="width: 220px"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchInTable" size="mini">搜索</el-button>
    </div>
    <el-table
        :data="tableData"
        :row-style="{height: 40 +'px'}"
        :cell-style="{padding:0+'px'}"
        border
        style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="name"
          label="商品名称"
          width="240">
      </el-table-column>
      <el-table-column
          prop="barcode"
          label="条码"
          width="240">
      </el-table-column>
      <el-table-column
          prop="classification.classification"
          label="分类"
          width="240">
      </el-table-column>
      <el-table-column
          prop="price"
          label="销售价"
          width="240">
      </el-table-column>
      <el-table-column
          prop="isDiscount"
          :formatter="formatDiscount"
          label="会员折扣"
          width="180">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="removeRow(scope.$index)" type="text" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-dialog title="选择分类" :visible.sync="selectClassificationVisible">
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
    <div class="space-container">
      <el-button style="width: 200px" @click="selectClassificationVisible = false">取消</el-button>
      <el-button type="primary" style="width: 200px" @click="saveClassification">保存</el-button>
    </div>
  </el-dialog>
  <el-dialog title="选择商品" width="40%" :visible.sync="commodityDialogVisible">
    <div style="padding-top: 0px">
      <el-table :data="dialogTableData"
                :row-style="{height: 40 +'px'}"
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
  <el-dialog
      :title="'确认移除商品'+this.tableData[this.rowIndex]['name']+'吗？'"
      :close-on-click-modal="false"
      :visible.sync="deleteDialog">
    <div class="space-container">
      <el-button @click="deleteDialog = false">取 消</el-button>
      <el-button style="background-color: #F56C6C;color: white" @click="removeCommodity">移 除</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script >
import store from '../../../../store'
import {getSupIdById} from '@api/user'
import {getSupermarketById, updateSupermarket} from '@api/supermarket'
import {getClaOptions} from '@api/classification'
import {getCommoditiesByClaIds, notIsDiscounts, getNoDiscountCommodities, getCommoditiesByKeyword} from '@api/commodity'
export default {
  name: 'settings',
  data () {
    return {
      id: 0,
      selectClassificationVisible: false,
      searchPattern: '',
      editName: false,
      includeSonClass: true,
      commodityDialogVisible: false,
      deleteDialog: false,
      classificationOptions: [],
      query: {
        supId: 0,
        barcode: ''
      },
      rowIndex: 0,
      searchWord: '',
      tableData: [],
      selectedCommodities: [],
      supermarket: {},
      claIds: [],
      dialogTableData: [],
      lastRatio: 100
    }
  },
  methods: {
    removeCommodity () {
      let commodities = []
      commodities.push(this.tableData[this.rowIndex])
      notIsDiscounts(commodities).then(res => {
        return getNoDiscountCommodities(this.query)
      }).then(res => {
        this.$message.success('移除成功')
        this.selectedCommodities = res.data
        this.tableData = this.selectedCommodities
      })
    },
    searchInTable () {
      this.tableData = this.selectedCommodities.filter(item => this.keywordSearch(item.name, item.barcode, this.searchWord))
    },
    addCommodity (index) {
      let commodities = []
      commodities.push(this.dialogTableData[index])
      notIsDiscounts(commodities).then(res => {
        return getNoDiscountCommodities(this.query)
      }).then(res => {
        this.$message.success('添加成功')
        this.selectedCommodities = res.data
        this.tableData = this.selectedCommodities
        this.commodityDialogVisible = false
      })
    },
    getCommoditiesByKeyword () {
      if (this.query.barcode !== '') {
        getCommoditiesByKeyword(this.query).then(res => {
          this.commodityDialogVisible = true
          this.dialogTableData = res.data
        })
      }
    },
    saveClassification () {
      notIsDiscounts(this.selectedCommodities).then(res => {
        let query = {}
        query.type = this.includeSonClass ? 1 : 0
        return getCommoditiesByClaIds(this.claIds, query)
      }).then(res => {
        this.selectedCommodities = res.data == null ? [] : res.data
        return notIsDiscounts(this.selectedCommodities)
      }).then(res => {
        for (let item of this.selectedCommodities) {
          item.isDiscount = false
        }
        this.tableData = this.selectedCommodities
        this.selectClassificationVisible = false
      })
    },
    claSelectionChange (val) {
      this.claIds = []
      for (let item of val) {
        this.claIds.push(item.id)
      }
    },
    likeSearch (text, searchPattern) {
      const pattern = '.*' + searchPattern + '.*'
      const regex = new RegExp(pattern, 'i')
      return regex.test(text)
    },
    keywordSearch (name, barcode, searchPattern) {
      const pattern = '.*' + searchPattern + '.*'
      const regex = new RegExp(pattern, 'i')
      return regex.test(name) || regex.test(barcode)
    },
    formatDiscount (row) {
      if (row.isDiscount) {
        return '是'
      } else {
        return '否'
      }
    },
    removeRow (index) {
      this.rowIndex = index
      this.deleteDialog = true
    },
    ratioBlur () {
      let regex = /^\d+(\.\d+)?$/
      if (regex.test(this.supermarket.pointRatio)) {
        this.lastRatio = this.supermarket.pointRatio
      } else {
        this.supermarket.pointRatio = this.lastRatio
      }
    },
    ratioFocus () {
      this.lastRatio = this.supermarket.pointRatio
    },
    saveSupermarket () {
      let regex = /^\d+(\.\d+)?$/
      if (regex.test(this.supermarket.pointRatio)) {
        this.supermarket.createTime.replace('T', ' ')
        this.supermarket.updateTime = null
        updateSupermarket(this.supermarket).then(res => {
          if (res.data) {
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败')
          }
        })
      } else {
        this.$message.error('修改失败：请输入正确积分数字')
      }
    }
  },
  computed: {
    filteredClassifications () {
      // 使用map方法遍历items数组，并使用likeSearch方法过滤出匹配的项
      return this.classificationOptions.filter(item => this.likeSearch(item.classification, this.searchPattern))
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      return getSupermarketById(this.query)
    }).then(res => {
      this.supermarket = res.data
      return getClaOptions({supId: this.query.supId})
    }).then(res => {
      this.classificationOptions = res.data
      return getNoDiscountCommodities(this.query)
    }).then(res => {
      this.selectedCommodities = res.data
      this.tableData = this.selectedCommodities
    })
  }
}
</script>
<style scoped>
/deep/ .el-form-item__label{
  font-size: 20px;
}
.space-container{
   display: flex;
   justify-content: space-between;
 }
</style>
