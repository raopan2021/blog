#! /usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra'
import printLogo from './printLogo.js';
import inquirer from 'inquirer';

import options from './options.js';
import chalk from 'chalk';
import ora from 'ora';

const program = new Command();

program
    .name('rpcli 脚手架')
    .description('raopan 的 JavaScript 脚手架工具')
    .version(JSON.parse(JSON.stringify(fs.readFileSync('package.json','utf-8'))).version,'-v, -V, --vers,--version');

program.parse()

printLogo();

inquirer.prompt(options).then(res => {
    console.log(chalk.blue('项目名称： ') + chalk.green(res.project))
    console.log(chalk.blue('项目框架： ') + chalk.green(res.framework))
    console.log(chalk.blue((res.variant === 'JavaScript' ? '不 ' : '') + '使用ts\n\r'))

    let fileDirTemp = import.meta.url.replace('file:///','').replace('bin/index.js','');
    let fileDir = fileDirTemp + 'lib/template-' + res.framework
    if (res.variant === 'TypeScript') fileDir += '-ts'

    const spinner = ora('正在创建项目').start();
    fs.copySync(fileDir,res.project);

    spinner.succeed('项目创建成功\n\r');

    // 修改 package.json 的name字段
    const packageJson = JSON.parse(fs.readFileSync(fileDirTemp + res.project + '/package.json','utf8'));
    packageJson.name = res.project;
    fs.writeFileSync(fileDirTemp + res.project + '/package.json',JSON.stringify(packageJson,null,2));

    console.log(chalk.blue('cd ' + res.project))
    console.log(chalk.blue('pnpm i'))
    console.log(chalk.blue('pnpm dev\n\r'))
});