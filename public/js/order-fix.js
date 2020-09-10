(function () {
    let buyer = document.cookie.split(";").map(item => { return item.trim() }).find(cookie => { return cookie.includes("username=") }).split("=")[1]
    let seller = document.querySelector(".seller").innerText.trim()
    const jobId = document.getElementById("job-id").value


    const confirmPaymentBTN = document.querySelector(".confirm-payment")
    if (confirmPaymentBTN)
        confirmPaymentBTN.addEventListener("click", function () {
            sendNotice(buyer, "new order", seller)
            sendNotice(seller, "new sale", buyer)


        })



    function sendNotice(to, type, from) {
        const data = {
            username: to,
            type,
            content: {
                job_id: jobId,
                from
            }
        }

        fetch("/api/notices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data)
            })

    }
})()