<template>
    <div class="container">
        <div class="row">&nbsp;</div>
        <div class="row">
            <div class="col-2">User</div>
            <div class="col-4"><a-input type="text" id="userInput" /></div>
        </div>
        <div class="row">
            <div class="col-2">Message</div>
            <div class="col-4"><a-input type="text" id="messageInput" /></div>
        </div>
        <div class="row">&nbsp;</div>
        <div class="row">
            <div class="col-6">
                <a-input type="button" id="sendButton" value="Send Message" />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <hr />
        </div>
    </div>
    <div class="row">
        <div class="col-6">
            <ul id="messagesList"></ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as signalR from '@microsoft/signalr'
// import { useSignalR } from '@quangdao/vue-signalr'; // vue的封装
import { onMounted } from 'vue'
interface HTMLElementPlus extends HTMLElement {
    disabled?: boolean
    value?: String
}
onMounted(() => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/chatHub') // 可后端支持跨域；前后端在同一域下；可设置谷歌浏览器允许跨域调试；proxy设置 ws: true, secure: false
        .withAutomaticReconnect() // 自动断开重连
        .build()
    console.log(connection)
    const sendButton = document.getElementById('sendButton') as HTMLElementPlus
    const messagesList = document.getElementById('messagesList') as HTMLElementPlus
    const userInput = document.getElementById('userInput') as HTMLElementPlus
    const messageInput = document.getElementById('messageInput') as HTMLElementPlus
    // Disable send button until connection is established
    sendButton.disabled = true

    connection.on('ReceiveMessage', (user: any, message: any) => {
        const li = document.createElement('li')
        messagesList.appendChild(li)
        // We can assign user-supplied strings to an element's textContent because it
        // is not interpreted as markup. If you're assigning in any other way, you
        // should be aware of possible script injection concerns.
        li.textContent = `${user} says ${message}`
    })
    connection
        .start()
        .then(() => {
            sendButton.disabled = false
        })
        .catch(function (err) {
            console.log(err)
            return console.error(err.toString())
        })

    sendButton.addEventListener('click', function (event) {
        const user = userInput.value
        const message = messageInput.value
        connection.invoke('SendMessage', user, message).catch(function (err) {
            return console.error(err.toString())
        })
        event.preventDefault()
    })
})
</script>
