<template>
  <div></div>
</template>
<script>
import store from '../../../../store'
import {getSupIdById} from '@api/user'
export default {
  data () {
    return {
      id: '',
      query: {
        supId: ''
      }
    }
  },
  methods: {

  },
  created () {
    this.id = store.getters['user/getUserId']
    getSupIdById({id: this.id}).then(res => {
      this.query.supId = res.data
    })
  }
}
</script>
<style scoped>

</style>
