(function($, window) {
  function initBackToTop() {
    const $button = $('#back-to-top');
    if (!$button.length) return;

    const $footer = $('footer.footer');
    const rightMargin = 20;
    const bottomMargin = 20;
    const showOffset = 240;
    let lastState = null;
    const state = {
        base: {
            classname: 'card has-text-centered',
            right: rightMargin,
            width: 44,
            bottom: bottomMargin
        }
    };
    state.hidden = Object.assign({}, state.base, {
        classname: state.base.classname + ' rise-up'
    });
    state.visible = Object.assign({}, state.hidden, {
        classname: state.hidden.classname + ' fade-in is-rounded'
    });

    function isStateEquals(prev, next) {
        return ![].concat(Object.keys(prev), Object.keys(next)).some(key => {
            return !Object.prototype.hasOwnProperty.call(prev, key)
                || !Object.prototype.hasOwnProperty.call(next, key)
                || next[key] !== prev[key];
        });
    }

    function applyState(state) {
        if (lastState !== null && isStateEquals(lastState, state)) {
            return;
        }
        $button.attr('class', state.classname);
        for (const prop in state) {
            if (prop === 'classname') {
                continue;
            }
            $button.css(prop, state[prop]);
        }
        lastState = state;
    }

    function getScrollTop() {
        return $(window).scrollTop();
    }

    function getScrollBottom() {
        return $(window).scrollTop() + $(window).height();
    }

    function getButtonWidth() {
        return $button.outerWidth(true);
    }

    function getButtonHeight() {
        return $button.outerHeight(true);
    }

    function update() {
        if (getScrollTop() < showOffset) {
            applyState(state.hidden);
            return;
        }

        const footerTop = $footer.length ? $footer.offset().top : Number.POSITIVE_INFINITY;
        const overlap = Math.max(0, getScrollBottom() + bottomMargin - footerTop);
        applyState(Object.assign({}, state.visible, {
            bottom: bottomMargin + overlap
        }));
    }

    update();
    $(window).off('resize.icarusBackToTop').on('resize.icarusBackToTop', update);
    $(window).off('scroll.icarusBackToTop').on('scroll.icarusBackToTop', update);

    $button.off('click.icarusBackToTop').on('click.icarusBackToTop', () => {
        if (CSS && CSS.supports && CSS.supports('(scroll-behavior: smooth)')) {
            window.scroll({ top: 0, behavior: 'smooth' });
        } else {
            $('body, html').animate({ scrollTop: 0 }, 400);
        }
    });
  }

  window.icarusInitBackToTop = initBackToTop;
  $(document).ready(initBackToTop);
}(jQuery, window));
