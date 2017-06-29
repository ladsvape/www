/* eslint no-unused-vars: ['error', { "vars": "all", "varsIgnorePattern": "[iI]gnored" }] */

import {initMap} from './maps'
import {googleAnalyticsKey} from './authkeys'
// import {initSmoke} from './smoke'
import {initPageTransition} from './pagetransition'
import {initProductImages, uninitProductImages} from './productimages'
import {initFixedNavigation} from './fixednavigation'
import {initTrackOrder} from './trackorder'
import {initMixYourOwn} from './mixyourown'
import {initSnipCart} from './shoppingcart'
import {initDisquis} from './disqus'

document.addEventListener('DOMContentLoaded', () => {
    initSnipCart()
    initGoogleAnalytics()
    initProductImages()
    initFixedNavigation()
    initPageTransition(pageEnter, pageLeave)
    // initSmoke()
    init18plusMessage()

    // The "pagetransition.js" triggers a 'pageloaded' event when the face-in animation is completed
    document.body.addEventListener('pageloaded', () => {
        if (window.ga) window.ga('send', 'pageview')
        initProductImages()
        initMap()
        initDisquis()
        initMixYourOwn()
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
    a.crossorigin = 'anonymous'
    a.async = 1
    a.src = 'https://www.google-analytics.com/analytics.js'
    a.onload = function () {
        window[r]('create', googleAnalyticsKey, 'auto')
        window[r]('send', 'pageview')
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

/* Responsible for the SIZE and QUANTITY fields on the product page */
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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js').catch(err => {
        console.error('ServiceWorker registration failed: ', err)
    })
}
