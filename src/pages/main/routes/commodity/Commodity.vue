<template>
  <div>
      <el-table
          :data="tableData"
          :row-style="{height: 40 +'px'}"
          :cell-style="{padding:0+'px'}"
          :height="tableHeight"
          border
          style="width: 100%">
          <el-table-column
              type="index"
              :index="indexMethod"
              label="序号"
              width="50">
          </el-table-column>
          <el-table-column
              prop="name"
              label="商品名称"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="barcode"
              label="条码"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="classification.classification"
              label="分类"
              width="180">
          </el-table-column>
          <el-table-column
              prop="inventory"
              label="库存"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="unit"
              label="单位"
              width="180">
          </el-table-column>
          <el-table-column
              prop="purchasePrice"
              label="进货价"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="price"
              label="销售价"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="isDiscount"
              :formatter="formatDiscount"
              label="会员折扣"
              width="180">
          </el-table-column>
          <el-table-column
              prop="supplier"
              label="供货商"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="produceDate"
              :formatter="formatDate"
              label="生产日期"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="expirationTime"
              label="保质期"
              :formatter="formatExpiration"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              :formatter="formatTime"
              sortable
              width="180">
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
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
</template>

<script>
import { commodityPage } from '@api/commodity'
export default {
  name: 'Second',
  data () {
    return {
      index: 1,
      tableData: [],
      tableHeight: window.innerHeight - 100, // 表格动态高度
      total: '',
      query: {
        pageNo: 1,
        pageSize: 20,
        name: ''
      }
    }
  },
  methods: {
    getCommodities () {
      commodityPage(this.query).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        console.info(res.data)
      })
    },
    formatTime (row) {
      const date = new Date(row.createTime)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    formatDate (row) {
      if (row.produceDate !== null) {
        const date = new Date(row.produceDate)
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      }
    },
    formatDiscount (row) {
      if (row.isDiscount) {
        return '是'
      } else {
        return '否'
      }
    },
    formatExpiration (row) {
      if (row.expirationTime !== null) {
        return row.expirationTime.toString() + '天'
      }
    },
    handleSizeChange (value) {
      this.query.pageSize = value
      this.getCommodities()
    },
    handleCurrentChange (value) {
      this.query.pageNo = value
      this.getCommodities()
    },
    indexMethod (index) {
      return (this.query.pageNo - 1) * this.query.pageSize + index + 1
    }
  },
  created () {
    this.getCommodities()
  },
  mounted: function () {
    // window.onresize:浏览器尺寸变化响应事件
    window.onresize = () => {
      return (() => {
        // window.innerHeight:浏览器的可用高度
        this.tableHeight = window.innerHeight - 100
        console.info(this.tableHeight)
      })()
    }
  }

}
</script>
