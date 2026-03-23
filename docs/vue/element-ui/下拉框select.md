# 选择器select下拉框

```
::v-deep .el-select-dropdown {
    //下拉框
    background  : #002450;
    border-color: #0F90ED;

    .el-select-dropdown__item {
        // height        : 32px;
        color         : #fff;
        text-align    : left;
        font-size     : 14px;
        // line-height: 32px;
    }
}
```

```
.el-select-dropdown__item {
    background  : #002450;
    border-color: #0F90ED;
}
```

#### hover背景颜色

```
    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
        //下拉框选项鼠标悬浮背景颜色
        background-color: #00387C;
    }
```

#### 下拉框最后一个显示不完全

```
.el-select-dropdown__wrap.el-scrollbar__wrap {
    margin-bottom: 0 !important;
}
```
