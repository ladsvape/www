/* eslint no-unused-vars: ['error', { "vars": "all", "varsIgnorePattern": "[iI]gnored" }] */

import jQuery from '../node_modules/jquery/dist/jquery.min'
import {initMap} from './maps'
import {googleAnalyticsKey, snipcartKey} from './authkeys'
import {initSmoke} from './smoke'
import {initPageTransition} from './pagetransition'
import {initProductImages, uninitProductImages} from './productimages'
import {initFixedNavigation} from './fixednavigation'
import {initTrackOrder} from './trackorder'

// Unfortunately we need jQuery for snipcard
window.jQuery = jQuery.noConflict()
window.$ = window.jQuery

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
    Snipcart.api.configure('show_continue_shopping', true)
    Snipcart.subscribe('cart.opened', function () {
        var snipcartEl = document.querySelector('.snip-layout')
        snipcartEl.classList.remove('cardTransitionOut')
        snipcartEl.classList.add('cardTransitionIn')
    })

    var closeEl = document.getElementById('snipcart-cartitems-continue-top')
    closeEl.onclick = function (event) {
        var snipcartEl = document.querySelector('.snip-layout')
        snipcartEl.classList.remove('cardTransitionIn')
        snipcartEl.classList.add('cardTransitionOut')
        setTimeout(() => { Snipcart.api.modal.close() }, 600)
        event.stopPropagation()
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

function initChart () {
    var chart = document.getElementById('flavourchart')
    if (!chart) {
        var chartscript = document.getElementById('chartscript')
        if (!chartscript) return
        chartscript.onload = () => initChart()
        return
    }

    var flavours = document.querySelectorAll('[data-flavourid]')
    var labels = []
    var quantities = []
    var colors = []

    for (var flavour of flavours) {
        labels.push(flavour.dataset.flavourname)
        var storedValue = localStorage.getItem(flavour.dataset.flavourid)
        if (!storedValue) storedValue = flavour.value
        quantities.push(storedValue)
        colors.push(flavour.dataset.flavourcolor)
    }

    var data = {
        labels: labels,
        datasets: [{ data: quantities, backgroundColor: colors, hoverBackgroundColor: colors }]
    }

    /* exported myChart */
    var chartObj = new window.Chart(chart, {
        type: 'pie',
        data: data,
        options: {
            cutoutPercentage: 0
        }
    })

    var dataChangeFun = function (dataIndex) {
        chartObj.data.datasets[0].data[dataIndex] = '' + this.value
        console.log('update', this.dataset.flavourid, this.value)
        localStorage.setItem(this.dataset.flavourid, '' + this.value)
        chartObj.update()
    }

    var d = document.getElementById('name')
    if (d) {
        d.value = localStorage.getItem('flavour_username')
        d.onchange = function () { localStorage.setItem('flavour_username', this.value) }
    }
    d = document.getElementById('_replyto')
    if (d) {
        d.value = localStorage.getItem('flavour_email')
        d.onchange = function () { localStorage.setItem('flavour_email', this.value) }
    }

    for (var i = 0; i < flavours.length; ++i) {
        flavours[i].onchange = dataChangeFun.bind(flavours[i], i)
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js').catch(err => {
        console.error('ServiceWorker registration failed: ', err)
    })
}
