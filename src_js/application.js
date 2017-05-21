import jQuery from '../node_modules/jquery/dist/jquery.min'
import Barba from '../node_modules/barba.js/dist/barba.min'
import {initMap} from './maps'
import {googleAnalyticsKey, snipcartKey} from './authkeys'
import {smokemachine} from './smoke'

window.jQuery = jQuery.noConflict()
window.$ = window.jQuery

document.getElementById('open-nav').onclick = function () {
    document.body.classList.toggle('nav-open')
    return false
}

var FadeTransition = Barba.BaseTransition.extend({
    /* this.newContainerLoading is a Promise for the loading of the new container */
    start: function () {
        window.usedTransition = true
        Promise.all([this.newContainerLoading, this.fadeOut()]).then(this.fadeIn.bind(this))
    },
    /* this.oldContainer is the HTMLElement of the old Container */
    fadeOut: function () {
        var timeout = new Promise((resolve, reject) => setTimeout(resolve, 500))
        this.oldContainer.classList.add('pageTransitionOut')
        pageLeave()
        return timeout.then(() => {
            this.oldContainer.style.display = 'none'
        })
    },
    /* At this stage this.newContainer (HTMLElement) is on the DOM (inside #barba-container, visibility: hidden)
     * Call this.done() after you are done! */
    fadeIn: function () {
        this.newContainer.style.visibility = 'visible'
        this.newContainer.classList.add('pageTransitionIn')
        var timeout = new Promise((resolve, reject) => setTimeout(resolve, 500))
        pageEnter(this.newContainer)
        timeout.then(() => {
            this.newContainer.classList.remove('pageTransitionIn')
            this.done()
            document.body.dispatchEvent(new Event('pageloaded'))
        })
    }
})

Barba.Pjax.getTransition = () => FadeTransition

document.addEventListener('DOMContentLoaded', e => {
    initSnipCart()
    initGA()
    Barba.Pjax.start()
    // Barba.Prefetch.init()
    var canvasElement = document.getElementById('backgroundcanvas')
    if (canvasElement) initSmoke(canvasElement)

    document.body.addEventListener('pageloaded', event => {
        if (window.ga) window.ga('send', 'pageview')
        var mapElement = document.getElementById('map')
        if (mapElement) initMap(mapElement)

        var disqusElement = document.getElementById('disqus_thread')
        if (disqusElement) initDisquis(disqusElement)
    })

    if (!window.usedTransition) document.body.dispatchEvent(new Event('pageloaded'))
})

function pageEnter (newContentEl) {
    // Update links
    var currentLinkData = newContentEl.dataset
    var allLinks = document.querySelectorAll('[data-linkname]')
    for (var link of allLinks) {
        link.classList.remove('active')
        if (link.dataset.linkname === currentLinkData.pagetitle) {
            link.classList.add('active')
        }
    }

    // Update title
    var heroEl = document.querySelector('.hero-title')
    heroEl.textContent = currentLinkData.hero
    heroEl.classList.remove('pageTransitionOut')
    heroEl.classList.add('pageTransitionIn')

    // Update hero and hero image
    var heroImgEl = document.querySelector('.hero-image')
    if (currentLinkData.heroimage) {
        heroImgEl.style.backgroundImage = 'url(' + currentLinkData.heroimage + ')'
    } else {
        heroImgEl.style.backgroundImage = ''
    }
}

function pageLeave () {
    var allLinks = document.querySelectorAll('[data-linkname]')
    for (var link of allLinks) link.classList.remove('active')

    var heroEl = document.querySelector('.hero-title')
    heroEl.classList.remove('pageTransitionIn')
    heroEl.classList.add('pageTransitionOut')
}

function initSmoke (canvas) {
    console.log('start smoke')
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    var party = smokemachine(canvas, canvas.getContext('2d'), [1, 5, 253])
    party.start()

    document.addEventListener('resize', function (e) {
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
    })

    document.addEventListener('mousemove', function (e) {
        var x = e.clientX
        var y = e.clientY
        var n = 0.5
        var t = Math.floor(Math.random() * 200) + 3800
        party.addsmoke(x, y, n, t)
    })

    setInterval(() => party.addsmoke(window.innerWidth / 2, window.innerHeight, 1), 100)
}

function initGA () {
    var r = 'ga'
    window['GoogleAnalyticsObject'] = 'ga'
    window[r] = window[r] || function () { (window[r].q = window[r].q || []).push(arguments) }
    window[r].l = 1 * new Date()
    var a = document.createElement('script')
    a.async = 1
    a.src = 'https://www.google-analytics.com/analytics.js'
    a.onload = function () {
        window[r]('create', googleAnalyticsKey, 'auto')
        window[r]('send', 'pageview')
    }
    document.body.appendChild(a)
}

function snipcartReady (Snipcart) {
    Snipcart.api.configure('show_continue_shopping', true)
    Snipcart.subscribe('cart.opened', function () {
        var snipcartEl = document.querySelector('.snip-layout')
        snipcartEl.classList.remove('cardTransitionOut')
        snipcartEl.classList.add('cardTransitionIn')
    })
    var closeEl = document.getElementById('snipcart-cartitems-continue-top')
    closeEl.onclick = function (event) {
        // var snipcartEl = document.querySelector('.snip-layout')
        // snipcartEl.style.display = 'block'
        // snipcartEl.classList.remove('cardTransitionIn')
        // snipcartEl.classList.add('cardTransitionOut')
        // setTimeout(() => { snipcartEl.style.display = 'none' }, 600)
        // event.stopPropagation()
    }
}

function initSnipCart () {
    var a = document.createElement('script')
    a.async = 1
    a.id = 'snipcart'
    a.dataset.apiKey = snipcartKey
    a.src = 'https://cdn.snipcart.com/scripts/2.0/snipcart.js'
    a.onload = function () {
        window.Snipcart.subscribe('cart.ready', () => snipcartReady(window.Snipcart))
    }
    document.body.appendChild(a)
}

function initDisquis (domEl) {
    window.disqus_config = function () {
        this.page.url = location.href
        this.page.identifier = location.pathname
    }
    var s = document.createElement('script')
    s.src = 'https://ladsvape.disqus.com/embed.js'
    s.dataset.timestamp = 1 * new Date()
    domEl.parentElement.appendChild(s)
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js').catch(err => {
        console.error('ServiceWorker registration failed: ', err)
    })
}
