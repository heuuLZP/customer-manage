<template>
  <div id="app">
    <customer />
  </div>
</template>

<script>
import Customer from './pages/Customer.vue'

export default {
  name: 'app',
  components: {
    Customer
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
}
</style>
