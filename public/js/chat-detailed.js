(function () {
    let name = document.querySelector("#hidden-username").value
    console.log(name)
    let receiver = document.querySelector("#hidden-receiver").value
    console.log(receiver)
    function newUser(name) {
        socket.emit("new-user", name);
    }


    let socket = io("https://fixlancer.herokuapp.com")

    socket.on("new-user", function (user) {
        console.log(user)
    })

    newUser(name)


    const messageInput = document.querySelector("#message")

    const status = document.querySelector(".status");

    messageInput.addEventListener("focus", function (e) {
        socket.emit("typing", name)
    });

    messageInput.addEventListener("blur", function (e) {
        socket.emit("stopped-typing", name)
    });

    socket.on("typing-status", function (user) {
        status.style.display = "block"
        status.textContent = `${user} is typing`
    });

    socket.on("stopped-typing", function (user) {
        status.style.display = "none"
    });
    document.querySelector(".send-chat-button").addEventListener("click", (e) => {
        console.log("clicked")
        let message = messageInput.value
        console.log(message)
        return
        socket.emit("chat", { sender: name, receiver, message })
        const div = document.createElement("div")
        div.classList.add("sender")
        div.textContent = `Me: ${messageInput.value}`
        document.querySelector(".messages").appendChild(div);
        messageInput.value = ""

    })
    socket.on("chat", function (data) {
        const div = document.createElement("div")
        div.classList.add("reciever")
        div.textContent = `${data.sender}: ${data.message}`
        document.querySelector(".messages").appendChild(div)
    });

    const onlineHolder = document.querySelector(".online");

    socket.on("online-users", function (users) {
        users.forEach(user => {
            // if (user === name) onlineHolder.innerHTML += `<button disabled>${user}</button><br>`
            // else {
            //     onlineHolder.innerHTML += `<button class="to" onclick=selectUser(this.innerText)>${user}</button><br>`

            // }


        });
    });
    function selectUser(to) {
        console.log(receiver)
        receiver = to
        console.log(receiver)
    }
})()