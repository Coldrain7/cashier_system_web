<template>
<div>
    <div>
        <el-form :inline="true" style="padding: 0px;text-align: right;">
            <el-form-item style="margin: 0px;padding-left: 10px">
                <el-input size="mini" v-model="name" placeholder="商品名称/条码"></el-input>
            </el-form-item>
            <el-form-item style="margin: 0px;">
                <el-button type="primary" icon="el-icon-search" @click="searchCombinations" size="mini">搜索</el-button>
            </el-form-item>
            <el-form-item style="margin: 0px;">
                <el-button type="primary" icon="el-icon-plus" @click="drawerVisible = true" size="mini">新增</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div>
        <el-table
                :row-style="{height: 40 +'px'}"
                :cell-style="{padding:0+'px'}"
                :data="tableData"
                style="width: 100%;"
                border>
            <el-table-column
                    type="index"
                    label="序号"
                    width="50px">
            </el-table-column>
            <el-table-column
                    prop="parentName"
                    label="组合后商品"
                    width="180px">
            </el-table-column>
            <el-table-column
                prop="parentBarcode"
                label="组合后商品条码"
                width="180px">
            </el-table-column>
            <el-table-column
                prop="parentPurchasePrice"
                label="组合后商品进价"
                width="120px">
            </el-table-column>
            <el-table-column
                prop="childSpecification"
                label="规格"
                width="100px">
            </el-table-column>
            <el-table-column
                prop="childName"
                label="拆分后商品"
                width="180px">
            </el-table-column>
            <el-table-column
                prop="childBarcode"
                label="拆分后商品条码"
                width="180px">
            </el-table-column>
            <el-table-column
                prop="childPurchasePrice"
                label="拆分后商品进价"
                width="120px">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="70px">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editRow(scope.$index)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--点击新增商品后弹出的抽屉-->
        <el-drawer :visible.sync="drawerVisible" size="610px" :with-header="false">
            <el-form :model="parentCommodity" label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
                <div  style="width: 600px;">
                    <el-form-item>
                        <el-input
                            placeholder="输入条码查询获取商品信息"
                            v-model="parentQuery.barcode" >
                            <template slot="prepend">组合商品主条码</template>
                            <el-button class="search-button" slot="append" icon="el-icon-search"
                                       @click="searchCommodity(1)"></el-button>
                        </el-input>
                    </el-form-item>
                </div>
                <div  style="width: 600px;">
                    <el-form-item prop="name">
                        <el-input :disabled="true" v-model="parentCommodity.name" >
                            <template slot="prepend">商品名称</template>
                        </el-input>
                    </el-form-item>
                </div>
                <div class="flex-container">
                    <div style="width: 300px">
                        <el-form-item prop="barcode">
                            <el-input :disabled="true" v-model="parentCommodity.barcode">
                                <template slot="prepend">商品条码</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div style="width: 300px">
                        <el-form-item prop="barcode">
                            <el-input :disabled="true" v-model="parentCommodity.purchasePrice">
                                <template slot="prepend">商品进价</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <el-divider></el-divider>
            <div class="space-container">
                <div style="width: 280px">
                    <el-input :disabled="true" v-model="specification.firstNum">
                        <template slot="prepend">组合后的数量</template>
                    </el-input>
                </div>
                <span style="padding-top: 8px;font-size: 25px">=</span>
                <div style="width: 280px">
                    <el-input v-model="specification.secondNum" @blur="handleSpecificationInput">
                        <template slot="append">拆分后的数量</template>
                    </el-input>
                </div>
            </div>
            <el-divider></el-divider>
            <el-form :model="childCommodity" label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
                <div  style="width: 600px;">
                    <el-form-item>
                        <el-input
                            placeholder="输入条码查询获取商品信息"
                            v-model="childQuery.barcode" >
                            <template slot="prepend">拆分后商品条码</template>
                            <el-button class="search-button" slot="append" @click="searchCommodity(0)" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </div>
                <div  style="width: 600px;">
                    <el-form-item prop="name">
                        <el-input :disabled="true" v-model="childCommodity.name" >
                            <template slot="prepend">商品名称</template>
                        </el-input>
                    </el-form-item>
                </div>
                <div class="flex-container">
                    <div style="width: 300px">
                        <el-form-item prop="barcode">
                            <el-input :disabled="true" v-model="childCommodity.barcode">
                                <template slot="prepend">商品条码</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div style="width: 300px">
                        <el-form-item prop="barcode">
                            <el-input @blur="handleChildInput" v-model="childCommodity.purchasePrice">
                                <template slot="prepend">商品进价</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div style="margin-top: 50px;display: flex;justify-content: flex-end;padding-right:20px">
                    <el-button type="primary" @click="saveNewCombination">保存</el-button>
            </div>
        </el-drawer>
        <!--点击表格中编辑后弹出的抽屉-->
        <el-drawer :visible.sync="editVisible" size="610px" :with-header="false">
            <el-form :model="form" label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
                <div  style="width: 600px;">
                    <el-form-item prop="name">
                        <el-input :disabled="true" v-model="form.parentName" >
                            <template slot="prepend">商品名称</template>
                        </el-input>
                    </el-form-item>
                </div>
                <div class="flex-container">
                    <div style="width: 300px">
                        <el-form-item prop="barcode">
                            <el-input :disabled="true" v-model="form.parentBarcode">
                                <template slot="prepend">商品条码</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div style="width: 300px">
                        <el-form-item prop="barcode">
                            <el-input  :disabled="true" v-model="form.parentPurchasePrice">
                                <template slot="prepend">商品进价</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <el-divider></el-divider>
            <div class="space-container">
                <div style="width: 280px">
                    <el-input :disabled="true" v-model="specification.firstNum">
                        <template slot="prepend">组合后的数量</template>
                    </el-input>
                </div>
                <span style="padding-top: 8px;font-size: 25px">=</span>
                <div style="width: 280px">
                    <el-input @blur="handleSpecificationInput" v-model="specification.secondNum">
                        <template slot="append">拆分后的数量</template>
                    </el-input>
                </div>
            </div>
            <el-divider></el-divider>
            <el-form :model="form" label-width="0px" label-position="left" style="padding-top: 50px; padding-left: 5px">
                <div  style="width: 600px;">
                    <el-form-item prop="name">
                        <el-input :disabled="true" v-model="form.childName" >
                            <template slot="prepend">商品名称</template>
                        </el-input>
                    </el-form-item>
                </div>
                <div class="flex-container">
                    <div style="width: 300px">
                        <el-form-item prop="barcode">
                            <el-input :disabled="true" v-model="form.childBarcode">
                                <template slot="prepend">商品条码</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div style="width: 300px">
                        <el-form-item prop="barcode">
                            <el-input @blur="handleChildInput" v-model="childCommodity.purchasePrice">
                                <template slot="prepend">商品进价</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div style="margin-top: 100px">
                <div class="space-container">
                    <el-button icon="el-icon-delete" style="background-color: #F56C6C;color: white" @click="deleteDialog = true">删除</el-button>
                    <el-button type="primary" @click="saveNewCombination">保存</el-button>
                </div>
            </div>
            <el-dialog
                title="确认删除数据吗？"
                :close-on-click-modal="false"
                append-to-body
                :visible.sync="deleteDialog">
                <div class="space-container">
                    <el-button @click="deleteDialog = false">取 消</el-button>
                    <el-button style="background-color: #F56C6C;color: white" @click="deleteCombination">确 认</el-button>
                </div>
            </el-dialog>
        </el-drawer>
    </div>
