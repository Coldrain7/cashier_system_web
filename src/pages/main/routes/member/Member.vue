<template>
    <div>
        <el-checkbox-group v-model="checkedCities" @change="showInfo">
            <el-checkbox label="t">上海</el-checkbox>
            <el-checkbox label="e">北京</el-checkbox>
            <el-checkbox label="s">广州</el-checkbox>
            <el-checkbox label="a">深圳</el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
const cityOptions = ['上海', '北京', '广州', '深圳']
export default {
  name: 'member.vue',
  data () {
    return {
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    showInfo () {
      console.info(this.checkedCities)
    }

  }
}
</script>

<style scoped>

</style>
