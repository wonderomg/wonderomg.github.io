/* eslint-disable node/no-unsupported-features/node-builtins */
(function($) {
    if (typeof Pjax === 'undefined') {
        return;
    }

    function sanitizePath(url) {
        const paths = url.replace(/(^\w+:|^)\/\//, '').split('#')[0].split('/').filter(p => p.trim() !== '');
        const normalized = paths.length > 0 && paths[paths.length - 1] === 'index.html'
            ? paths.slice(0, paths.length - 1)
            : paths;
        return normalized.join('/');
    }

    function isSamePath(a, b) {
        return sanitizePath(a) === sanitizePath(b);
    }

    function updateNavbarActive() {
        const current = sanitizePath(window.location.href);
        $('.navbar-main .navbar-start .navbar-item').each(function() {
            const href = $(this).attr('href');
            $(this).toggleClass('is-active', isSamePath(href, current));
        });
    }

    function syncBodyClass() {
        const container = document.getElementById('pjax-container');
        if (container && container.dataset.bodyClass) {
            document.body.className = container.dataset.bodyClass;
        }
    }

    function runContainerScripts() {
        document.querySelectorAll('#pjax-container script').forEach(item => {
            const script = document.createElement('script');
            Array.from(item.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
            const content = item.text || item.textContent || item.innerHTML || '';
            if (content) {
                script.appendChild(document.createTextNode(content));
            }
            item.parentNode.replaceChild(script, item);
        });
    }

    function refreshPage() {
        syncBodyClass();
        updateNavbarActive();
        runContainerScripts();
        if (typeof window.icarusInitPage === 'function') {
            window.icarusInitPage();
        }
        if (typeof window.icarusInitBackToTop === 'function') {
            window.icarusInitBackToTop();
        }
        window.scrollTo(0, 0);
    }

    document.addEventListener('pjax:complete', refreshPage);

    document.addEventListener('pjax:error', function(e) {
        if (e.request && e.request.status === 404) {
            window.pjax.loadUrl('/404.html');
        }
    });

    window.pjax = new Pjax({
        elements: 'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"]):not([href^="mailto:"]):not([href$=".xml"])',
        selectors: ['title', '#pjax-container'],
        cacheBust: false,
        scrollRestoration: false
    });
}(jQuery));
