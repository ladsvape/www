var registeredElements = {}

function mouseMove (e) {
    var elems = registeredElements[e.currentTarget.id]
    if (!elems) return
    var elForeground = elems.elForeground
    var elBottle = elems.elBottle
    var rect = e.target.getBoundingClientRect()
    var trX = (e.clientX - rect.left - rect.width / 2) * 0.1
    var trY = (e.clientY - rect.top - rect.height / 2) * 0.1
    if (elForeground) elForeground.style.transform = ('translate(' + trX + 'px,' + trY + 'px)')
    trX = trX * 0.5
    trY = trY * 0.5
    if (elBottle) elBottle.style.transform = ('translate(' + trX + 'px,' + trY + 'px)')
}

function initProductImages () {
    var elems = document.querySelectorAll('a.styles')
    if (!elems) return
    elems.forEach(elem => {
        var elBottle = elem.querySelector('.bottle')
        if (!elBottle || !elem.id) return

        registeredElements[elem.id] = {
            el: elem,
            elBottle: elBottle,
            elForeground: elem.querySelector('.fg')
        }
        elem.addEventListener('mousemove', mouseMove)
    })
}

function uninitProductImages () {
    for (var i in registeredElements) {
        registeredElements[i].el.removeEventListener('mousemove', mouseMove)
    }
    registeredElements = {}
}

export {initProductImages, uninitProductImages}
