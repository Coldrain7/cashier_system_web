<template>
    <div class="container">
        <div class="login-wrapper">
            <div class="header">收银管理系统</div>
            <div class="form-wrapper">
                <input type="text" name="username" placeholder="账号" class="input-item" v-model="user.id">
                <input type="password" name="password" placeholder="密码" class="input-item" v-model="user.password">
                <el-button class="btn" @click="login">登录</el-button>
                <el-button class="btn1" @click="toRegister">注册</el-button>
            </div>
            <div class="msg">
                忘记密码?
                <a href="/#/forgetPassword">点击这里</a>
            </div>
        </div>
    </div>
</template>

<script>
import { userLogin } from '@api/user'
export default {
  name: 'login',
  data () {
    return {
      user: {
        password: '123456',
        id: '100000000'
      }
    }
  },
  methods: {
    // 不用axios直接发，要用封装的
    login () {
      // axios.post('xxxx', yyy)
      userLogin(this.user).then(res => {
        // 这里的res就是后端直接返回的json数据
        if (res.data === undefined) {
          // 没有这个用户
          this.$message({
            message: '用户名或密码不对，请重新输入',
            type: 'warning'
          })
        } else {
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.$router.push({path: '/main'})
        }
      })
    },
    toRegister () {
      this.$router.push({path: '/register'})
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
    background-image: linear-gradient(to top, #92c6ed, #92c6ed);
    color: #fff;
}
.btn1 {
    text-align: center;
    margin:20px 0 0 0;
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
