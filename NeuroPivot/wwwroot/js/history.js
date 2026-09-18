window.nobsHistory = {
    dotNetHelper: null,

    init: function (helper) {
        this.dotNetHelper = helper;
        window.removeEventListener('popstate', this.onPopState);
        window.addEventListener('popstate', this.onPopState.bind(this));
    },

    pushState: function (view) {
        if (view === 'landing') {
            if (window.location.hash) {
                history.pushState({ view: 'landing' }, '', window.location.pathname);
            }
            return;
        }
        if (history.state && history.state.view === view) return;
        history.pushState({ view: view }, '', '#' + view);
    },

    onPopState: function (event) {
        if (window.nobsHistory.dotNetHelper) {
            var view = (event.state && event.state.view) ? event.state.view : 'landing';
            window.nobsHistory.dotNetHelper.invokeMethodAsync('OnBrowserNavigate', view);
        }
    }
};

window.nobsSendSuggestion = async function (title, details, username) {
    try {
        const cleanTitle = title ? title.trim() : "Suggestion";
        const cleanText = details ? details.trim() : "";
        const cleanName = username ? username.trim() : "Community Member";
        const response = await fetch("https://formsubmit.co/ajax/a9488c179efdda8c378f626668549d3f", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "_replyto": "tseas151@gmail.com",
                "_subject": cleanTitle,
                "_template": "basic",
                "_captcha": "false",
                "user": cleanName,
                "title": cleanTitle,
                "message": cleanText
            })
        });

        const data = await response.json();
        const isSuccess = data.success === "true" || data.success === true;
        return {
            success: isSuccess,
            message: data.message || (isSuccess ? "Thank you! Your suggestion has been sent directly to the team." : "Failed to submit suggestion.")
        };
    } catch (err) {
        return {
            success: false,
            message: err.message || "Network error submitting suggestion."
        };
    }
};

window.nobsScrollTable = {
    init: function (el) {
        if (!el) {
            el = document.querySelector('.habit-scroll-wrapper');
        }
        if (!el) return;

        const saved = sessionStorage.getItem('nobs_habit_table_scroll_x');
        if (saved !== null && saved !== undefined) {
            const pos = parseFloat(saved) || 0;
            el.scrollLeft = pos;
            requestAnimationFrame(() => {
                el.scrollLeft = pos;
            });
            setTimeout(() => {
                el.scrollLeft = pos;
            }, 60);
        }

        if (!el._hasScrollTracker) {
            el.addEventListener('scroll', function () {
                sessionStorage.setItem('nobs_habit_table_scroll_x', el.scrollLeft);
            }, { passive: true });
            el._hasScrollTracker = true;
        }
    }
};


