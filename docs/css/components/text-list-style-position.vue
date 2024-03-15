<script setup>
import { ref } from 'vue'
import { ElText, ElRadioGroup, ElRadio } from 'element-plus'

const selectedType = ref("inside");
const position = ref(["inside", "outside"]);
</script>
            
<template>
    <div>
        <ul :style="{ listStylePosition: selectedType }">
            <li>赵客缦胡缨，吴钩霜雪明。</li>
            <li>银鞍照白马，飒沓如流星。</li>
            <li>十步杀一人，千里不留行。</li>
            <li>事了拂衣去，深藏身与名。</li>
            <li>闲过信陵饮，脱剑膝前横。</li>
            <li>将炙啖朱亥，持觞劝侯嬴。</li>
            <li>三杯吐然诺，五岳倒为轻。</li>
            <li>眼花耳热后，意气素霓生。</li>
            <li>救赵挥金槌，邯郸先震惊。</li>
            <li>千秋二壮士，烜赫大梁城。</li>
            <li>纵死侠骨香，不惭世上英。</li>
            <li>谁能书阁下，白首太玄经。</li>
        </ul>

        <el-text type="text" size="large">list-style-position: {{ selectedType }}</el-text>
        <br> <br>

        <el-radio-group v-model="selectedType">
            <el-radio v-for="item in position" :key="item" :label="item">
                {{ item }}
            </el-radio>
        </el-radio-group>
    </div>
</template>


<style scoped lang="scss">
li {
    margin: 0 auto;
    width: 50%;
    background: rgba(0, 173, 181, 0.5);
}
</style>