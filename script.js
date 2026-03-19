// When the document is fully loaded, remove the isWebView class from the body if not running in the app.
document.addEventListener('DOMContentLoaded', () => {
    if (!isWebView) {
        document.body.classList.remove('isWebView');
    }
});