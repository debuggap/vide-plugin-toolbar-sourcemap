<template>
  <div id="app" style="z-index:100">
    <error-info></error-info>
  </div>
</template>

<script>
import ErrorInfo from './components/ErrorInfo'

export default {
  name: 'app',
  components: {
    ErrorInfo
  }
}
</script>

<style>
#app {
  position: absolute;
  border: 1px solid #ccc;
  width: 600px;
  height: 550px;
  left: 50%;
  top: 50%;
  margin-left: -300px;
  margin-top: -275px;
  background-color: #fff;
  padding:10px;
  border-radius: 10px;
  overflow:auto
}
</style>
