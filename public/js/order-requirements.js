(function () {
    const attachHolder = document.querySelector(".attach-requirement")
    const hiddenAttachment = document.querySelector(".hidden-attachment")
    const fileNameHolder = document.querySelector(".file-name")

    attachHolder.addEventListener("click", function (e) {
        hiddenAttachment.click()

    });
    hiddenAttachment.addEventListener("input", function (e) {
        console.log(this.files[0])
        fileNameHolder.textContent = this.files[0].name
    });

})()