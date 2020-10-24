(function () {
    const attachHolder = document.querySelector(".attach-requirement")
    const hiddenAttachment = document.querySelector(".hidden-attachment")
    const fileNameHolder = document.querySelector(".file-name")
    const startOrderBtn = document.querySelector(".start-order")
    const requirementsInput = document.querySelector("#requirements")
    const orderID = document.querySelector(".order-id").value



    let file = ""
    let fileName = ""

    attachHolder.addEventListener("click", function (e) {
        hiddenAttachment.click()

    });
    hiddenAttachment.addEventListener("input", function (e) {
        fileNameHolder.textContent = this.files[0].name

        // const reader = new FileReader()
        // reader.readAsDataURL(hiddenAttachment.files[0])
        // reader.onload = () => {
        //     file = reader.result
        //     fileName = this.files[0].name
        //     console.log(reader.result)

        // }
    });

    startOrderBtn.addEventListener("click", function () {
        const requirements = requirementsInput.value.trim()
        sendRequirements(requirements)

    })

    const sendRequirements = (requirements) => {
        const formData = new FormData()
        formData.append("requirements", requirements)
        formData.append("order_id", orderID)
        formData.append("file", hiddenAttachment.files[0])
        formData.append("fileName", hiddenAttachment.files[0].name)

        // for (let [key, value] of formData) {
        //     console.log(key)
        //     console.log(value)
        // }




        // const body = JSON.stringify({
        //     order_id: orderID,
        //     fileName,
        //     requirements,
        //     file


        // })
        // console.log(body)
        // return


        fetch("/api/requirements", {
            method: "post",
            body: formData

        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                location.href = `/dashboard/order-chat?oid=${orderID}`
            })

    }

})()