</div>
</template>

<script>
import {getCombinations, getCommodityByBarcode, updateCommodity, getCommodityById, deleteCombination,
  searchCombinations, isCombined} from '@api/commodity'
import {getSupIdById} from '@api/user'
import store from '../../../../store'
export default {
  name: 'Combination',
  data () {
    return {
      supId: '',
      userId: '',
      name: '',
      deleteDialog: false,
      tableData: [],
      drawerVisible: false,
      editVisible: false,
      parentQuery: {
        supId: '',
        barcode: '',
        id: ''
      },
      childQuery: {
        supId: '',
        barcode: '',
        id: ''
      },
      parentCommodity: {},
      childCommodity: {},
      childPrice: 1,
      specification: {
        firstNum: 1,
        secondNum: 1,
        lastValue: 1
      },
      form: {
        supId: '',
        parentId: '',
        parentName: '',
        parentBarcode: '',
        parentPurchasePrice: '',
        childSpecification: '',
        childId: '',
        childName: '',
        childBarcode: '',
        childPurchasePrice: '',
        parent: ''
      }
    }
  },
  methods: {
    searchCombinations () {
      searchCombinations({supId: this.supId, name: this.name}).then(res => {
        this.tableData = res.data
      })
    },
    deleteCombination () {
      this.childCommodity.createTime = ''
      this.childCommodity.updateTime = ''
      this.childCommodity.parent = null
      deleteCombination(this.childCommodity).then(res => {
        if (res.data) {
          this.$message.success('删除成功')
          this.deleteDialog = false
          this.editVisible = false
          this.getCombinations()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    formatNumber (num, decimalPlaces) {
    // 检查decimalPlaces是否为整数且大于等于0
      if (decimalPlaces !== Math.floor(decimalPlaces) || decimalPlaces < 0) {
        return 'Invalid decimal places'
      }
      // 如果num为整数或decimalPlaces为0，则直接转换为字符串并返回
      if (num % 1 === 0 || decimalPlaces === 0) {
        return num.toString()
      }

      // 使用toFixed()方法格式化并返回字符串
      return num.toFixed(decimalPlaces)
    },
    handleChildInput () {
      // 使用正则表达式匹配数字和小数点
      const regex = /^\d+(\.\d+)?$/ // 允许以小数点开头，但后面必须有数字
      if (regex.test(this.childCommodity.purchasePrice)) {
        // 如果输入的值符合正则表达式，则更新数据属性并保存为最新合法值
        this.childPrice = this.childCommodity.purchasePrice
        if (this.parentCommodity.id > 0 && this.childCommodity.id > 0) {
          let res = this.parentCommodity.purchasePrice / this.childCommodity.purchasePrice
          this.specification.secondNum = this.formatNumber(res, 2)
          this.specification.lastValue = this.specification.secondNum
        }
      } else {
        // 如果输入的值不符合正则表达式，则回退到上一个合法值
        this.this.childCommodity.purchasePrice = this.childPrice
      }
    },
    handleSpecificationInput () {
      // 使用正则表达式匹配数字和小数点
      const regex = /^\d+(\.\d+)?$/ // 允许以小数点开头，但后面必须有数字
      if (regex.test(this.specification.secondNum)) {
        // 如果输入的值符合正则表达式，则更新数据属性并保存为最新合法值
        this.specification.lastValue = this.specification.secondNum
        if (this.parentCommodity.id > 0 && this.childCommodity.id > 0) {
          let res = this.parentCommodity.purchasePrice / this.specification.secondNum
          this.childCommodity.purchasePrice = this.formatNumber(res, 2)
          this.childPrice = this.childCommodity.purchasePrice
        }
      } else {
        // 如果输入的值不符合正则表达式，则回退到上一个合法值
        this.specification.secondNum = this.specification.lastValue
      }
    },
    getCombinations () {
      getCombinations({supId: this.supId}).then(res => {
        this.tableData = res.data
      })
    },
    saveNewCombination () {
      if (this.parentCommodity.id > 0 && this.childCommodity.id > 0) {
        this.parentCommodity.createTime = ''
        this.parentCommodity.updateTime = ''
        isCombined(this.parentCommodity).then(res => {
          if (res.data) {
            this.$message.error(res.message)
            // 如果res.data为true，则不执行后续操作，这里可以添加return来提前终止Promise链
            return
          }

          // res.data为false，执行以下操作
          this.childCommodity.parent = this.parentCommodity.id
          this.childCommodity.specification = '1x' + this.specification.secondNum
          this.childCommodity.createTime = ''
          this.childCommodity.updateTime = ''

          // 调用updateCommodity并处理返回的Promise
          return updateCommodity(this.childCommodity).then(updateRes => {
            if (updateRes.status) {
              if (updateRes.data) {
                this.$message.success('保存成功')
                this.drawerVisible = false
                this.getCombinations()
              } else {
                this.$message.error('保存失败')
              }
            } else {
              this.$message.error(updateRes.message)
            }
          })
        }).catch(error => {
          // 处理isCombined或updateCommodity中可能出现的错误
          this.$message.error('操作中发生错误：' + error.message)
        })
      }
    },
    editRow (rowIndex) {
      this.form = this.tableData[rowIndex]
      this.childQuery.id = this.form.childId
      getCommodityById(this.childQuery).then(res => {
        this.childCommodity = res.data
        this.childPrice = this.childCommodity.purchasePrice
        let result = this.form.parentPurchasePrice / this.childCommodity.purchasePrice
        this.specification.secondNum = this.formatNumber(result, 2)
        this.specification.lastValue = this.specification.secondNum
        this.parentQuery.id = this.form.parentId
        return getCommodityById(this.parentQuery)
      }).then(res => {
        this.parentCommodity = res.data
      })
      this.editVisible = true
    },
    searchCommodity (val) {
      if (val) {
        getCommodityByBarcode(this.parentQuery).then(res => {
          if (res.status) {
            this.parentCommodity = res.data
            if (this.childCommodity.id > 0) {
              let res = this.parentCommodity.purchasePrice / this.childCommodity.purchasePrice
              this.specification.secondNum = this.formatNumber(res, 2)
              this.specification.lastValue = this.specification.secondNum
            }
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        getCommodityByBarcode(this.childQuery).then(res => {
          if (res.status) {
            this.childCommodity = res.data
            this.childPrice = this.childCommodity.purchasePrice
            if (this.parentCommodity.id > 0) {
              this.specification.secondNum = this.parentCommodity.purchasePrice / this.childCommodity.purchasePrice
            }
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  },
  created () {
    this.userId = store.getters['user/getUserId']
    getSupIdById({id: this.userId}).then(res => {
      this.supId = res.data
      this.parentQuery.supId = res.data
      this.childQuery.supId = res.data
      return getCombinations({supId: this.supId}).then(res => {
        this.tableData = res.data
      })
    })
  }
}
</script>

<style scoped>
.search-button:hover{
    background-color: #67C23A;
    color: white;
}
.flex-container{
    display: flex;
}
.space-container{
     display: flex;
     justify-content: space-between;
     padding-left: 20px;
     padding-right: 20px;
 }
</style>
