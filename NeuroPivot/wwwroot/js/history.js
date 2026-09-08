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
