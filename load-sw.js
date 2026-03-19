const serviceWorker = '/sw.js';
// In the iOS and Android apps, a special user agent is set to identify whether this is running in the app or a regular browser.
const isWebView = /CSABuddy/.test(navigator.userAgent);

// don't use for android/ios app - they already have pages saved
if ('serviceWorker' in navigator && !isWebView) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(serviceWorker)
        .then(registration => {
            console.log('ServiceWorker registered. Scope: ', registration.scope);
        })
        .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
        });
    });
}