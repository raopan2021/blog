# Git 本地分支清理记录

## 一键清理

```bash
git remote prune origin --dry-run
git fetch -p
git branch -vv | Select-String ": gone]" | ForEach-Object {
  ($_ -split '\s+')[1]
} | ForEach-Object {
  git branch -D $_
}
git gc --prune=now
```

用下面这套标准流程来**检查远程分支并清理本地已失效分支**。

## 一、先查看远程分支状态（推荐先看）

```bash
git remote prune origin --dry-run
```

作用：  
✅ 显示哪些远程分支已经被删除  
✅ **不会真的删东西**（安全预览）

示例输出类似：

```
[pruned] origin/feature-baidu
[pruned] origin/feature-huodong
```

## 二、真正清理远程已删除的本地分支

### ✅ 方式一（最常用，推荐）

```bash
git remote prune origin
```

执行后：

- 所有 **远程已不存在** 的追踪关系会被清理
- 本地分支**不会自动删除**（安全）

## 三、查看哪些本地分支「远程已不存在」

```bash
git branch -vv
```

你会看到类似：

```
feature-baidu      a1b2c3d [origin/feature-baidu: gone]
feature-huodong    e4f5g6h [origin/feature-huodong: gone]
```

`[gone]` 就表示：**远程分支已被删除**

## 四、批量删除这些“gone”的本地分支（重点）

### ✅ Git 2.13+（现在基本都支持）

```bash
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -d
```

> ⚠️ 如果分支未合并，会提示失败（安全）

### 🔥 强制删除（确定不要了）：

```bash
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```

### 再顺手清一下远程垃圾（无副作用）

```bash
git gc --prune=now
```

## 六、最终效果

- ✅ 远程已删除的分支 → 本地不再显示 `[gone]`
- ✅ 保留你还在用的分支（如 `dev`、`feature-raopan-0604`）
- ✅ 仓库干净、不混乱
