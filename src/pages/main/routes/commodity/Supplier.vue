<template>
<div>
  <div>
    <el-form :inline="true" style="padding: 0px;text-align: right;">
      <el-form-item style="margin: 0px;padding-left: 10px">
        <el-input size="mini" v-model="query.name" placeholder="供应商名称/编号"></el-input>
      </el-form-item>
      <el-form-item style="margin: 0px;">
        <el-button type="primary" icon="el-icon-search" @click="getSupplierPage" size="mini">搜索</el-button>
      </el-form-item>
      <el-form-item style="margin: 0px;">
        <el-button type="primary" icon="el-icon-plus" @click="clickAdd" size="mini">新增</el-button>
      </el-form-item>
      <el-form-item style="margin: 0px;padding-right: 20px">
        <el-button type="primary" icon="el-icon-download" @click="exportSuppliers" size="mini">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <el-table
        :data="tableData"
        :row-style="{height: 40 +'px'}"
        :cell-style="{padding:0+'px'}"
        @sort-change="handleSortChange"
        border
        style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="number"
          label="编号"
          sortable="custom"
          width="240">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          sortable="custom"
          width="500">
      </el-table-column>
      <el-table-column
          prop="linkman"
          label="联系人"
          width="240">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话"
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
  </div>
  <el-dialog width="500px" title="供应商信息" :visible.sync="dialogVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="0px"
             label-position="left" style="padding-top: 50px; padding-left: 5px">
      <div  style="width: 450px;">
        <el-form-item prop="name">
          <el-input v-model.trim="form.name" >
            <template slot="prepend"><a style="color: red">* </a>供应商</template>
          </el-input>
        </el-form-item>
      </div>
      <div  style="width: 450px;">
        <el-form-item prop="number">
          <el-input v-model.trim="form.number" >
            <template slot="prepend"><a style="color: red">* </a>编 号</template>
          </el-input>
        </el-form-item>
      </div>
      <div  style="width: 450px;">
        <el-form-item prop="linkman">
          <el-input v-model.trim="form.linkman" >
            <template slot="prepend">联系人</template>
          </el-input>
        </el-form-item>
      </div>
      <div  style="width: 450px;">
        <el-form-item prop="phone">
          <el-input v-model.trim="form.phone" >
            <template slot="prepend">电 话</template>
          </el-input>
        </el-form-item>
      </div>
      <div class="space-container">
        <el-button v-show="!isAddVisible" icon="el-icon-delete" style="background-color: #F56C6C;color: white" @click="deleteDialog = true">删除</el-button>
        <el-button v-show="isAddVisible" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSupplier">保存</el-button>
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
        <el-button style="background-color: #F56C6C;color: white" @click="deleteSupplier">确 认</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</div>
</template>
<script>
import store from '../../../../store'
import {getSupplier, getSupplierById, updateSupplier, createSupplier, deleteById, exportSuppliers} from '@api/supplier'
import {getSupIdById} from '@api/user'
export default {
  name: 'Supplier',
  data () {
    var validatePhoneNumber = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!/^\d{11}$/.test(value)) {
        callback(new Error('请输入正确电话号码'))
      } else {
        callback()
      }
    }
    var validateNumber = (rule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      dialogVisible: false,
      tableData: [],
      isAddVisible: false,
      deleteDialog: false,
      query: {
        supId: '',
        name: '',
        prop: '',
        order: ''
      },
      form: {
        id: '',
        supId: '',
        name: '',
        phone: '',
        linkman: '',
        number: ''
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '编号不能为空', trigger: 'blur' },
          {validator: validateNumber, message: '请输入数子', trigger: 'blur'}],
        phone: [{validator: validatePhoneNumber, message: '请输入正确电话号码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    exportSuppliers () {
      exportSuppliers(this.query).then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = '供应商资料.xls'
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    deleteSupplier () {
      deleteById(this.form).then(res => {
        if (res.data) {
          this.$message.success('删除成功')
          this.getSupplierPage()
          this.deleteDialog = false
          this.dialogVisible = false
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    getOneSupplier (sid) {
      getSupplierById({id: sid}).then(res => {
        this.tableData = []
        this.tableData.push(res.data)
      })
    },
    saveSupplier () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.supId = this.query.supId
          if (this.isAddVisible) {
            createSupplier(this.form).then(res => {
              if (res.status) {
                this.$message.success(res.message)
                this.getOneSupplier(res.data)
                this.dialogVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            updateSupplier(this.form).then(res => {
              if (res.status) {
                this.$message.success(res.message)
                this.getSupplierPage()
                this.dialogVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    editRow (rowIndex) {
      this.dialogVisible = true
      this.isAddVisible = false
      // console.info(this.tableData[rowIndex])
      for (const key in this.form) {
        // 如果 data 对象中存在与 form 对象相同的属性
        if (this.tableData[rowIndex].hasOwnProperty(key)) {
          // 将 data 对象的属性值赋给 form 对象的相应属性
          this.form[key] = this.tableData[rowIndex][key]
        }
      }
    },
    clickAdd () {
      this.dialogVisible = true
      this.isAddVisible = true
      for (const key in this.form) {
        this.form[key] = ''
      }
    },
    getSupplierPage () {
      getSupplier(this.query).then(res => {
        this.tableData = res.data
      })
    },
    handleSortChange ({ prop, order }) {
      console.info('进入handleSortChange')
      this.query.prop = prop
      this.query.order = order
      this.getSupplierPage()
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.form.supId = res.data
      return getSupplier(this.query)
    }).then(res => {
      this.tableData = res.data
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
