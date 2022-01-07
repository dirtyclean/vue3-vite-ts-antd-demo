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
onMounted(() => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/chatHub', {
            webSocket: ''
        })
        .withAutomaticReconnect() // 自动断开重连
        .build()
    console.log(connection)
    const sendButton = document.getElementById('sendButton')
    const messagesList = document.getElementById('messagesList')
    const userInput = document.getElementById('userInput')
    const messageInput = document.getElementById('messageInput')
    // Disable send button until connection is established
    sendButton.disabled = true

    connection.on('ReceiveMessage', function (user, message) {
        const li = document.createElement('li')
        messagesList.appendChild(li)
        // We can assign user-supplied strings to an element's textContent because it
        // is not interpreted as markup. If you're assigning in any other way, you
        // should be aware of possible script injection concerns.
        li.textContent = `${user} says ${message}`
    })
    console.log('==========')
    connection
        .start()
        .then(function () {
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
