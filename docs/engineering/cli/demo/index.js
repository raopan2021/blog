#! /usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra'
import print from './print.js';
import printLogo from './printLogo.js';
import deleteNodeModules from './delete_node_modules.js';
import create from './create.js';
import run from './run.js';

const program = new Command();

let fileDirTemp = import.meta.url.replace('file:///','').replace('bin/index.js','');

program
    .name('raopancli 脚手架')
    .description('raopan 的 JavaScript 脚手架工具')
    .option('-v --version','查看脚手架版本号')
    .option('-r --run','本地启动项目或打包项目')
    .option('-d --delete','删除当前目录的 node_modules')
    .option('-c --create','生成 vite 项目')
    .action(async (options) => {
        if (options.version) {
            print(JSON.parse(fs.readFileSync(fileDirTemp + 'package.json','utf-8')).version)
        } else if (options.run) {
            printLogo()
            run()
        } else if (options.delete) {
            print('删除目录下的noded_modules \n')
            deleteNodeModules()
        } else if (options.create) {
            printLogo()
            create()
        }
        if (JSON.stringify(options) == '{}') {
            printLogo()
        }
    });

program.parse()
