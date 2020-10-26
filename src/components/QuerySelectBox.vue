<!--表格上方带分类的查询框-->
<!--支持一下各类情况：
1. 只有查询框的，不用写相关参数firtList 和 secondList
2. 只有一级分类框的，不用写相关参数 secondList
3. 两次分类框的，firtList 和 secondList均需要
4. 两次分类框的，firtList 和 secondList均需要（左侧菜单为第一层级的，需加参数zeroId传入第一层级id）
-->
<!--使用方法：
1.父组件注册props的值
2.父组件需设置页面表格刷新同意方法，如refreshFetch，处理选中后、搜索后数据传递给表格做入参(需后端配合查询逻辑)
refreshFetch () {
  // searchLevel: 选中的层级（暂支持2级，及第一级指定后的3级）
  // lastLevelValue：选中的数据的id
  // value：搜索框的值
  let { searchLevel, lastLevelValue, value } = this.$refs.querySelect.getAll()
  ...更新表格
},

3.父组件注册方法onSearch,firstClick（给secondList赋值）,secondClick（给firstList，secondList赋值）
eg.
firstClick (record) {
  this.获取数据的fun((data) => {
    this.secondList = this.$refs.querySelect.refreshSecond(data.data)
    this.refreshFetch()
  })
},
secondClick (record) {
  //刷新表格方法
},
onSearch (value) {
  this.refreshFetch(value)
},
4.父组件初始化：
eg.
this.获取数据的fun((data) => {
  this.firstList = this.$refs.querySelect.initFirst(data.data)
})-->
<template>
  <div class="query-box" :style="firstList && firstList.length > 0?'padding-bottom: 16px':'padding:0'">
    <div class="header-right" :style="queryStyle">
      <a-input-search class="content-4"
                         @change="onChange"
                         :placeholder="'请输入'+queryPlaceholder"
                         style="width: 240px"
                         :value="value"
                         @search="onSearch"
    /></div>
<!--    <div class="sep-dash"></div>-->
    <a-row class="firstClass row" v-if="firstList && firstList.length > 0">
      <a-col class="title-4" style="margin-bottom: 8px;">{{selectTitle}}：</a-col>
      <a-col class="content-4 clearfix">
        <li class="fl tag" :class="firstSelectedId == first.id? 'active':''" @click="firstClick(first)" v-for="(first) in firstList" :key="first.id">
          {{first.name}}
        </li>
      </a-col>
    </a-row>
    <ul class="clearfix secondClass" v-if="secondList && firstSelectedId!=-1 && secondList.length>0">
      <li class="fl"
          v-for="(second) in secondList" :key="second.id"
          @click="secondClick(second)"
          :class="secondSelectedId == second.id?'active':''">{{second.name}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    queryTitle: { // 暂废弃
      type: String,
      required: false
    },
    queryPlaceholder: {
      type: String,
      required: true
    },
    selectTitle: {
      type: String,
      required: false
    },
    firstList: {
      type: Array,
      required: false
    },
    secondList: {
      type: Array,
      required: false
    },
    zeroId: { // 出现三层层级时使用
      type: String,
      default () {
        return '-1'
      }
    },
    isLock: { // 数据加载时是否禁掉其它按钮；需配合this.$refs.querySelect.lock 一起使用
      type: Boolean,
      default: false
    },
    queryStyle: {
      type: String,
      required: false
    }
  },
  components: {},
  data () {
    return {
      value: '',
      lock: false,
      firstSelectedId: -1, // -1 全部
      secondSelectedId: false
    }
  },
  mounted () {
  },
  methods: {
    onChange (e) {
      const { value } = e.target
      this.value = value
    },
    // 条件筛选
    onSearch (value) {
      this.$emit('onSearch', value)
    },
    // 点击一级按钮
    firstClick (record) {
      if (this.isLock === true) {
        if (this.lock !== true) {
          this.lock = true
        }
      }
      this.secondSelectedId = false
      this.firstSelectedId = record.id
      this.$emit('firstClick', record)
    },
    // 点击二级按钮
    secondClick (record) {
      if (this.isLock === true) {
        if (this.lock !== true) {
          this.lock = true
        }
      }
      this.secondSelectedId = record.id
      this.$emit('secondClick', record)
    },
    initFirst (data) {
      let firstList = []
      if (data && data.length > 0) {
        firstList = [{id: -1, name: '全部'}, ...data]
      }
      return firstList
    },
    // 刷新二级内容
    refreshSecond (data) {
      let secondList = []
      if (data && data.length > 0) {
        secondList = [{id: -1, name: '全部'}, ...data]
        this.secondSelectedId = -1
      }
      return secondList
    },
    // 获取选择按钮的层级(searchLevel)、id(lastLevelValue)、搜索内容(value)
    getAll () {
      let searchLevel, lastLevelValue
      // 三级的
      if (this.zeroId !== '-1') {
        // 三级
        if (this.secondSelectedId !== false && this.secondSelectedId !== -1) {
          searchLevel = 3
          lastLevelValue = this.secondSelectedId
        } else if (this.firstSelectedId !== -1) {
          // 二级
          searchLevel = 2
          lastLevelValue = this.firstSelectedId
        } else {
          searchLevel = 1
          lastLevelValue = this.zeroId
        }
      } else {
        // 二级
        if (this.secondSelectedId !== false && this.secondSelectedId !== -1) {
          searchLevel = 2
          lastLevelValue = this.secondSelectedId
        } else if (this.firstSelectedId !== -1) {
          // 一级
          searchLevel = 1
          lastLevelValue = this.firstSelectedId
        } else {
          searchLevel = ''
          lastLevelValue = ''
        }
      }

      return {searchLevel, lastLevelValue, value: this.value}
    }
  }
}
</script>

<style scoped lang="less">
  @import '~@var';
  .secondClass{
    padding: 16px 0 8px 16px;
    background-color: @bg;
    border-radius: 2px;
    margin-top: 8px;
    margin-left: 70px;
    margin-bottom: 0;
    li{
      margin-right: 24px;
      margin-bottom: 8px;
      line-height: 22px;
      padding: 0 8px;
      color: @blackBody;
      cursor: pointer;
    }
    li.active{
      background-color: @theme;
      border-radius: 4px;
      color: @fff;
    }
    li:last-of-type{
      margin-right: 0;
    }
  }
  .firstClass{
    padding: 0;
    .tag:extend(.secondClass li){
    }
    .tag.active:extend(.secondClass li.active){}
    .tag:last-of-type:extend(.secondClass li:last-of-type){}
  }
</style>
