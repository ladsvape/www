function findGetParameter (parameterName) {
    var result = null
    var tmp = []
    location.search.substr(1).split('&').forEach(function (item) {
        tmp = item.split('=')
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
    })
    return result
}

function initTrackOrder () {
    var element = document.getElementById('trackorder')
    if (!element) return

    var input = element.querySelector('input[name="tracking"]')
    var btn = element.querySelector('input[name="submit"]')
    if (!input || !btn) {
        console.error('initTrackOrder, could not find input field')
        return
    }

    input.value = findGetParameter('trackingno')
    btn.disabled = (input.value.length < 10)

    input.oninput = e => {
        btn.disabled = (e.target.value.length < 10)
    }

    setTimeout(() => input.focus(), 100)
}

export {initTrackOrder}
