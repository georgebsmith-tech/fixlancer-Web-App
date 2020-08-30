
(function () {
    const colors = document.querySelectorAll(".hidden-receiver-colors")
    const avatars = document.querySelectorAll(".user-avatar")
    colors.forEach((color, index) => {
        avatars[index].style.background = color.value
        console.log(avatars[index])
        console.log(color.value)

    })


})()