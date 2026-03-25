# 设置导航菜单navMenu的样式

copy了2种方案

### 方案1，点击后变红

```scss
<style lang="scss">
// 父节点前面的图标
.el-menu--horizontal>.el-submenu .el-submenu__title,
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title,
.el-submenu__title i {
  color: red;
}

// 父节点后面的图标
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  border-bottom: 2px solid #ff8923;
  color: #f00;
}

// 子菜单鼠标悬浮/选中时的样式
.el-menu-item:focus,
.el-menu-item:hover {
  outline: 0 !important;
  color: #f00 !important;
  background: rgb(255, 218, 224) !important;
}

// 一级菜单选中的样式
.el-menu-item.is-active {
  color: #f00 !important;
  border-bottom-color: transparent !important;
}

// 二级菜单 选中的样式
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  color: #ff8923 !important;
  border-bottom-color: transparent !important;
}

// 主菜单鼠标悬浮/选中时的样式
.el-submenu__title:focus,
.el-submenu__title:hover {
  outline: 0 !important;
  color: #f00 !important;
  background: pink !important;
}

.el-menu--horizontal:focus,
.el-menu--horizontal:hover {
  outline: 0 !important;
  color: #fff !important;
  background: pink !important;
}

.nav-menu-son .el-menu--horizontal:hover {
  background: pink !important;
}

.el-menu {
  background-color: none !important;
}

.el-menu-item a:hover {
  background: none;
}

.el-menu--popup-bottom-start {
  margin-top: -2px;
}

.el-menu--popup {
  background: none !important;
  padding: 0 0;
  min-width: 120px !important;
  line-height: 40px !important;
  box-shadow: 0 4px 8px 0 rgba(25, 14, 109, 0.13);
  border-radius: 5px;
}

.el-menu--horizontal .el-menu {
  background: none;
}

.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-submenu__title {
  background-color: rgba(255, 241, 241, 0.6);
  float: none;
  height: 36px;
  line-height: 36px;
  padding: 0 22px;
  color: #929292 !important;
  z-index: 100;
  font-weight: 500;
}

//二次菜单悬浮及背景样式
.el-menu--popup-bottom-start .el-menu-item:hover {
  color: rgba(86, 86, 86, 1) !important;
}

.el-menu--popup-bottom-start .el-menu-item {
  background: #fff !important;
}
</style>
```

### 方案2，点击后左侧border变蓝

```scss
// el-menu-item在scoped中设置值是可以的，而el-submenu在scoped中设置值不起作用
// 设置了默认左边框为白色
.el-submenu .el-submenu__title {
  border-left: #fff solid 6px;
}

//设置鼠标悬停时el-submenu的样式
.el-submenu .el-submenu__title:hover {
  border-left: #33A2EF solid 6px !important;
  background-color: #E2EFF9 !important;
  color: #38B2FF !important;

  i {
    color: #38B2FF;
  }
}

// 设置鼠标悬停时el-submenu的样式
// .el-submenu.is-active {
//   border-left: #33A2EF solid 6px !important;
//   background-color: #E2EFF9 !important;
//   color: #38B2FF !important;
// }


// 设置了默认左边框为白色
.el-menu-item {
  border-left: #fff solid 6px;
}

// 设置鼠标悬停时el-menu-item的样式
.el-menu-item:hover {
  border-left: #33A2EF solid 6px !important;
  background-color: #E2EFF9 !important;
  color: #38B2FF !important;

  i {
    color: #38B2FF;
  }
}

// 设置选中el-menu-item时的样式
.el-menu-item.is-active {
  border-left: #33A2EF solid 6px !important;
  background-color: #E2EFF9 !important;
  color: #38B2FF !important;
}
```

