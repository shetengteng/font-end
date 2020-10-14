<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item,index) in scope.row.children"
                    :class="['dbbottom',index === 0 ? 'dbtop':'','vcenter']"
                    :key="item.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item.id)">
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row :class="[subIndex === 0 ? '': 'dbtop','vcenter']"
                        v-for="(subItem,subIndex) in item.children"
                        :key="subItem.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeRightById(scope.row,subItem.id)" type="success">
                      {{ subItem.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="subSubItem in subItem.children" :key="subSubItem.id"
                            type="warning" closable @close="removeRightById(scope.row,subSubItem.id)">
                      {{ subSubItem.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
                       @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting"
                       @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRightDialogVisible" width="50%"
               :before-close="handleSetRightDialogClose">
      <!--
        权限树形控件展示
        使用props 指定读取的子节点字段以及文本字段
        使用node-key指定选中的返回的属性，该值要唯一
        default-expand-all 默认打开所有节点
        default-checked-keys 数组 存放已经选中的点的node-key值
      -->
      <el-tree :data="rightList"
               :props="treeProps"
               :default-expand-all="true"
               :default-checked-keys="defKeys"
               show-checkbox
               node-key="id"
               ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表 第一行 角色信息 其余子行 该角色的权限（最多含有3层，最后一层表示子操作，如查询，增加，删除等）
      roleList: [],
      setRightDialogVisible: false,
      rightList: [],
      // 树形控件属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      currentRoleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    showEditDialog(id) {

    },
    async removeRightById(role, rightId) {
      // 删除该权限
      const ret = await this.$confirm('是否删除该权限', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

      if (ret !== 'confirm') {
        return this.$msg.info('取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      // 会重新刷新整个页面，导致体验不好
      // await this.getRoleList()
      // 使用返回的数据直接绑定
      role.children = res.data
      this.$msg.success('删除成功')
    },
    async showSetRightDialog(role) {
      this.currentRoleId = role.id
      // 获取权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.rightList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    handleSetRightDialogClose() {
      // 清空选中的key
      this.defKeys = []
      this.setRightDialogVisible = false
    },
    // 使用递归得到三级节点的id数组，用于渲染分配权限时的勾选
    getLeafKeys(node, arr) {
      // 如果node没有children 则表示是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async allotRights() {
      // 获得到所有全选和半选节点的id
      var keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStrs = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.currentRoleId}/rights`, { rids: idStrs })
      if (res.meta.status !== 200) {
        return this.$msg.error(res.meta.msg)
      }
      this.$msg.success('分配成功')
      await this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>

.el-tag {
  margin: 6px;
}

.dbtop {
  border-top: 1px solid #eee;
}

.dbbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center; // 纵向居中
}

</style>
