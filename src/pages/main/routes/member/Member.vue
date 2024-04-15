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
                    <el-button type="primary" icon="el-icon-plus" @click="clickAdd" size="mini">新增</el-button>
                </el-form-item>
                <el-form-item style="margin: 0px;padding-right: 20px">
                    <el-button type="primary" icon="el-icon-download" @click="exportMembers" size="mini">导出</el-button>
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
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="会员号"
                    sortable="custom"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    sortable="custom"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="电话"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="point"
                    label="积分"
                    sortable="custom"
                    width="240">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    :formatter="formatTime"
                    sortable="custom"
                    width="240">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editRow(scope.$index)" size="small">编辑</el-button>
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
            <el-dialog width="350px" title="会员信息" :visible.sync="editVisible">
                <el-form :model="form" :rules="rules" ref="form" label-width="0px"
                         label-position="left" style="padding-top: 50px; padding-left: 5px">
                    <div  style="width: 300px;">
                        <el-form-item prop="name">
                            <el-input v-model="form.name" >
                                <template slot="prepend"><a style="color: red">* </a>姓名</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div  style="width: 300px;">
                        <el-form-item prop="phone">
                            <el-input v-model="form.phone" >
                                <template slot="prepend"><a style="color: red">* </a>电话</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div  style="width: 300px;">
                        <el-form-item prop="point">
                            <el-input v-model="form.point" >
                                <template slot="prepend">积分</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="space-container">
                        <el-button v-show="isAddVisible" icon="el-icon-delete" style="background-color: #F56C6C;color: white" @click="deleteDialog = true">删除</el-button>
                        <el-button v-show="!isAddVisible" @click="editVisible = false">取消</el-button>
                        <el-button type="primary" @click="saveMember">保存</el-button>
                    </div>
                </el-form>
                <el-dialog
                    title="确认删除该会员信息吗？"
                    width="400px"
                    :close-on-click-modal="false"
                    append-to-body
                    :visible.sync="deleteDialog">
                    <div class="space-container">
                        <el-button @click="deleteDialog = false">取 消</el-button>
                        <el-button style="background-color: #F56C6C;color: white" @click="deleteMember">确 认</el-button>
                    </div>
                </el-dialog>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {memberPage, updateMember, createMember, deleteMemberById, exportMembers} from '@api/member'
import {getSupIdById} from '@api/user'
import store from '../../../../store'
export default {
  name: 'member',
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
      if (value !== '' && !/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error('请输入正确的积分'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      isAddVisible: true,
      tableData: [],
      total: 0,
      editVisible: false,
      deleteDialog: false,
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
      },
      form: {
        id: '',
        phone: '',
        name: '',
        point: '',
        supId: '',
        createTime: ''
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' },
          {validator: validatePhoneNumber, message: '请输入正确电话号码', trigger: 'blur'}],
        point: [{validator: validateDouble, message: '请输入正确的积分', trigger: 'blur'}]
      }
    }
  },
  methods: {
    exportMembers () {
      exportMembers(this.query).then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = '会员资料.xls'
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    deleteMember () {
      deleteMemberById(this.form).then(res => {
        if (res.data) {
          this.$message.success('删除成功')
          this.deleteDialog = false
          this.editVisible = false
          this.getMemberPage()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    clickAdd () {
      this.editVisible = true
      this.isAddVisible = false
      for (const key in this.form) {
        this.form[key] = ''
      }
    },
    saveMember () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isAddVisible) {
            updateMember(this.form).then(res => {
              if (res.status) {
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            this.form.supId = this.query.supId
            createMember(this.form).then(res => {
              if (res.status) {
                this.$message.success(res.message)
                this.query.name = res.data
                this.getMemberPage()
                this.editVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    editRow (rowIndex) {
      this.editVisible = true
      this.isAddVisible = true
      // console.info(this.tableData[rowIndex])
      for (const key in this.form) {
        // 如果 data 对象中存在与 form 对象相同的属性
        if (this.tableData[rowIndex].hasOwnProperty(key)) {
          // 将 data 对象的属性值赋给 form 对象的相应属性
          this.form[key] = this.tableData[rowIndex][key]
        }
      }
    },
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
      this.total = res.data.total
    })
  }
}
</script>

<style scoped>
.space-container{
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
}
</style>
