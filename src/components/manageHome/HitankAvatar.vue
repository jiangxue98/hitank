<template>
  <div>
    <a-avatar :icon="name?'':'user'" :style="color" :size="size">
      {{avatarName}}
    </a-avatar>
  </div>
</template>

<script>
import util from '@util/util'
export default {
  props: {
    size: {
      type: Number,
      default () {
        return 32
      }
    },
    role: {
      type: String,
      default () {
        return 'user'
      }
    },
    name: {
      type: String
    }
  },
  components: {},
  data () {
    return {
      avatarName: '',
      color: ''
    }
  },
  methods: {
    init () {
      if (this.name) {
        let name = this.name
        if (util.isChinese(name)) {
          this.avatarName = name.slice(-2)
        } else {
          this.avatarName = name.slice(0, 5)
        }
      }
      switch (this.role) {
        case 'admin':
          this.color = 'background:#FF4D4F;color:#fff'
          break
        case 'plat':
          this.color = 'background:#37B69A;color:#fff'
          break
        case 'small':
          this.color = 'background:#37B69A;color:#fff'
          break
        default:
          this.color = 'background:#40A9FF;color:#fff'
      }
    }
  },
  mounted () {
    this.init()
  },
  updated () {
    this.init()
  }
  // watch: {
  //   name () {
  //     if (this.name) {
  //       let name = this.name
  //       console.log('=======name=' + name)
  //       if (util.isChinese(name)) {
  //         this.avatarName = name.slice(-2)
  //       } else {
  //         this.avatarName = name.slice(-5)
  //       }
  //     }
  //   },
  //   role () {
  //     console.log('=======role=' + this.role)
  //     switch (this.role) {
  //       case 'admin':
  //         this.color = 'background:#FF4D4F;color:#fff'
  //         break
  //       case 'plat':
  //         this.color = 'background:#37B69A;color:#fff'
  //         break
  //       case 'small':
  //         this.color = 'background:#37B69A;color:#fff'
  //         break
  //       default:
  //         this.color = 'background:#40A9FF;color:#fff'
  //     }
  //   }
  // }
}
</script>

<style scoped lang="less">
</style>
