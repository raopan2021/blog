import fs from 'fs-extra'
import inquirer from 'inquirer'
import chalk from 'chalk';
import shell from 'shelljs';
import addVersion from './addversion.js'

const options = [
    {
        name: 'npm',
        type: 'list',
        message: '请选择包管理工具',
        choices: [
            'npm',
            'pnpm'
        ],
        default: fs.pathExistsSync('pnpm-lock.yaml') ? 'pnpm' : 'npm',
    },
    {
        name: 'run',
        type: 'list',
        message: '选择打包方式',
        choices: [
            '执行 npm run dev',
            '执行 npm run build',
            'package.json的version加1，再执行 npm run build'
        ],
        when: answers => answers.npm === 'npm'
    },
    {
        name: 'run',
        type: 'list',
        message: '选择打包方式',
        choices: [
            '执行 pnpm dev',
            '执行 pnpm build',
            'package.json的version加1，再执行 pnpm build',
        ],
        when: answers => answers.npm === 'pnpm'
    }
]

const run = () => {
    inquirer.prompt(options).then(res => {
        console.log('\n' + chalk.blue('包管理工具： ') + chalk.green(res.npm))
        console.log(chalk.blue('打包方式  ： ') + chalk.green(res.run) + '\n')

        if (res.run.includes('package.json')) {
            console.log(chalk.greenBright('package.json的version加1'));
            try {
                addVersion()
                console.log(chalk.greenBright('执行成功：package.json的version加1'));
            } catch (error) {
                console.log(chalk.greenBright('执行失败：package.json的version加1'));
            }
        }

        shell.exec(
            res.run?.match(/执行(.*)/)?.[1],
            code => {
                if (code === 0) {
                    console.log(chalk.greenBright(res.run.includes('dev') ? '本地启动成功' : '打包成功'));
                } else {
                    console.log(chalk.redBright(res.run.includes('dev') ? '本地启动失败' : '打包失败'));
                }
            })
    })
}

export default run