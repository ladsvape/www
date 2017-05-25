
function initDisquis () {
    var disqusElement = document.querySelector('#newpage #disqus_thread')
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
    s.crossorigin = 'anonymous'
    s.id = 'disquis'
    s.src = 'https://ladsvape.disqus.com/embed.js'
    s.dataset.timestamp = 1 * new Date()
    document.body.appendChild(s)
}

export {initDisquis}
