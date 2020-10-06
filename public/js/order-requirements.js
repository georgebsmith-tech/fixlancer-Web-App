(function () {
    const attachHolder = document.querySelector(".attach-requirement")
    const hiddenAttachment = document.querySelector(".hidden-attachment")
    const fileNameHolder = document.querySelector(".file-name")
    const startOrderBtn = document.querySelector(".start-order")
    const requirementsInput = document.querySelector("#requirements")
    const orderID = document.querySelector(".order-id").value





    attachHolder.addEventListener("click", function (e) {
        hiddenAttachment.click()

    });
    hiddenAttachment.addEventListener("input", function (e) {
        console.log(this.files[0])
        fileNameHolder.textContent = this.files[0].name
    });

    startOrderBtn.addEventListener("click", function () {
        const requirements = requirementsInput.value.trim()
        sendRequirements(requirements)

    })

    const sendRequirements = (requirements) => {
        const body = JSON.stringify({
            requirements,
            order_id: orderID
        })

        fetch("/api/requirements", {
            method: "post",
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                location.href = `/dashboard/order-chat?oid=${orderID}`
            })

    }

})()