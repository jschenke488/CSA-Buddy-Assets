// In the iOS and Android apps, a special user agent is set to identify whether this is running in the app or a regular browser.
const isWebView = /CSABuddy/.test(navigator.userAgent);

// When the document is fully loaded, remove the isWebView class from the body if not running in the app.
document.addEventListener('DOMContentLoaded', () => {
    if (!isWebView) {
        document.body.classList.remove('isWebView');
    }
});

const serviceWorker = '/sw.js'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(serviceWorker)
    });
}