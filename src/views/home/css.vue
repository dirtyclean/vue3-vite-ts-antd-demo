<template>
    <div class="p-100px">
        <!-- 八边形 -->
        <div class="octagon w-300px">
            图1️⃣翡翠湖，湖水在阳光下清澈湛蓝，色如翡翠💚，故得名“翡翠湖”。 图2️⃣茶卡盐湖，有着“中国天空之镜”之称
            图3️⃣U型公路，网红公路🛣，大西北地大辽阔，怎么能不拍公路了 图4️⃣东台吉乃尔湖，被誉为中国版马尔代夫 。
            图5️⃣水上雅丹，碧蓝的湖水，水上波光粼粼，朝阳橙霞，沙丘湖泊形成一幅美丽动人的画面🏞，拍摄水上雅丹，金色雅丹波光倒影，美不胜收。
            图6️⃣小柴旦湖，位于海西州大柴旦境内，湖水呈翠绿色🏝，西北环线里最美的一颗遗珠。
            图7️⃣油菜花，🌸花海在青海7-8月拍摄的最佳时间
            图8️⃣青海湖，藏语名为“措温布”（意为“青色的海”），天气晴朗的时候，海天一色，非常好看🌟
            图9️⃣金沙湾，沙漠我们选择青海湖旁边沙岛里的金沙湾🏜️选择这边是因为离青海湖比较近，能丰富拍摄的元素
        </div>
        <!-- 菱形 -->
        <div class="lozenge"></div>
        <!-- 平行四边形 -->
        <div class="parallelogram"></div>
        <!-- 梯形 -->
        <div class="trapezoid"></div>
        <!-- 不规则多边形 -->
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.octagon {
    clip-path: polygon(
        12px 0,
        calc(100% - 12px) 0,
        100% 12px,
        100% calc(100% - 12px),
        calc(100% - 12px) 100%,
        12px 100%,
        0 calc(100% - 12px),
        0 12px
    );
    background: linear-gradient(-45deg, red 8px, transparent 0) bottom right,
        linear-gradient(45deg, red 8px, transparent 0) bottom left,
        linear-gradient(135deg, red 8px, transparent 0) top left,
        linear-gradient(-135deg, red 8px, transparent 0) top right;
    background-size: 50% 51%;
    background-repeat: no-repeat;
    border: solid 4px red;
}
.lozenge {
    /* 菱形 */
    width: 20px;
    height: 20px;
    margin-right: 15px;
    background: #1eb336;
    margin-left: -30px;
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
.parallelogram {
    width: 150px;
    height: 100px;
    margin-left: 20px;
    -webkit-transform: skew(20deg);
    -moz-transform: skew(20deg);
    -o-transform: skew(20deg);
    background: red;
}
// 上底长为width的值，下底长为width+border-left+border-right之和，高为border-bottom
.trapezoid {
    width: 200px;
    height: 0px;
    border-top: 0px;
    border-bottom: 70px solid #1e6aa4;
    border-right: 50px solid transparent;
    border-left: 50px solid transparent;
}
</style>
