<template>
<div style="background-color: white">
    <div class="space-container">
        <div class="header">商品分类</div>
        <el-form :inline="true" style="padding-top: 0px;text-align: right;">
            <el-form-item style="margin: 0px;padding-left: 10px">
                <el-input size="small" placeholder="商品名称/条码"></el-input>
            </el-form-item>
            <el-form-item style="margin: 0px;">
                <el-button size="small" type="primary" icon="el-icon-search">搜索</el-button>
            </el-form-item>
            <el-form-item style="margin: 0px;">
            <el-button size="small" icon="el-icon-plus" type="primary" @click="addVisible=true">新增分类</el-button>
        </el-form-item>
        </el-form>
    </div>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                prop="classification"
                label="分类名称"
                width="900px">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="180px">
                <template slot-scope="scope">
                    <el-button @click="editRow(scope.$index)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="新增分类"
            :visible.sync="addVisible">
            <el-input placeholder="输入分类名称" v-model.trim="newClassification.classification"></el-input>
            <span slot="footer" class="dialog-footer">
    <el-button style="background-color: #67C23A;color: white" @click="saveClassification">保 存</el-button>
  </span>
        </el-dialog>
    </div>

</div>
</template>

<script>
import {getClaOptions, addClassification} from '@api/classification'
import {getSupIdById} from '@api/user'
import store from '../../../../store'
export default {
  name: 'Classification',
  data () {
    return {
      id: '',
      addVisible: false,
      rawData: [],
      tableData: [],
      newClassification: {
        supId: '',
        classification: ''
      }
    }
  },
  methods: {
    getClassifications () {
      getClaOptions({supId: this.newClassification.supId}).then(res => {
        this.rawData = res.data
        this.formatData(this.rawData)
      })
    },
    saveClassification () {
      addClassification(this.newClassification).then(res => {
        if (res.status) {
          this.$message.success(res.data)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    formatData (data) {
      this.tableData = data
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.newClassification.supId = res.data
      return getClaOptions({supId: this.newClassification.supId})
    }).then(res => {
      this.rawData = res.data
      this.formatData(this.rawData)
    })
  }
}
</script>

<style scoped>
.header{
    font-size: 20px; /* 字体大小 */
    color: #333333; /* 字体颜色 */
    text-align: left; /* 文本对齐方式 */
    padding-top: 10px;
}
.space-container{
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
}
</style>
