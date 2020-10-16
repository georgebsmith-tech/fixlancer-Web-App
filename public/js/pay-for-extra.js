(
    function () {
        const payNowBTN = document.querySelector("#pay-now")
        const order_id = payNowBTN.dataset.orderid
        const extra_id = payNowBTN.dataset.extraid
        payNowBTN.addEventListener("click", function () {
            makePayment()
        })


        async function makePayment() {
            const response = await fetch("/api/orderchats", {
                method: "put",
                body: JSON.stringify({
                    order_id,
                    extra_id
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json()
            console.log(data)
            location.href = `/dashboard/order-chat?oid=${order_id}`


        }

    }

)()