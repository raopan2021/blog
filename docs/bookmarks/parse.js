// 浏览器收藏夹导出的html转json
// https://github.com/zorapeteri/bookmarks-to-json
import { bookmarksToJSON } from 'bookmarks-to-json'
import fs from 'fs'

const data = fs.readFileSync('./docs/bookmarks/bookmarks.html', 'utf-8')
const option = { formatJSON: true, spaces: 2 }
const jsondata = bookmarksToJSON(data, option)

function renameBookmarkKeys(bookmarks, keyMap) {
	if (!Array.isArray(bookmarks)) return bookmarks

	return bookmarks.map((bookmark) => {
		const newBookmark = {}

		// 处理当前书签项的键
		Object.keys(bookmark).forEach((key) => {
			const newKey = keyMap[key] || key
			let value = bookmark[key]

			// 递归处理children
			if (key === 'children' && Array.isArray(value)) {
				value = renameBookmarkKeys(value, keyMap)
			}

			// 设置新键
			newBookmark[newKey] = value
		})

		return newBookmark
	})
}

const keyMap = {
	addDate: 'id',
	title: 'label',
}

const newObj = JSON.stringify(renameBookmarkKeys(JSON.parse(jsondata), keyMap))

fs.writeFileSync('./docs/bookmarks/bookmarks.json', newObj)
