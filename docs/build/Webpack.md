# Webpack

## 📖 本节总结

Webpack 是最主流的打包工具，**功能最全面**，但配置复杂、构建速度较慢。

---

## 核心概念

### Entry（入口）

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',

  // 多入口
  entry: {
    main: './src/main.js',
    vendor: './src/vendor.js'
  }
}
```

### Output（输出）

```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    path: __dirname + '/dist',
    clean: true  // 构建前清理 dist
  }
}
```

### Loaders（加载器）

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource'
      }
    ]
  }
}
```

### Plugins（插件）

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
}
```

---

## 开发服务器

```javascript
module.exports = {
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}
```

---

## 优化

### Code Splitting（代码分割）

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

### Tree Shaking

```javascript
module.exports = {
  mode: 'production',  // 自动启用 Tree Shaking
  optimization: {
    usedExports: true
  }
}
```

---

## 优缺点

| 优点 | 缺点 |
|------|------|
| 功能最全面 | 配置复杂 |
| 生态最广 | 构建速度慢 |
| 社区成熟 | 学习曲线陡 |
| 适合大型应用 | 包体积较大 |

---

## 总结

Webpack 是功能最全面的打包工具，但配置复杂、速度较慢。适合大型复杂应用。
