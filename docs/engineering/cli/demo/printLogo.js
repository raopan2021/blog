import figlet from "figlet";

const printLogo = () => {
    figlet.textSync('RAOPAN-CLI',{
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })
}

export default printLogo