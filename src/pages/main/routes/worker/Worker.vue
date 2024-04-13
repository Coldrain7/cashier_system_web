<template>
  <div>
    <div>
    <el-form :inline="true" style="padding: 0px;text-align: right;">
      <el-form-item style="margin: 0px;padding-left: 10px">
        <el-input size="mini" v-model="query.name" placeholder="员工姓名"></el-input>
      </el-form-item>
      <el-form-item style="margin: 0px;">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchWorkers">搜索</el-button>
      </el-form-item>
      <el-form-item style="margin: 0px;padding-right: 10px">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addVisible=true">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
    <div>
      <el-table
          :data="tableData"
          :row-style="{height: 40 +'px'}"
          :cell-style="{padding:0+'px'}"
          border
          style="width: 100%">
        <el-table-column
            type="index"
            label="序号"
            width="80">
        </el-table-column>
        <el-table-column
            prop="id"
            label="员工号"
            width="200">
        </el-table-column>
        <el-table-column
            prop="name"
            label="员工姓名"
            width="240">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
            prop="mail"
            label="邮箱"
            width="240">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mail">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
            prop="password"
            label="密码"
            width="240">
          <template slot-scope="scope">
            <el-input v-model="scope.row.password">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="职位类型"
            :formatter="formatType"
            width="150">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="注册时间"
            :formatter="formatTime"
            width="180">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="saveWorker(scope.$index)">保存</el-button>
            <el-button type="text" size="small" @click="clickDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="350px" title="新增员工" :visible.sync="addVisible">
        <el-form :model="form" :rules="rules" ref="form"  label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
          <div  style="width: 300px;">
            <el-form-item prop="name">
              <el-input v-model="form.name" >
                <template slot="prepend">姓名</template>
              </el-input>
            </el-form-item>
          </div>
          <div  style="width: 300px;">
            <el-form-item prop="mail">
              <el-input v-model="form.mail" >
                <template slot="prepend">邮箱</template>
              </el-input>
            </el-form-item>
          </div>
          <div  style="width: 300px;">
            <el-form-item prop="password">
              <el-input v-model="form.password" :type="inputType">
                <template slot="prepend">密码</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item align="center">
            <el-button-group>
              <el-button :style="{ backgroundColor: cashierButtonColor, color:adminButtonColor }"
                         @click="chooseType(2)">收银员</el-button>
              <el-button :style="{ backgroundColor: adminButtonColor, color: cashierButtonColor}"
                         @click="chooseType(3)">管理员</el-button>
            </el-button-group>
          </el-form-item>
          <div class="space-container">
            <el-button @click="addVisible = false">取消</el-button>
            <el-button type="primary" @click="addWorker">保存</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog
          title="确认删除该员工信息吗？"
          width="400px"
          :close-on-click-modal="false"
          :visible.sync="deleteVisible">
        <div class="space-container">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button style="background-color: #F56C6C;color: white" @click="deleteWorker">确 认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// 只有店主才能进入此页
import store from '../../../../store'
import {getSupIdById, getSupWorkers, getWorkersByName, deleteWorkerById, updateWorkerById, createWorker} from '@api/user'
export default {
  name: 'worker',
  data () {
    return {
      id: 0,
      tableData: [],
      deleteVisible: false,
      addVisible: false,
      showPassword: false,
      query: {
        supId: 0,
        name: ''
      },
      form: {
        supId: 0,
        name: '',
        mail: '',
        type: 2
      },
      lastName: '',
      rowIndex: 0,
      cashierButtonColor: '#4B9EFF',
      adminButtonColor: 'white',
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    inputType () {
      return this.showPassword ? 'text' : 'password'
    },
    chooseType (type) {
      if (type === 2) {
        this.cashierButtonColor = '#4B9EFF'
        this.adminButtonColor = 'white'
      } else {
        this.cashierButtonColor = 'white'
        this.adminButtonColor = '#4B9EFF'
      }
      this.form.type = type
    },
    addWorker () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          createWorker(this.form).then(res => {
            if (res.status) {
              this.$message.success('创建成功')
              this.getWorkers()
              this.addVisible = false
              this.form.name = ''
              this.form.type = 2
              this.form.mail = ''
              this.cashierButtonColor = '#4B9EFF'
              this.adminButtonColor = 'white'
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    clickDelete (index) {
      this.deleteVisible = true
      this.rowIndex = index
    },
    deleteWorker () {
      if (this.tableData[this.rowIndex]['type'] !== 1) { // 不是店主就都能删除
        deleteWorkerById({id: this.tableData[this.rowIndex]['id']}).then(res => {
          if (res.data) {
            this.$message.success('删除成功')
            this.getWorkers()
            this.deleteVisible = false
          } else {
            this.$message.error('删除失败')
          }
        })
      } else {
        this.$message.error('操作失败，不能删除')
      }
    },
    getWorkers () {
      getSupWorkers(this.query).then(res => {
        this.tableData = res.data
      })
    },
    saveWorker (index) {
      let worker = {}
      worker.id = this.tableData[index]['id']
      worker.name = this.tableData[index]['name']
      worker.mail = this.tableData[index]['mail']
      worker.password = this.tableData[index]['password']
      updateWorkerById(worker).then(res => {
        if (res.data) {
          this.$message.success('保存成功')
          this.getWorkers()
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    searchWorkers () {
      getWorkersByName(this.query).then(res => {
        this.tableData = res.data
      })
    },
    formatType (row) {
      if (row.type === 1) {
        return '店主'
      } else if (row.type === 2) {
        return '收银员'
      } else {
        return '管理员'
      }
    },
    formatTime (row) {
      const date = new Date(row.createTime)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }
  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
      this.form.supId = res.data
      return getSupWorkers(this.query)
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
