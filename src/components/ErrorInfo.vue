<template>
  <div class="error-info">
  <div v-if="realStack">
    <div class="back">
      <i class="el-icon-arrow-left" @click="goBack()"></i>
    </div>
    <el-collapse v-model="activeName" @change="handleChange">
      <el-collapse-item class="collapse-left" v-for="(item, index) in realStack" :title="item.filepath + ':' + (item.row)" :name="index" :key="index" >
        <editor-item :id="index" :row="item.row" :html="item.html" :content="item.content"></editor-item>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div v-else>
    <el-alert v-if="errorTitle" :title="errorTitle" type="error" @close="closeError"></el-alert>
    <el-form ref="form" class="form" :model="form" label-width="80px" action="/showstack" method="post">
      <el-form-item label="map 地址">
        <el-input v-model="form.mapUrl" name="mapUrl"></el-input>
      </el-form-item>
      <el-form-item label="map文件名">
        <el-input v-model="form.mapName"></el-input>
      </el-form-item>
      <el-form-item label="map加密密钥">
        <el-input v-model="form.mapEncrypt" ></el-input>
      </el-form-item>
      <el-form-item label="错误信息">
        <el-input type="textarea" v-model="form.desc" name="desc" :rows="10"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="hidden" name="_csrf" v-model="form._csrf" />
        <el-button type="primary" @click="submitForm('form')" class="submitBtn">分析</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
import {Collapse, CollapseItem, Alert, Form, FormItem, Input, Button} from 'element-ui'
import EditorItem from './EditorItem'
import sourcemapStack from 'sourcemap-stack'

export default {
  name: 'error-info',
  data () {
    let sourcemapConfig
    try {
      sourcemapConfig = JSON.parse(localStorage.sourcemapConfig)
    } catch (e) {
      sourcemapConfig = {
        mapUrl: '',
        mapEncrypt: '',
        mapName: '[name].js.map'
      }
    }
    return {
      form: {
        mapUrl: sourcemapConfig.mapUrl,
        mapEncrypt: sourcemapConfig.mapEncrypt,
        mapName: sourcemapConfig.mapName,
        desc: `"TypeError: this.props.callback is not a function
    at t.close (http://127.0.0.1:8887/index.js:20:182335)
    at t.close (http://127.0.0.1:8887/index.js:20:184596)
    at HTMLUnknownElement.o (http://127.0.0.1:8887/index.js:6:45443)
    at Object.r.invokeGuardedCallback (http://127.0.0.1:8887/index.js:6:45548)
    at o (http://127.0.0.1:8887/index.js:6:42229)
    at Object.executeDispatchesInOrder (http://127.0.0.1:8887/index.js:6:44200)
    at h (http://127.0.0.1:8887/index.js:6:29078)
    at v (http://127.0.0.1:8887/index.js:6:29204)
    at Array.forEach (<anonymous>)
    at e.exports (http://127.0.0.1:8887/index.js:20:26753)"`
      },
      errorTitle: '',
      activeName: 0,
      realStack: null
    }
  },
  components: {
    EditorItem,
    'el-alert': Alert,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem
  },
  methods: {
    submitForm () {
      // get call stack
      const stacks = sourcemapStack.getStackByError(this.form.desc)
      // add map url
      sourcemapStack.getMapPath(stacks, this.form)
      // transform real path
      sourcemapStack.getRealStack(stacks, this.form).then((res) => {
        if (res.length > 0) {
          this.realStack = res
          this.activeName = 0
        } else if (res.message) {
          this.errorTitle = res.message
        }
      }).catch(() => {
        console.error(arguments)
      })
      // store config
      let storeData = {
        mapUrl: this.form.mapUrl,
        mapEncrypt: this.form.mapEncrypt,
        mapName: this.form.mapName
      }
      localStorage.sourcemapConfig = JSON.stringify(storeData)
    },
    goBack () {
      this.realStack = null
    },
    handleChange () {
      for (let i = 0; i < this.activeName.length; i++) {
        let key = this.activeName[i]
        if (global.ace.edit('editor' + key)) {
          setTimeout(() => {
            global.ace.edit('editor' + key).centerSelection()
          }, 500)
        }
      }
    },
    closeError () {
      this.errorTitle = null
    }
  }
}
</script>

<style scoped>
.error-info {
  font-weight: normal;
}
  
.form {
  margin-top:10px;
}

.back {
  text-align:left;
  margin-bottom:10px;
}
.submitBtn {
  width:100%;
}
.collapse-left {
  text-align:left
}

</style>
