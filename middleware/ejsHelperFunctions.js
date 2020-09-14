const app = require("express")()
const ejs = require("ejs")
module.exports = app.locals.renderSalesAndOrder = (order) => {

    return `<div class="font14 grid-table padd20-top padd10-bottom border-bottom padd10-sides">
    <div class="flex"><span class="user-avatar"
            data-color="${order.sellerColor}">${order.seller[0].toUpperCase()}</span>${order.seller}
    </div>
    <div class="flex">
        <a href="#" class="flex"
            style="width: 40px;height: 30px;overflow: hidden;margin-right: 10px;"><img
                src="${order.image_url}" alt="" ">
        </a>

        <a href=" #" class=" text-orange hover-underline">${order.title}</a>
    </div>
    <div class="flex">${order.delivery_date.toDateString()}</div>
    <div class="flex"> ₦${order.price}</div>
</div>
    `
}




