function initFixedNavigation () {
    document.getElementById('open-nav').onclick = function () {
        document.body.classList.toggle('nav-open')
        return false
    }

    let elem = document.getElementById('mainnav')
    let headerEl = document.querySelector('header')
    const navY = headerEl.getBoundingClientRect().height - elem.getBoundingClientRect().height
    if (!elem) {
        console.error('initFixedNavigation element not found')
        return
    }
    let isFixed = false
    let clone = null

    document.addEventListener('scroll', e => {
        if (window.scrollY > navY) {
            if (!isFixed) {
                isFixed = true
                clone = elem.cloneNode(true)
                clone.classList.add('navbar-fixed')
                clone.classList.add('container')
                document.body.appendChild(clone)
            }
        } else if (isFixed) {
            isFixed = false
            clone.classList.remove('navbar-fixed')
            document.body.removeChild(clone)
            clone = null
        }
    })
}

export {initFixedNavigation}
