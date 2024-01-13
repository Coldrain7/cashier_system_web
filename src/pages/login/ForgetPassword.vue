<template>
    <div class="container" >
        <div class="login-wrapper"  id="identity" >
            <div class="header">请输入信息</div>
            <div class="form-wrapper">
                <input type="text" name="to" placeholder="邮箱" class="input-item" v-model="query.to" style="width: 94%">
                <div style="display: flex; align-items: center;">
                    <div style="margin-top: 16px"><input type="text" style="width: 84%" name="code" placeholder="验证码" class="input-item" v-model="query.code"></div>
                    <el-button class="btn1" @click="sendCode" :disabled="isDisabled" style="margin-left: 10px">{{this.message}}</el-button>
                </div>
                <el-button class="btn2" @click="checkCode">验证</el-button>
            </div>
            <div class="lastPage">
                <el-link target="_blank" icon="el-icon-d-arrow-left" @click="returnLogin">返回</el-link>
            </div>
        </div>
        <div class="login-wrapper"  id="password" style="display: none">
            <div class="header">修改密码</div>
            <div class="form-wrapper">
                <input type="text" name="password" placeholder="密码" class="input-item" v-model="password">
                <input type="password" name="verifyPassword" placeholder="确认密码" class="input-item" v-model="verifyPassword">
                <el-button class="btn" @click="changePasswordById" >修改</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {changePasswordById, sendCode, checkCode, getUserByMail} from '@api/user'
export default {
  name: 'forgotPassword',
  data: function () {
    return {
      username: '',
      identity: '',
      password: '',
      verifyPassword: '',
      id: '',
      query: {
        code: '',
        to: ''
      },
      isDisabled: false,
      seconds: 0,
      message: '发送验证码'
    }
  },
  methods: {
    nextStep () {
      getUserByMail({mail: this.query.to}).then(res => {
        // 这里的res就是后端直接返回的json数据
        if (res.data !== null) {
          console.info(res)
          this.id = res.data.id
          document.getElementById('identity').style.display = 'none'
          document.getElementById('password').style.display = ''
        } else {
          this.$message({
            message: '输入的用户名或身份证号码错误',
            type: 'warning'
          })
        }
      })
      // getUserByUsernameAndIdentity({username: this.username, identity: this.identity}).then(res => {
      //   // 这里的res就是后端直接返回的json数据
      //   if (res.data !== null) {
      //     this.id = res.data.id
      //     document.getElementById('identity').style.display = 'none'
      //     document.getElementById('password').style.display = ''
      //   } else {
      //     this.$message({
      //       message: '输入的用户名或身份证号码错误',
      //       type: 'warning'
      //     })
      //   }
      // })
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
      if (this.query.to !== '') {
        sendCode(this.query).then(res => {
          // console.info(res.data)
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.seconds = 20
          this.waitTime()
        })
      } else {
        this.$message({
          message: '请填写邮箱',
          type: 'warning'
        })
      }
    },
    checkCode () {
      if (this.query.code !== '') {
        checkCode(this.query).then(res => {
          if (res.data === '验证成功') {
            this.$message({
              message: '验证成功',
              type: 'success'
            })
            this.nextStep()
          } else {
            this.$message({
              message: res.data,
              type: 'warning'
            })
          }
        })
      } else {
        this.$message({
          message: '请输入验证码',
          type: 'warning'
        })
      }
    },
    changePasswordById () {
      this.$confirm('是否确定修改密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var reg = /^[A-Za-z0-9]{1,20}$/
        if (this.password !== this.verifyPassword) {
          this.$message({
            message: '两次密码输入不一致',
            type: 'warning'
          })
        } else if (!reg.test(this.password)) {
          this.$message({
            message: '密码只能由小于20位的大小写字母和数字构成',
            type: 'warning'
          })
        } else {
          changePasswordById({id: this.id, password: this.password}).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            // 可能是异步的方式运行的，放在外面的话不会显示提示
            this.$router.push({path: '/login'})
          })
        }
      }).catch(() => {
      })
    },
    returnLogin () {
      window.history.go(-1)
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
    font-size: 38px;
    font-weight: bold;
    color: #92c6ed;
    text-align: center;
    line-height: 200px;
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
.btn {
    text-align: center;
    padding: 10px;
    width: 100%;
    margin-top: 40px;
    background-image: linear-gradient(to right, #92c6ed, #92c6ed);
    color: #fff;
}

.btn1 {
    text-align: center;
    padding: 10px;
    width: 40%;
    margin-top: 0px;
    background-image: linear-gradient(to right, #92c6ed, #92c6ed);
    color: #fff;
}
.btn2 {
    text-align: center;
    margin:20px 0 0 0;
    padding: 10px;
    width: 100%;
    background-image: linear-gradient(to right, #92c6ed, #92c6ed);
    color: #fff;
}
.lastPage{
    .el-link {
        font-size: 15px;
    }
    margin-top: 50px;
}
.msg {
    text-align: center;
    line-height: 88px;
}
a {
    text-decoration-line: none;
    color: #92c6ed;
}
.custom-label {
    display: inline-block;
    text-align: left;
    font-size: 16px; /* 设置字体大小 */
    width: 100px; /* 设置标签宽度，可根据需要调整 */
}
</style>
