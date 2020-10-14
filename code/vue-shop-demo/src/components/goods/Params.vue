<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning"
                :closable="false"
                show-icon></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader v-model="selectedKeys" expand-trigger="hover"
                       :options="cateList" :props="cascaderProps"
                       @change="handleCatChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 使用作用域插槽的方式展示 -->
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index" closable>{{ item }}
                </el-tag>
                <!--新增tag功能 keyup 按enter 之后触发 -->
                <el-input v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          class="input-new-tag"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else class="button-new-tag" size="small"
                           @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectedKeys: [],
      cascaderProps: {
        value: 'cat_id', // 选择的值
        label: 'cat_name', // 展示的值
        children: 'children' // 父子嵌套的属性
      },
      activeTabName: 'many',
      // 动态参数数组
      manyTableData: [],
      // 静态属性数组
      onlyTableData: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) {
        return this.$msg.error('获取分类数据异常：' + res.meta.msg)
      }
      this.cateList = res.data
    },
    handleCatChange() {
      // 用于控制级联选择，只能选择第三级，如果选择了第二级，那么清空selectedKeys，由于双向绑定，达到限制的效果
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getParamsDataList()
    },
    async getParamsDataList() {
      // 依据所选择的id，和处于的面板，发起请求
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeTabName } })
      if (res.meta.status !== 200) {
        return this.$msg.error('获取分类数据项异常：' + res.meta.msg)
      }

      // 对数据中的字符串转换为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文件框的显示和隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })

      if (this.activeTabName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // tab 事件的处理函数 切换面板后展示
    handleTabClick() {
      this.getParamsDataList()
    },
    // 文本框失去焦点，或者回车按下触发
    async handleInputConfirm(row) {
      // 无效数据
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 添加该tag
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$msg.error('更新失败：' + res.meta.msg)
      }
      this.$msg.success('修改成功')
    },
    showInput(row) {
      row.inputVisible = true
      // todo 重点 自动获取焦点
      // nextTick 作用：当页面上元素重新被渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        // 获取input输入框，调用focus获取焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 120px;
}
</style>
