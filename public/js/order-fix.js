(function () {
    let buyer = document.cookie.split(";").map(item => { return item.trim() }).find(cookie => { return cookie.includes("username=") }).split("=")[1]
    let seller = document.querySelector(".seller").innerText.trim()
    const jobId = document.getElementById("job-id").value
    const deliveryDays = document.getElementById("delivery_days").value
    const totalPrice = document.querySelector(".total-price").innerText.substr(1) * 1


    const confirmPaymentBTN = document.querySelector(".confirm-payment")
    if (confirmPaymentBTN)
        confirmPaymentBTN.addEventListener("click", function () {
            document.querySelector(".modal-wrapper").classList.remove("hide")
            createOrder(seller, buyer)
                .then((data) => {
                    sendNotice(buyer, "new order", seller)
                    sendNotice(seller, "new sale", buyer)
                    createTransaction(buyer, data)
                        .then(data => {

                            setTimeout(() => {
                                location.href = "/dashboard/order-requirements"

                            }, 3000)
                            // console.log(data)
                        })

                })

        })

    async function createTransaction(username, inData) {
        const data = {
            username,
            type: "order payment",
            amount: totalPrice,
            content: {
                order_id: inData.data.order_id,
                job_id: inData.data.job_id
            }
        }

        const outData = await fetchData(data, "/api/transactions")
        return outData

    }

    async function createOrder() {
        let date = new Date()
        const data = {
            seller,
            buyer,
            delivery_date: new Date(date.setDate(date.getDate() + deliveryDays * 1)),
            job_id: jobId
        }
        const outData = await fetchData(data, "/api/sales")

        // console.log(outData)
        return outData



    }

    async function fetchData(data, url) {
        const resp = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const outData = await resp.json()


        return outData

    }
    function sendNotice(to, type, from) {
        const data = {
            username: to,
            type,
            content: {
                job_id: jobId,
                from
            }
        }
        fetchData(data, "/api/notices")
            .then(data => {
                // console.log(data)
            })

    }
})()