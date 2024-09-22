import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
    name: 'themeColor',
    initialState: {
        value: 'light'
    },
    reducers: {
        change: state => {
            state.value = state.value === 'light' ? 'dark' : 'light'
        }
    }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { change } = themeSlice.actions

export default themeSlice.reducer