<script setup>
import { ref } from 'vue'
import TextUnderline from '../text-underline.vue'

let date = new Date();
date.setTime(date.getTime() - 24 * 60 * 60 * 1000); // 1天前
let year = date.getFullYear(); //获取完整的年份(4位)
let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
let day = date.getDate(); // 获取当前日(1-31)
if (month < 10) month = `0${month}`; // 如果月份是个位数，在前面补0
if (day < 10) day = `0${day}`; // 如果日是个位数，在前面补0

const dailyNewsUrl = `https://github.com/kujian/frontendDaily/blob/master/${year}/${month}/${day}.md`;
</script>

<template>
    <main>
        <div class="news">
            <a :href="dailyNewsUrl" target="_blank"> 前端每日新闻 </a>
        </div>
        <div class="news">
            <a href="https://frontend-weekly.com/" target="_blank"> 前端周刊 </a>
        </div>
    </main>
</template>

<style scoped lang="scss">
main {
    display: flex;
    flex-flow: row wrap;

    .news {
        position: relative;
        display: flex;
        width: calc((100% - 24px) / 3);
        margin: 20px 12px 0 0;
        height: 120px;
        padding: 10px 20px;
        border: 1px solid #ffffff50;
        border-radius: 10px;
        font-size: 24px;

        a {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(to right, rgb(16, 180, 188) 0%, rgba(0, 173, 181, .4) 100%);
            background-repeat: no-repeat;
            background-size: 0 1px;
            text-shadow: 0 0 1px rgba(0, 173, 181, .2882),
                0 0 1px rgba(0, 173, 181, .2882),
                0 0 1px rgba(0, 173, 181, .2882),
                0 0 1px rgba(0, 173, 181, .2882),
                0 0 1px rgba(0, 173, 181, .2882),
                0 0 1px rgba(0, 173, 181, .2882),
                0 0 1px rgba(0, 173, 181, .2882),
                0 0 1px rgba(0, 173, 181, .2882),
                0 0 1px rgba(0, 173, 181, .2882);
            transition: background-size 1s;
            animation: blink 2s linear infinite;
        }

        @keyframes blink {
            0% {
                opacity: 1;
            }

            50% {
                opacity: 0.5;
            }

            100% {
                opacity: 1;
            }
        }
    }

    .news:nth-child(3n) {
        margin-right: 0;
    }
}

.dark>.news>a {
    color: #fff;
}
</style>
