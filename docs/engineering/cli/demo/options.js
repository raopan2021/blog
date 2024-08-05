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

export default options