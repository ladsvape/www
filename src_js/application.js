/* eslint no-unused-vars: ['error', { "vars": "all", "varsIgnorePattern": "[iI]gnored" }] */

import {initMap} from './maps'
import {googleAnalyticsKey, snipcartKey} from './authkeys'
import {initSmoke} from './smoke'
import {initPageTransition} from './pagetransition'
import {initProductImages, uninitProductImages} from './productimages'
import {initFixedNavigation} from './fixednavigation'
import {initTrackOrder} from './trackorder'
import {initChart} from './mixyourown'

document.addEventListener('DOMContentLoaded', () => {
    initSnipCart()
    initGoogleAnalytics()
    initProductImages()
    initFixedNavigation()
    initPageTransition(pageEnter, pageLeave)
    initSmoke()
    init18plusMessage()

    document.body.addEventListener('pageloaded', () => {
        if (window.ga) window.ga('send', 'pageview')
        var mapElement = document.getElementById('map')
        if (mapElement) initMap(mapElement)

        initDisquis()
        initChart()
        initTrackOrder()
        initProductOptions()
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

    initProductImages()
}

function pageLeave () {
    // pAnim.leave()
    uninitProductImages()

    var allLinks = document.querySelectorAll('[data-linkname]')
    for (var link of allLinks) link.classList.remove('active')

    var heroEl = document.querySelector('.hero-title')
    heroEl.classList.remove('pageTransitionIn')
    heroEl.classList.add('pageTransitionOut')
}

function initGoogleAnalytics () {
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
    var cardBtn = document.getElementById('btnSnipcard')
    if (cardBtn) cardBtn.dataset.loading = 'false'
    Snipcart.api.configure('show_continue_shopping', true)
    Snipcart.subscribe('cart.opened', function () {
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
    var closeEl = document.getElementById('snipcart-cartitems-continue-top')
    if (closeEl) closeEl.onclick = closeFun
    closeEl = document.getElementById('snipcart-close')
    if (closeEl) closeEl.onclick = closeFun
}

function initSnipCart () {
    // Unfortunately we need jQuery for snipcard
    if (!window.$) {
        var a = document.createElement('script')
        a.async = 1
        a.id = 'jquery'
        a.src = '/js/jquery.min.js'
        a.onload = function () {
            window.jQuery = window.jQuery.noConflict()
            window.$ = window.jQuery
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

function init18plusMessage () {
    var elem = document.querySelector('#plus18 .btn.confirm18plus')
    if (!elem || !localStorage) return

    if (localStorage.getItem('plus18') !== '1') {
        elem.addEventListener('click', () => localStorage.setItem('plus18', '1'))
        location.hash = 'plus18'
    }
}

function initProductOptions () {
    var addProductBtns = document.querySelectorAll('[data-item-id]')
    if (!addProductBtns) return
    for (var btn of addProductBtns) {
        var options = document.querySelectorAll('[data-for="' + btn.dataset.itemId + '"]')
        if (!options) return
        for (var option of options) {
            option.onchange = function () {
                if (this.name === 'quantity') {
                    btn.dataset.itemQuantity = this.value
                } else {
                    btn.dataset['itemCustom' + this.dataset.option + 'Value'] = this.value
                }
            }
        }
    }
}

function initDisquis () {
    var disqusElement = document.getElementById('disqus_thread')
    if (!disqusElement) return

    window.disqus_config = function () {
        this.page.url = location.href
        this.page.identifier = location.pathname
    }
    if (window.DISQUS) {
        window.DISQUS.reset({ reload: true, config: window.disqus_config })
        return
    }
    var s = document.createElement('script')
    s.id = 'disquis'
    s.src = 'https://ladsvape.disqus.com/embed.js'
    s.dataset.timestamp = 1 * new Date()
    document.body.appendChild(s)
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js').catch(err => {
        console.error('ServiceWorker registration failed: ', err)
    })
}
