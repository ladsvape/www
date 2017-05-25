import Barba from '../node_modules/barba.js/dist/barba.min'

class ProductAnimation {
    leave () {
        // The new Container is ready and attached to the DOM.
        var detailImage = document.querySelector('[data-transitiontype="dest"]')
        if (!detailImage) return
        this.id = detailImage.dataset.transitionid

        if (!this.id) return
        var overviewImages = document.querySelectorAll('[data-transitiontype="source"]')
        var overviewImage
        for (var overviewImage_ of overviewImages) {
            if (overviewImage_.dataset.transitionid === this.id) {
                overviewImage = overviewImage_
                break
            }
        }
        if (!overviewImage) return
        this.toDetails = window.location.pathname.indexOf('products/') > 0

        // Assign to src- and destImage depending on the direction
        if (this.toDetails) {
            this.srcImage = overviewImage
            this.destImage = detailImage
        } else {
            this.srcImage = detailImage
            this.destImage = overviewImage
        }

        // Get dimensions and position
        var rect = this.srcImage.getBoundingClientRect()
        // Clone object and apply dimensions and position
        this.clone = this.srcImage.cloneNode(true)

        document.body.appendChild(this.clone)
        this.clone.id = 'transitionclone'
        this.clone.style.height = rect.height + 'px'
        this.clone.style.width = rect.width + 'px'
        this.clone.style.position = 'fixed'
        this.clone.style.top = rect.top + 'px'
        this.clone.style.left = rect.left + 'px'
        this.clone.style.transition = 'all 0.3s'
        var tr = 'left top'
        this.clone.style.webkitTransformOrigin = tr
        this.clone.style.MozTransformOrigin = tr
        this.clone.style.msTransformOrigin = tr
        this.clone.style.OTransformOrigin = tr
        this.clone.style.transformOrigin = tr

        // Hide original and destination image
        overviewImage.style.visibility = 'hidden'
        detailImage.style.visibility = 'hidden'
    }

    enter () {
        if (!this.destImage || !this.clone) return
        // make src image visible again
        if (this.srcImage) this.srcImage.style.visibility = 'visible'
        // The Container has just been removed from the DOM.
        // We get the final position for the image that way
        var destPos = this.destImage.getBoundingClientRect()
        var srcPos = this.clone.getBoundingClientRect()
        var trX = Math.round(destPos.left - srcPos.left)
        var trY = Math.round(destPos.top - srcPos.top)
        var scX = destPos.width / srcPos.width
        var scY = destPos.height / srcPos.height
        var tr = ('translate(' + trX + 'px,' + trY + 'px) scale(' + scX + ',' + scY + ')')
        this.clone.style.webkitTransform = tr
        this.clone.style.MozTransform = tr
        this.clone.style.msTransform = tr
        this.clone.style.OTransform = tr
        this.clone.style.transform = tr
        setTimeout(() => {
            // The animation has just finished.
            if (this.clone) document.body.removeChild(this.clone)
            this.clone = null
            this.srcImage = null
            this.destImage.style.visibility = 'visible'
            this.destImage = null
        }, 500)
    }
}

var pageLeave = null
var pageEnter = null
var productAnimation = new ProductAnimation()

var FadeTransition = Barba.BaseTransition.extend({
    /* this.newContainerLoading is a Promise for the loading of the new container */
    start: function () {
        window.usedTransition = true
        Promise.all([this.newContainerLoading, this.fadeOut()]).then(this.fadeIn.bind(this))
    },
    /* this.oldContainer is the HTMLElement of the old Container */
    fadeOut: function () {
        var timeout = new Promise((resolve, reject) => setTimeout(resolve, 500))
        this.oldContainer.id = 'oldpage'
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

        productAnimation.enter()
        document.body.dispatchEvent(new Event('pageloaded'))
        pageEnter(this.newContainer)

        timeout.then(() => {
            this.newContainer.classList.remove('pageTransitionIn')
            this.done()
        })
    }
})

// Create an ProductAnimation instance. We use the Barba View
// functionality to trigger the "leave" sequence, where the
// product image is reattachted to the body element and kept
// visible while the rest of the page fades out.
// Unfortunately, the other hooks are too late in the process,
// so we trigger the move to the final product image destination
// in the FadeTransition::fadeIn.
Barba.BaseView.extend({
    namespace: 'homepage',
    onEnter: () => productAnimation.leave()
}).init()

Barba.Pjax.getTransition = () => FadeTransition

// You need to provide a pageEnter and pageLeave function,
// which is called by the FadeTransition.
function initPageTransition (pageEnter_, pageLeave_) {
    Barba.Pjax.start()
    pageEnter = pageEnter_
    pageLeave = pageLeave_
    // Barba.Prefetch.init()
}

export {initPageTransition}
