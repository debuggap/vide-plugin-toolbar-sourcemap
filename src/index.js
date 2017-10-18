import App from './App.vue'
import path from 'path'
export default ({editor, store, view, packageInfo, ace, baseClass}) => {
  let isCreated = false
  global.ace = ace
  // add item to toolbar
  store.dispatch('toolbar/addItem', {
    name: 'vide-plugin-toolbar-sourcemap',
    desc: 'debug online js bug',
    key: 'videPluginToolbarSourcemapItem',
    icon: '',
    func: 'videPluginToolbarSourcemap:click'
    // longTap: 'videPluginToolbarSourcemap:longTap'//工具栏按钮支持长按事件
  })
  // return execute class
  return class videPluginToolbarSourcemap extends baseClass {
    click () {
      if (isCreated) {
        this.$destroy()
        isCreated = false
      } else {
        isCreated = true
        let stylePath = path.join(packageInfo.path, './dist/index.css')
        this.$mount({app: App, stylePath})
      }
    }
    $clean () {
      store.dispatch('toolbar/deleteItem', 'videPluginToolbarSourcemapItem')
    }
  }
}
