<template>
    <div class="w-full divide-y-20px divide-teal-500">
        <div class="py-10px">
            <div class="w-100px h-100 bg-hex-1890ff" v-loading="true">测试v-loading</div>
            <div class="w-50" v-tooltip>说了这么多就是想测试一下v-tooltip，哈哈哈哈</div>
            <div class="pxtovw" style="font-size: 30px">测试pxtovw</div>
        </div>
        <div class="py-10px">
            <div class="font-B">测试fontFamily配置</div>
            <div class="bg-danger text-primary">测试colors配置</div>
            <div class="w-100px h-120px empty-center border border-primary">测试shortcuts配置</div>
            <div class="btn btn-green">测试shortcuts配置</div>
            <div class="text-green-900 hover:(font-B text-pink-900)">测试可变修饰组</div>
            <div class="apply">测试@apply指令</div>
            <div font="B" p="10px" bg="blue-400 hover:blue-500" w="100px" h="100px">测试属性化模式</div>
            <div class="tag tag-primary">插件-addComponents</div>
            <div class="?">问号插件</div>
            <div class="rounded-t-xl overflow-hidden bg-green-400 to-teal-100 p-10">
                <div class="flex space-x-4">
                    <div
                        class="flex-1 rounded-md bg-yellow-200 text-black font-semibold flex items-center justify-center py-3 px-6"
                    >
                        Item that can grow or shrink if needed
                    </div>
                    <div
                        class="? flex-none rounded-md bg-yellow-200 text-black font-semibold flex items-center justify-center py-3 px-6"
                    >
                        Item that cannot grow or shrink
                    </div>
                    <div
                        class="flex-1 rounded-md bg-yellow-200 text-black font-semibold flex items-center justify-center py-3 px-6"
                    >
                        Item that can grow or shrink if needed
                    </div>
                </div>
            </div>
            <!-- *-rounded-* utilities only work in webkit-based browsers -->
            <div class="h-32 overflow-hidden hover:primary-scrollbar">
                <div class="!m-0 bg-gray-400">
                    特别注意： 此插件只是给滚动条 添加样式；它并不保证滚动条会显示。你应该使用传统的 CSS
                    技巧来让内容溢出从而触发滚动条。 对于每个你想要添加样式的元素，添加 .scrollbar 或 .scrollbar-thin
                    类。如果需要，你也可以添加任何 scrollbar-track-{color}，scrollbar-thumb-{color} 或者
                    hover:scrollbar-thumb-{color} 类。（请注意 hover:scrollbar-thumb-{color} 类只会在基于 webkit
                    的浏览器上起作用。） 这里有个简单的例子（注意这里的类名 h-32 和 h-64 只是为了使滚动条出现）：
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    你可以在这里看到 在线的演示版本。 此插件也可用于添加圆角滚动条（会使用你 border radius
                    中的配置）。然而，它们只被基于 webkit 的浏览器支持，所以不建议在跨浏览器应用中使用。把 rounded
                    添加到你配置文件 variants 的 scrollbar 一项中，可以使圆角滚动条工具类生效。这会引入
                    scrollbar-thumb-rounded 和 scrollbar-thumb-rounded-md 等工具类。
                </div>
            </div>
            <input type="password" placeholder="基于表单插件css的密码框" />
            <br />
            <input type="number" placeholder="基于表单插件css的number框" />
            <br />
            <input type="date" placeholder="基于表单插件css的date框" />
            <br />
            <div class="animate-animated animate-bounce animate-delay-5s">Animate.css</div>
            <div class="animate-animated animate-bounce animate-infinite">Animate.css</div>
            <div class="animate-animated animate-bounce animate-slow">Animate.css</div>
            <div>
                <i class="bg-hero-polka-dots inline-block w-150px h-150px">英雄模式</i>
                <i class="bg-hero-polka-dots-50 inline-block w-150px h-150px">英雄模式</i>
                <i class="bg-hero-polka-dots-100 inline-block w-150px h-150px">英雄模式</i>
                <i class="bg-hero-eyes inline-block w-150px h-150px">英雄模式</i>
                <i class="bg-hero-eyes-50 inline-block w-150px h-150px">英雄模式</i>
                <i class="bg-hero-eyes-green-50 inline-block w-150px h-150px">英雄模式</i>
                <i class="bg-hero-eyes-green-100 inline-block w-150px h-150px">英雄模式</i>
                <i class="bg-hero-rain-green-100 inline-block w-150px h-150px">英雄模式</i>
            </div>
            <div class="bg-$bg-color text-$color">与css变量连用</div>
            <div class="container mx-auto">容器</div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.pxtovw {
    width: 200px;
    height: 100px;
    border: 1px solid blue;
}
div,
input {
    margin: 10px 0;
}
i {
    margin: 10px;
}
.apply {
    @apply text-danger font-M;
}

div {
    --bg-color: pink;
    --color: orange;
}
</style>
