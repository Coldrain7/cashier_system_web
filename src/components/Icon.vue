<template>
<!--  <svg-->
<!--    class="icon"-->
<!--    aria-hidden="true"-->
<!--  >-->
<!--    <use :xlink:href="`#${icon}`"></use>-->
<!--  </svg>-->
  <i :class="icon"></i>
</template>

<script>
export default {
  name: 's-icon',
  props: {
    icon: String
  }
}
</script>
