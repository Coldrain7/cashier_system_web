<template>
<div style="background-color: white">
    <div class="space-container">
        <div class="header">商品分类</div>
        <el-form :inline="true" style="padding-top: 0px;text-align: right;">
            <el-form-item style="margin: 0px;padding-left: 10px">
                <el-input size="small" placeholder="分类名称" v-model.trim="query.classification"></el-input>
            </el-form-item>
            <el-form-item style="margin: 0px;">
                <el-button size="small" type="primary" icon="el-icon-search" @click="searchClassifications">搜索</el-button>
            </el-form-item>
            <el-form-item style="margin: 0px;">
            <el-button size="small" icon="el-icon-plus" type="primary" @click="addVisible=true">新增分类</el-button>
        </el-form-item>
        </el-form>
    </div>
    <div>
        <el-table
            ref="myTable"
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{children: 'children'}">
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
                    <el-button v-if="scope.row.children"
                               @click="addSonClassification(scope.$index, scope.row.id)"
                               type="text" size="small">添加子分类</el-button>
                    <el-button @click="deleteClassification(scope.row.id)" type="text" size="small">删除</el-button>
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
        <el-dialog
            title="新增子分类"
            :visible.sync="addSonClaVisible">
            <el-input placeholder="输入子分类名称" v-model.trim="newClassification.classification"></el-input>
            <span slot="footer" class="dialog-footer">
    <el-button style="background-color: #67C23A;color: white" @click="saveSonClassification">保 存</el-button>
  </span>
        </el-dialog>
    </div>

</div>
</template>

<script>
import {getClaOptions, addClassification, deleteClaById, searchClassifications} from '@api/classification'
import {getSupIdById} from '@api/user'
import store from '../../../../store'
export default {
  name: 'Classification',
  data () {
    return {
      id: '', // 用户id
      tableIndex: 0,
      addVisible: false,
      addSonClaVisible: false,
      rawData: [],
      tableData: [],
      query: {
        supId: '',
        classification: ''
      },
      newClassification: {
        id: '',
        supId: '',
        classification: '',
        claId: ''
      }
    }
  },
  methods: {
    searchClassifications () {
      searchClassifications(this.query).then(res => {
        this.formatData(res.data)
      })
    },
    getClassifications () {
      getClaOptions({supId: this.newClassification.supId}).then(res => {
        this.rawData = res.data
        this.formatData(this.rawData)
      })
    },
    addSonClassification (index, rowId) {
      this.addSonClaVisible = true
      this.newClassification.claId = rowId
      this.tableIndex = index
    },
    saveSonClassification () {
      this.newClassification.id = ''
      addClassification(this.newClassification).then(res => {
        if (res.status) {
          this.$message.success(res.message)
          this.getClassifications()
        } else {
          this.$message.error(res.message)
        }
        this.addSonClaVisible = false
      })
    },
    deleteClassification (id) {
      deleteClaById(id).then(res => {
        if (res) {
          this.$message.success('删除成功')
          this.getClassifications()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    saveClassification () {
      this.newClassification.id = ''
      this.newClassification.claId = ''
      addClassification(this.newClassification).then(res => {
        if (res.status) {
          this.$message.success(res.message)
          this.getClassifications()
        } else {
          this.$message.error(res.message)
        }
        this.addVisible = false
      })
    },
    formatData (data) {
      // 父分类claId都为null
      this.tableData = data.filter(item => item.claId === null)
      data = data.filter(item => item.claId !== null)
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].children = data.filter(item => item.claId === this.tableData[i].id)
      }
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.newClassification.supId = res.data
      this.query.supId = res.data
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
