import jQuery from '../node_modules/jquery/dist/jquery.min'
window.jQuery = jQuery.noConflict()
window.$ = window.jQuery

var google_analytics_key = "UA-99603278-1"
var snipcart_key = "NDZhN2MxYWQtZTBjMy00OWJmLWI0NDUtMTM3NTlhZGNkMTVlNjM2MzA2MDM4OTkzMzYwMDU4"

document.getElementById("open-nav").onclick = function () {
    document.body.classList.toggle("nav-open")
    return false
};

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', google_analytics_key, 'auto');
ga('send', 'pageview');

(() => {
    var a = document.createElement('script')
    var m = document.getElementsByTagName('script')[0]
    a.async = 1
    a.id = 'snipcart'
    a.dataset.apiKey = snipcart_key
    a.src = 'https://cdn.snipcart.com/scripts/2.0/snipcart.js'
    m.parentNode.insertBefore(a, m)
})()

var disqus_config = function () {
    this.page.url = location.href
    this.page.identifier = location.pathname
};

(function() {
    if (document.getElementById('disqus_thread')) {
        var d = document, s = d.createElement('script')
        s.src = 'https://ladsvape.disqus.com/embed.js'
        s.dataset.timestamp = 1 * new Date()
        var elem = (d.head || d.body)
        elem.appendChild(s);
    }
})();

var event = new Event('apploaded');
document.body.dispatchEvent(event);