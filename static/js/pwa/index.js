if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("static/js/pwa/sw.js").then(registration => {
        console.log("SW Registered!")
        console.log(registration)
    }).catch(error =>  {
        console.log("SW Registration failed!")
        console.log(error)
    })
} else {
    console.log("SW cannot be registered!")
}