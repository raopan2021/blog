// 从package.json中获取版本号，给最后一位加1
import fs from 'fs-extra'
import chalk from 'chalk';

const addVersion = () => {
    const packageJsonPath = process.cwd() + '/package.json';
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath,'utf-8'));

    const version = packageJson.version.split('.');
    version[version.length - 1] = parseInt(version[version.length - 1]) + 1;
    packageJson.version = version.join('.');

    fs.writeFileSync(packageJsonPath,JSON.stringify(packageJson,null,2));
    console.log(chalk.cyan(`\n版本更新到 ${packageJson.version}\n`))
}

export default addVersion;