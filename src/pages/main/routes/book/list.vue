<template>
<div>
    <el-card class="crumbs-card">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/main/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/main/bookList' }">图书列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-card>
    <template>
        <div class="block">
            <el-carousel height="150px">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small">{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>
    </template>
    <el-card class="container">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="书名">
                <el-input v-model="query.name" placeholder="书名"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="query.author" placeholder="作者"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getBooks">查询</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <template>
        <el-table
            :data="books"
            border
            style="width: 100%">
            <el-table-column
                prop="name"
                label="书名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="price"
                label="价格">
            </el-table-column>
            <el-table-column
                prop="author"
                label="作者">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>
        </el-table>
    </template>
    <div class="block">
        <el-pagination
            style="margin-top: 20px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.pageNo"
            :page-sizes="[10, 20, 30, 100]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="query.total">
        </el-pagination>
    </div>

</div>
</template>

<script>
import {getBookList} from '@api/book'
export default {
  name: 'list',
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      books: [],
      query: {
        name: '',
        author: '',
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    getBooks () {
      getBookList(this.query).then(res => {
        this.books = res.data.records
        console.info(res.data.total)
        this.query.total = res.data.total
      })
    },
    handleSizeChange (value) {
      this.query.pageSize = value
      this.getBooks()
    },
    handleCurrentChange (value) {
      this.query.pageNo = value
      this.getBooks()
    }
  },
  created () {
    this.getBooks()
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>
