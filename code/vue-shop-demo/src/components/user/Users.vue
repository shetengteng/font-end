<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索与添加区域 gutter 表示间隙大小-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 使用prop 从 userList中获取对应的值 -->
      <el-table :data="userList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 使用作用域插槽 优先级高于prop，会替换掉prop -->
          <template slot-scope="scope">
            <!--scop.row 表示当前行的所有数据-->
            <!--使用change 监听状态改变-->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="showDeleteMsgBox(scope.row.id)"></el-button>
            <!-- 设置为 enterable 为false 表示鼠标不能进入提示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <!-- 分配角色 -->
              <el-button type="warning"
                         size="mini"
                         icon="el-icon-setting"
                         @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               :before-close="handleAddUserDialogClose"
               width="50%">
      <!-- 内容主体区域 -->
      <el-form :model="addUserForm"
               :rules="addUserFormRules"
               ref="addUserFormRef"
               label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddUserDialogClose">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="修改用户信息"
               width="50%"
               :visible.sync="editDialogVisible"
               :before-close="handleEditDialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="editUserForm"
               :rules="editUserFormRules"
               ref="editUserFormRef"
               label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按键 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色"
               :visible.sync="setRoleDialogVisible"
               :before-close="handleSetRoleDialogClose"
               width="50%">
      <!-- 显示用户信息 -->
      <div>
        <p>用户名 : {{ currentUserInfo.username }}</p>
        <p>角色名 : {{ currentUserInfo.role_name }}</p>
        <p>分配新角色 :
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id"
                       :label="item.roleName"
                       :value="item.id"></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[\w\\.]+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 返回成功
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法邮箱'))
    }

    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }

    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      // 总共多少条数据
      total: 0,
      // 对话框控制
      addDialogVisible: false,
      editDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名不超过3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名不超过6-15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRoleDialogVisible: false,
      // 用于分配角色使用
      currentUserInfo: {},
      roleList: [],
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 的改变
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值的改变
    handleCurrentChange(newPageNum) {
      console.log(newPageNum)
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    },
    // 监听switch 开关状态的改变
    async userStateChanged(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success('修改成功')
    },
    // 显示增加用户对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 对话框关闭时的回调函数
    handleAddUserDialogClose() {
      this.$refs.addUserFormRef.resetFields()
      this.addDialogVisible = false
    },
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          return this.$msg.error(res.meta.msg)
        }
        this.$msg.success('添加用户成功')
        this.addDialogVisible = false
        // 刷新列表
        await this.getUserList()
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      // 将查询到的数据绑定到相应的对象中
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    handleEditDialogClose() {
      this.$refs.editUserFormRef.resetFields()
      this.editDialogVisible = false
    },
    editUser() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$msg.error(res.meta.msg)
        }
        await this.getUserList()
        this.editDialogVisible = false
        this.$msg.success('修改用户成功')
      })
    },
    async showDeleteMsgBox(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该记录, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' // 左侧的图标
        }
      ).catch(error => error) // 点击取消后会返回异常，需要在此捕获
      // 返回 confirm 或者 cancel 字符串
      // console.log(confirmResult)
      // 如果使用如下方式，confirmResult 返回值为undefined
      // ).then(() => {
      //   this.$msg.success('删除成功')
      // }).catch(() => { // 点击取消时会触发异常
      //   this.$msg.info('已取消删除')
      // })
      if (confirmResult !== 'confirm') {
        return this.$msg.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      await this.getUserList()
      this.$msg.success('删除成功')
    },
    handleSetRoleDialogClose() {
      this.selectedRoleId = ''
      this.setRoleDialogVisible = false
    },
    async showSetRoleDialog(userInfo) {
      this.currentUserInfo = userInfo
      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$msg.error('获取角色列表失败：' + res.meta.msg)
      }
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按键，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$msg.error('没有选择新角色')
      }
      const { data: res } = await this.$http.put(`users/${this.currentUserInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$msg.error('分配角色失败' + res.meta.msg)
      }
      this.setRoleDialogVisible = false
      await this.getUserList()
      this.$msg.success('分配角色成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
