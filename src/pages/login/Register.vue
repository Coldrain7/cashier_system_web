<template>
    <div class="container">
        <div class="login-wrapper">
            <div class="form-wrapper" id="register">
                <div class="header">新店铺注册</div>
                <input type="text" name="marketName" placeholder="店铺名称" class="input-item" v-model="market.name" required>
                <input type="text" name="username" placeholder="用户名" class="input-item" v-model="user.name">
                <input type="text" name="mail" placeholder="邮箱" class="input-item" v-model="user.mail">
                <input type="password" name="password" placeholder="密码" class="input-item" v-model="user.password">
                <input type="password" name="rePassword" placeholder="确认密码" class="input-item" v-model="rePassword">
                <div style="display: flex; align-items: center;">
                    <div style="margin-top: 15px"><input type="text" style="width: 84%" name="code" placeholder="验证码" class="input-item" v-model="code.code"></div>
                    <el-button class="btn1" @click="sendCode" :disabled="isDisabled" style="margin-left: 10px">{{this.message}}</el-button>
                </div>
                <el-button class="btn1" @click="userRegister">注册</el-button>
                <div class="lastPage">
                    <el-link target="_blank" icon="el-icon-d-arrow-left" @click="returnLogin">返回</el-link>
                </div>
            </div>
            <div class="login-wrapper"  id="registerMessage" style="display: none">
                <div class="message-header">注册成功！</div>
                <div class="message-form">
                    <header>您的店铺账号为：{{this.user.supId}}</header>
                    <header>您的登录账号为：{{this.user.id}}</header>
                </div>
                <div class="lastPage">
                    <el-link target="_blank" icon="el-icon-d-arrow-left" @click="returnLogin">返回</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {marketRegister} from '@api/supermarket'
import {adminRegister, registerMessage, sendCode, checkCode} from '@api/user'
export default {
  name: 'register',
  data () {
    return {
      message: '发送验证码',
      isDisabled: false,
      seconds: 0,
      market: {
        name: ''
      },
      rePassword: '',
      code: {
        code: ''
      },
      user: {
        id: '',
        supId: '',
        name: '',
        mail: '',
        password: '',
        type: '1'
      }
    }
  },
  methods: {
    returnLogin () {
      window.history.go(-1)
    },
    waitTime () {
      this.isDisabled = true
      this.message = this.seconds.toString()
      this.seconds--
      if (this.seconds > 0) {
        setTimeout(this.waitTime, 1000)
      } else {
        this.isDisabled = false
        this.message = '发送验证码'
      }
    },
    sendCode () {
      // console.info(this.query.to)
      if (this.user.mail !== '') {
        sendCode(this.user).then(res => {
          if (res.data) {
            // console.info(res.data)
            this.$message({
              message: '发送成功',
              type: 'success'
            })
            this.seconds = 20
            this.waitTime()
          } else {
            this.$message({
              message: '邮箱地址错误',
              type: 'warning'
            })
          }
        })
      } else {
        this.$message({
          message: '请填写邮箱',
          type: 'warning'
        })
      }
    },
    checkCode () {
      if (this.code !== '') {
        let result = checkCode(this.code).then(res => {
          // console.info(this.code)
          if (res.data === '验证成功') {
            this.$message({
              message: res.data,
              type: 'success'
            })
            return true
          } else {
            this.$message({
              message: res.data,
              type: 'warning'
            })
            return false
          }
        })
        return result
      } else {
        this.$message({
          message: '请输入验证码',
          type: 'warning'
        })
        return false
      }
    },
    userRegister () {
      var reg = /^[A-Za-z0-9]{1,20}$/
      if (this.market.name === '') {
        this.$message({
          message: '店铺名不能为空',
          type: 'warning'
        })
      } else if (this.user.name === '') {
        this.$message({
          message: '用户名不能为空',
          type: 'warning'
        })
      } else if (this.user.mail === '') {
        this.$message({
          message: '邮箱不能为空',
          type: 'warning'
        })
      } else if (this.user.password === '' || this.rePassword === '') {
        this.$message({
          message: '密码不能为空',
          type: 'warning'
        })
      } else if (this.user.password !== this.rePassword) {
        this.$message({
          message: '两次密码不一致',
          type: 'warning'
        })
      } else if (!reg.test(this.user.password)) {
        this.$message({
          message: '密码只能由小于20位的大小写字母和数字构成',
          type: 'warning'
        })
      } else if ((this.checkCode())) {
        marketRegister(this.market).then(res => {
          // console.info(res.data)
          this.user.supId = res.data
          return adminRegister(this.user) // 确保按照顺序执行下面的操作
        })
          .then(res => {
            this.user.id = res.data
            // console.info('显示id信息')
            // console.info(this.user.id) // 这里应该可以看到id了
          })
          .then(() => {
            // console.info(this.user) // 这里应该可以看到完整的user对象了
            registerMessage(this.user) // 确保传入的user对象是完整的
          })
        document.getElementById('register').style.display = 'none'
        document.getElementById('registerMessage').style.display = ''
      }
    }
  }

}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}
html {
    height: 100%;
}
body {
    height: 100%;
}
.container {
    height: 100%;
    background-image: url("../../assets/images/background.jpg");
    background-repeat:no-repeat;
    background-attachment:fixed;
    background-size:100% 100%;
}
.lastPage{
    .el-link {
        font-size: 15px;
    }
    margin-top: 50px;
}
.login-wrapper {
    background-color: #fff;
    width: 358px;
    height: 588px;
    border-radius: 15px;
    padding: 0 50px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.header {
    font-size: 30px;
    font-weight: bold;
    color: #92c6ed;
    text-align: center;
    line-height: 80px;
}
.input-item {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    border: 0;
    padding: 10px;
    border-bottom: 1px solid rgb(128, 125, 125);
    font-size: 15px;
    outline: none;
}
.input-item::placeholder {
    text-transform: uppercase;
}
.message-header{
    font-size: 30px;
    font-weight: bold;
    color: #92c6ed;
    text-align: center;
    line-height: 180px;
}
.message-form{
    font-size: 20px;
    font-weight: bold;
    color: black;
    line-height: 80px;
}
.btn {
    text-align: center;
    padding: 10px;
    width: 100%;
    margin-top: 40px;
    background-image: linear-gradient(to top, #92c6ed, #92c6ed);
    color: #fff;
}
.btn1 {
    text-align: center;
    margin:0px 0 0 0;
    padding: 10px;
    width: 100%;
    background-image: linear-gradient(to right, #92c6ed, #92c6ed);
    color: #fff;
}
.msg {
    text-align: center;
    line-height: 88px;
}
a {
    text-decoration-line: none;
    color: #92c6ed;
}
</style>
