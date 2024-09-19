const fs = require("fs");
const path = require("path");

// 遍历当前文件夹里的所有文件，如果文件名称包含字符（替换为-
fs.readdir(__dirname, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const filePath = path.join(__dirname, file);
    const newFileName = file.replace(/（/g, "-").replace(/）/g, "");
    const newFilePath = path.join(__dirname, newFileName);
    fs.rename(filePath, newFilePath, (err) => {
      if (err) throw err;
      console.log(`文件 ${file} 重命名为 ${newFileName}`);
    });
  });
});
