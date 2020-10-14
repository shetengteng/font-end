<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert type="info" title="添加商品信息" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 active 是 0 1 2 数字，表示激活的step的index -->
      <!-- activeIndex - 0 将字符串转换为数字 -->
      <el-steps :space="200" :active="activeIndex - 0"
                finish-status="success"
                align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 注意：el-form必须在el-tabs的外部 label-position 指定label在上面-->
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef"
               label-width="100px"
               label-position="top">
        <el-tabs v-model="activeIndex"
                 :tab-position="'left'"
                 :before-leave="beforeTabLeave"
                 @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addGoodsForm.goods_cat" expand-trigger="hover"
                           :options="cateList" :props="cascaderProps"
                           @change="handleCascaderChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 绑定到一个数组上 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals"
                             :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--
              action表示图片上传的api地址 需要完整的ip地址 on-preview 预览事件 file-list 文件列表 list-type 表示预览效果
             需要添加 headers 请求头配置
             -->
            <el-upload :action="uploadUrl"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :headers="headers"
                       :on-success="handleSuccess"
                       list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce" />
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--图片预览-->
    <el-dialog title="图片预览"
               :visible.sync="previewVisible"
               @close="previewVisible = false">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        pics: [],
        // 商品的详细描述
        goods_introduce: ''
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 商品参数中：动态参数列表数据
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: 'http://server.sineava.top/api/private/v1/upload',
      // 图片上传组件的headers请求头配置
      headers: {},
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    this.getCategories()
    this.headers.Authorization = window.sessionStorage.getItem('token')
  },
  methods: {
    async getCategories() {
      // 获取所有的分类数据
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$msg.error('获取分类数据异常：' + res.meta.msg)
      }
      this.cateList = res.data
    },
    handleCascaderChange() {
      // 只允许选择三级分类
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 触发标签页的切换
    beforeTabLeave(activeName, oldActiveName) {
      // oldActiveName是要离开的标签页的名称
      // activeName是要进入的tab页的名称
      // console.log(activeName, oldActiveName)
      // 阻止跳转
      // return false

      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$msg.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked() {
      // 访问的是商品参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$msg.error('查询异常：' + res.meta.msg)
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$msg.error('查询异常：' + res.meta.msg)
        }
        this.onlyTableData = res.data
      } else if (this.activeIndex === '3') {

      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = 'http://server.sineava.top/' + file.response.data.tmp_path
      this.previewVisible = true
    },
    // 删除图片事件
    handleRemove(file) {
      // 获取图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics 中移除
      const index = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      this.addGoodsForm.pics.splice(index, 1)
      console.log(this.addGoodsForm.pics)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 得到图片信息对象
      // push到pics中
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
      console.log(this.addGoodsForm.pics)
    },
    add() {
      this.$refs.addGoodsFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error('验证未通过')
        }
      })
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0;
}

.previewImg {
  width: 100%;
}

.addBtn {
  margin-top: 15px;
}
</style>
