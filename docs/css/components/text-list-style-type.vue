<script setup>
import { ref } from 'vue'
import { ElRadioGroup, ElRadio, ElText } from 'element-plus'

const type = ref([
    {
        name: "disc",
        isTest: false,
        comment: "实心圆点 (默认值)"
    },
    {
        name: "circle",
        isTest: false,
        comment: "空心圆点"
    },
    {
        name: "square",
        isTest: false,
        comment: "实心方块"
    },
    {
        name: "decimal",
        isTest: false,
        comment: "十进制阿拉伯数字"
    },
    {
        name: "cjk-decimal",
        isTest: true,
        comment: "中日韩十进制数"
    },
    {
        name: "decimal-leading-zero",
        isTest: false,
        comment: "十进数"
    },
    {
        name: "lower-roman",
        isTest: false,
        comment: "小写罗马数字"
    },
    {
        name: "upper-roman",
        isTest: false,
        comment: "大写罗马数字"
    },
    {
        name: "lower-greek",
        isTest: false,
        comment: "小写希腊数字"
    },
    {
        name: "lower-alpha",
        isTest: false,
        comment: "小写 ASCII"
    },
    {
        name: "lower-latin",
        isTest: false,
        comment: "小写 ASCII（IE7 以下不支持）"
    },
    {
        name: "upper-alpha",
        isTest: false,
        comment: "大写 ASCII"
    },
    {
        name: "upper-latin",
        isTest: false,
        comment: "大写 ASCII（IE7 以下不支持）"
    },
    {
        name: "armenian",
        isTest: false,
        comment: "传统美式数字"
    },
    {
        name: "georgian",
        isTest: false,
        comment: "传统英式数字"
    },
    {
        name: "hebrew",
        isTest: true,
        comment: "传统希伯来数字"
    },
    {
        name: "ethiopic-numeric ",
        isTest: true,
        comment: "埃塞俄比亚数字"
    },
    {
        name: "hiragana",
        isTest: true,
        comment: "平假名数字（日语）"
    },
    {
        name: "katakana",
        isTest: true,
        comment: "片假名数字（日语）"
    },
    {
        name: "hiragana-iroha",
        isTest: true,
        comment: "旧式平假名数字（日语）"
    },
    {
        name: "katakana-iroha",
        isTest: true,
        comment: "旧式平假名数字（日语）"
    },
    {
        name: "japanese-informal",
        isTest: true,
        comment: "日语非正式数字"
    },
    {
        name: "japanese-formal",
        isTest: true,
        comment: "日语数字 "
    },
    {
        name: "korean-hangul-formal",
        isTest: true,
        comment: "韩文数字"
    },
    {
        name: "korean-hanja-informal",
        isTest: true,
        comment: "韩式数字"
    },
    {
        name: "korean-hanja-formal",
        isTest: true,
        comment: "韩式数字（繁体）"
    },
    {
        name: "simp-chinese-informal",
        isTest: true,
        comment: "中文数字"
    },
    {
        name: "cjk-ideographic",
        isTest: true,
        comment: "中文数字"
    },
    {
        name: "simp-chinese-formal",
        isTest: true,
        comment: "大写繁体中文数字"
    },
    {
        name: "trad-chinese-informal",
        isTest: true,
        comment: "繁体中文数字"
    },
    {
        name: "trad-chinese-formal",
        isTest: true,
        comment: "大写繁体中文数字"
    }
]);
const selectedType = ref("disc");
const template = ref([
    "css_tricks",
    "js_tricks",
    "blog"
])
</script>
        
<template>
    <div class="list-type-container">
        <ul class="list-container" :style="{ listStyleType: selectedType }">
            <li v-for="(item, index) in template" :key="index">
                {{ item }}
            </li>
        </ul>

        <el-text class="mx-1" type="primary" size="large">list-style-type: {{ selectedType }}</el-text>
        <br>

        <el-radio-group v-model="selectedType" class="type-container">
            <el-radio v-for="item in type" :key="item.name" :label="item.name">
                {{ item.name }} - {{ item.comment }}
            </el-radio>
        </el-radio-group>
    </div>
</template>


<style scoped lang="scss">
.list-container {
    li {
        width: 40%;
        margin: 0;
    }
}

.mx-1 {
    text-align: center;
}

.type-container {
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;

    label {
        width: 50%;
        margin: 0;
        padding: 10px 0;
    }
}
</style>