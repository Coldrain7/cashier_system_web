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
    </el-dialog>
    <el-divider></el-divider>
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
</div>
</template>
<script >
import store from '../../../../store'
import {getSupIdById} from '@api/user'
import {getSupermarketById, updateSupermarket} from '@api/supermarket'
export default {
  name: 'settings',
  data () {
    return {
      id: 0,
      selectClassificationVisible: false,
      searchPattern: '',
      editName: false,
      query: {
        supId: 0
      },
      tableData: [],
      filteredClassifications: [],
      supermarket: {},
      lastRatio: 100
    }
  },
  methods: {
    formatDiscount (row) {
      if (row.isDiscount) {
        return '是'
      } else {
        return '否'
      }
    },
    removeRow (index) {

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
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      return getSupermarketById(this.query)
    }).then(res => {
      this.supermarket = res.data
    })
  }
}
</script>
<style scoped>
/deep/ .el-form-item__label{
  font-size: 20px;
}
</style>
