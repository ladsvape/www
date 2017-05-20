import jQuery from '../node_modules/jquery/dist/jquery.min'
window.jQuery = jQuery.noConflict()
window.$ = window.jQuery

var googleAnalyticsKey = 'UA-99603278-1'
var snipcartKey = 'NDZhN2MxYWQtZTBjMy00OWJmLWI0NDUtMTM3NTlhZGNkMTVlNjM2MzA2MDM4OTkzMzYwMDU4'

document.getElementById('open-nav').onclick = function () {
    document.body.classList.toggle('nav-open')
    return false
};

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r
    i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }
    i[r].l = 1 * new Date()
    a = s.createElement(o)
    m = s.getElementsByTagName(o)[0]
    a.async = 1
    a.src = g
    a.onload = function () {
        window[r]('create', googleAnalyticsKey, 'auto')
        window[r]('send', 'pageview')
    }
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

(function () {
    var a = document.createElement('script')
    var m = document.getElementsByTagName('script')[0]
    a.async = 1
    a.id = 'snipcart'
    a.dataset.apiKey = snipcartKey
    a.src = 'https://cdn.snipcart.com/scripts/2.0/snipcart.js'
    a.onload = function () {
        window.Snipcart.execute('config', 'show_continue_shopping', true)
    }
    m.parentNode.insertBefore(a, m)
})()

window.disqus_config = function () {
    this.page.url = location.href
    this.page.identifier = location.pathname
};

(function () {
    if (document.getElementById('disqus_thread')) {
        var d = document
        var s = d.createElement('script')
        s.src = 'https://ladsvape.disqus.com/embed.js'
        s.dataset.timestamp = 1 * new Date()
        var elem = (d.head || d.body)
        elem.appendChild(s)
    }
})()

var event = new Event('apploaded')
document.body.dispatchEvent(event)
