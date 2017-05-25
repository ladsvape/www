import {snipcartKey} from './authkeys'

function adjustCloseBtn (elem) {
    if (elem) {
        elem.classList.remove('snip-layout__close')
        elem.classList.add('snip-btn')
        elem.textContent = 'Close cart'
    }
}

function snipcartReady (Snipcart) {
    console.log('ready cart')
    // The cart is ready, hide the loading spinner on the cart btn
    var cardBtns = document.querySelectorAll('a.cart.snipcart-checkout')
    if (cardBtns) for (var cardBtn of cardBtns) cardBtn.dataset.loading = 'false'

    var closeEl = document.getElementById('snipcart-cartitems-continue-top')
    var closeSimpleEl = document.getElementById('snipcart-close')
    adjustCloseBtn(closeSimpleEl)
    if (closeEl) closeEl.classList.add('js-show')

    // Add transition/animation effects
    Snipcart.api.configure('show_continue_shopping', true)
    Snipcart.subscribe('cart.opened', function () {
        adjustCloseBtn(closeSimpleEl)
        if (closeEl) closeEl.classList.add('js-show')
        var snipcartEl = document.querySelector('.snip-layout')
        snipcartEl.classList.remove('cardTransitionOut')
        snipcartEl.classList.add('cardTransitionIn')
    })

    var closeFun = function (event) {
        event.stopPropagation()
        event.preventDefault()
        var snipcartEl = document.querySelector('.snip-layout')
        snipcartEl.classList.remove('cardTransitionIn')
        snipcartEl.classList.add('cardTransitionOut')
        setTimeout(() => { Snipcart.api.modal.close() }, 600)
    }
    if (closeEl) closeEl.onclick = closeFun
    if (closeSimpleEl) closeEl.onclick = closeFun
}

function initSnipCart () {
    // Unfortunately we need jQuery for snipcard
    if (!window.$) {
        var a = document.createElement('script')
        a.async = 1
        a.id = 'jquery'
        a.src = '/js/jquery.min.js'
        a.onload = function () {
            window.jQuery.readyException = function (error) {
                console.error(error)
            }
            if (!window.Snipcart) {
                var a = document.createElement('script')
                a.async = 1
                a.id = 'snipcart'
                a.dataset.apiKey = snipcartKey
                a.src = '/js/snipcart2_0.js'
                a.onload = function () {
                    window.Snipcart.subscribe('cart.ready', () => snipcartReady(window.Snipcart))
                }
                document.body.appendChild(a)
            }
        }
        document.body.appendChild(a)
    }
}

export {initSnipCart, snipcartReady}
