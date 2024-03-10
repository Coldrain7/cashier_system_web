<template>
    <div>
        <div>
            <el-form :inline="true" style="padding: 0px;text-align: right;">
                <el-form-item style="margin: 0px;padding-left: 10px">
                    <el-input size="mini" v-model="query.name" placeholder="会员号/姓名/电话"></el-input>
                </el-form-item>
                <el-form-item style="margin: 0px;">
                    <el-button type="primary" icon="el-icon-search" @click="getMemberPage" size="mini">搜索</el-button>
                </el-form-item>
                <el-form-item style="margin: 0px;">
                    <el-button type="primary" icon="el-icon-plus" size="mini">新增</el-button>
                </el-form-item>
                <el-form-item style="margin: 0px;padding-right: 20px">
                    <el-button type="primary" icon="el-icon-download" size="mini">导出</el-button>
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
                    prop="id"
                    label="会员号"
                    sortable
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    sortable
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="电话"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="point"
                    label="积分"
                    sortable
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    :formatter="formatTime"
                    sortable
                    width="200">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope"><!--@click="editRow(scope.$index)"-->
                        <el-button type="text" size="small">编辑</el-button>
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
        </div>
    </div>
</template>

<script>
import {memberPage} from '@api/member'
import {getSupIdById} from '@api/user'
import store from '../../../../store'
export default {
  name: 'Member',
  data () {
    return {
      id: '',
      tableData: [],
      total: 0,
      tableHeight: window.innerHeight - 140, // 表格动态高度
      query: {
        supId: '',
        pageNo: 1,
        pageSize: 20,
        order: null,
        prop: '',
        id: '',
        phone: '',
        name: ''
      }
    }
  },
  methods: {
    handleCurrentChange (value) {
      this.query.pageNo = value
      this.getMemberPage()
    },
    handleSizeChange (value) {
      this.query.pageSize = value
      this.getMemberPage()
    },
    getMemberPage () {
      memberPage(this.query).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    handleSortChange ({ prop, order }) {
      this.query.prop = prop
      this.query.order = order
      this.getMemberPage()
    },
    formatTime (row) {
      const date = new Date(row.createTime)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
              date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    indexMethod (index) {
      return (this.query.pageNo - 1) * this.query.pageSize + index + 1
    }
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
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      return memberPage(this.query)
    }).then(res => {
      this.tableData = res.data.records
      console.info(this.tableData)
      this.total = res.data.total
    })
  }
}
</script>

<style scoped>

</style>
