<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加按键 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 https://github.com/MisterTaki/vue-table-with-tree-grid -->
      <tree-table class="treeTable" :data="cateList"
                  :columns="columnsProp" :expand-type="false"
                  :selection-type="false" :show-row-hover="false"
                  border show-index index-text="#">
        <!-- 定义插槽的名称为isok 被组件识别 -->
        <template slot="isok" slot-scope="scope">
          <i style="color:lightgreen;" class="el-icon-success" v-if="scope.row.cat_deleted == false"></i>
          <i style="color:red;" class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 等级 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot-scope="scope" slot="operation">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCat(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-edit" size="mini" @click="deleteCat(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageNumChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialogVisible"
               width="50%" @close="handleAddCatDialogClose">
      <!--添加分类的表单-->
      <el-form :model="addCatForm" :rules="addCatFormRule" ref="addCatFormRef" label-width="100px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <!--
        options 用于指定数据源
        clearable 有清空按键
        change-on-select 任意一级都可以被选中
        -->
        <el-form-item label="父级分类: ">
          <el-cascader v-model="selectedKeys"
                       expand-trigger="hover"
                       :options="parentCateList"
                       :props="cascaderProps"
                       clearable :change-on-select="true"
                       @change="handleParentCatChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 需要安装第三方插件 vue-table-with-tree-grid ,在页面中安装依赖

export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3, // 获取 1 2 3 级数据，如果为3表示获取1-3级的全部数据
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 商品分类的数据列表
      cateList: [],
      // 获取二级及以上分类数据
      parentCateList: [],
      // 指定列的属性
      columnsProp: [
        {
          label: '分类名称',
          prop: 'cat_name' // 对应数据cateList中的属性字段名称
        }, {
          label: '是否有效',
          type: 'template', // 固定写法，使用自定义插槽实现，定义当前列为模板列
          template: 'isok'// 自定义模板名称
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      addCatDialogVisible: false,
      addCatForm: {
        // 要添加的分类名称
        cat_name: '',
        cat_pid: 0, // 一级分类，父id为0
        cat_level: 0 // 0,1,2
      },
      addCatFormRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 用于配置级联选择器的展示
      cascaderProps: {
        value: 'cat_id', // 选择的值
        label: 'cat_name', // 展示的值
        children: 'children' // 父子嵌套的属性
      },
      // 选中的级联选择器的返回值
      selectedKeys: [] // 第一个是一级分类，第二个是二级分类的id
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    async getCategories() {
      // type [1,2,3] 输入3 获取
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$msg.error('获取分类数据异常：' + res.meta.msg)
      }
      this.cateList = res.data.result
      console.log(this.cateList)
      this.total = res.data.total
    },
    // 获得2级分类信息
    async getParentCatList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$msg.error('获取分类数据异常：' + res.meta.msg)
      }
      this.parentCateList = res.data
    },
    editCat(catInfo) {

    },
    deleteCat(catInfo) {
    },
    handlePageSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCategories()
    },
    handleCurrentPageNumChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCategories()
    },
    handleAddCatDialogClose() {
      this.$refs.addCatFormRef.resetFields()
      this.addCatDialogVisible = false
      this.selectedKeys = []
      this.addCatForm.cat_level = 0
      this.addCatForm.cat_pid = 0
    },
    showAddCatDialog() {
      // 获取父级分类的数据，展示对话框
      this.getParentCatList()
      this.addCatDialogVisible = true
    },
    addCat() {
      this.$refs.addCatFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('categories', this.addCatForm)
        if (res.meta.status !== 201) {
          return this.$msg.error('添加失败:' + res.meta.msg)
        }
        this.$msg.success('添加成功')
        await this.getCategories()
        this.addCatDialogVisible = false
      })
    },
    handleParentCatChange() {
      // 如果 selectkeys数组中的length 大于 0 ，证明选中的父级分类
      // 反之，说明没有选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCatForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级赋值
        this.addCatForm.cat_level = this.selectedKeys.length
        return
      }
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
    }
  }
}

</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
