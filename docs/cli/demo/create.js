import inquirer from 'inquirer';
import fs from 'fs-extra'
import chalk from 'chalk';
import ora from 'ora';

const options = [
    {
        name: 'project',
        type: 'input',
        message: 'Project name',
        default: 'rpcli-demo'
    },
    {
        name: 'framework',
        type: 'list',
        message: 'Select a framework',
        choices: ['lit','preact','qwik','react','solid','svelte','vanilla','vue']
    },
    {
        name: 'variant',
        type: 'list',
        message: 'Select a variant',
        choices: ['TypeScript','JavaScript']
    }
]

const create = () => {
    inquirer.prompt(options).then(res => {
        console.log(chalk.cyan('项目名称： ') + chalk.green(res.project))
        console.log(chalk.cyan('项目框架： ') + chalk.green(res.framework))
        console.log(chalk.cyan((res.variant === 'JavaScript' ? '不 ' : '') + '使用ts\n\r'))

        let fileDirTemp = import.meta.url.replace('file:///','').replace('bin/create.js','')
        let fileDir = fileDirTemp + 'lib/template-' + res.framework

        if (res.variant === 'TypeScript') fileDir += '-ts'

        const spinner = ora('正在创建项目').start();
        fs.copySync(fileDir,res.project);
        spinner.succeed('项目创建成功\n\r');

        // 修改 package.json 的name字段
        const packageJson = JSON.parse(fs.readFileSync(process.cwd() + '/' + res.project + '/package.json','utf8'));
        packageJson.name = res.project;
        fs.writeFileSync(process.cwd() + '/' + res.project + '/package.json',JSON.stringify(packageJson,null,2));

        console.log(chalk.cyan('cd ' + res.project))
        console.log(chalk.cyan('pnpm i'))
        console.log(chalk.cyan('pnpm dev\n\r'))
    });
}

export default create;