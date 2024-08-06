import chalk from "chalk";
import figlet from "figlet";

const gradientText = (text,startColor,endColor) => {
    const textArr = text.split('\n');
    const colors = ['\n']
    for (let i = 0; i < textArr.length; i++) {
        for (let j = 0; j < textArr[i].length; j++) {
            const ratio = j / textArr[i].length;
            const color = {
                r: Math.round(startColor.r * (1 - ratio) + endColor.r * ratio),
                g: Math.round(startColor.g * (1 - ratio) + endColor.g * ratio),
                b: Math.round(startColor.b * (1 - ratio) + endColor.b * ratio)
            }
            colors.push(chalk.rgb(color.r,color.g,color.b)(textArr[i][j]));
        }
        colors.push('\n')
    }
    return colors.join('');
}

const startColor = { r: 255,g: 0,b: 0 }; // 起始颜色 - 红
const endColor = { r: 0,g: 0,b: 255 }; // 结束颜色 - 蓝
const text = figlet.textSync('RAOPANCLI',{
    font: 'Standard',
    verticalLayout: 'default',
    horizontalLayout: 'default'
});

const printLogo = () => {
    console.log(gradientText(text,startColor,endColor));
}

export default printLogo