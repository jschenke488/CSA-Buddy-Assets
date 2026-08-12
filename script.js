// In the iOS and Android apps, a special user agent is set to identify whether this is running in the app or a regular browser.
const isWebView = /CSABuddy/.test(navigator.userAgent);

const ACCESSIBLE_MODE_COOKIE = 'accessibleMode';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^| )' + name + '=([^;]+)'));
    return match ? match[1] : null;
}

function setCookie(name, value) {
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function accessibilityRedirect() {
    const referenceTabLink = document.getElementById('reference-link');
    if (getCookie(ACCESSIBLE_MODE_COOKIE) === 'true') {
        if (referenceTabLink) referenceTabLink.setAttribute('href', '/reference-accessible.html')
        let path = window.location.pathname.toLowerCase().trim()
        if (path.startsWith('/reference') && !path.includes('accessible')) window.location.href = '/reference-accessible.html'
    } else {
        if (referenceTabLink) referenceTabLink.setAttribute('href', '/reference.html')
        let path = window.location.pathname.toLowerCase().trim()
        if (path.startsWith('/reference') && path.includes('accessible')) window.location.href = '/reference.html'
    }
}

// When the document is fully loaded, remove the isWebView class from the body if not running in the app.
document.addEventListener('DOMContentLoaded', () => {
    if (!isWebView) {
        document.body.classList.remove('isWebView');

        // Add extra padding if running in a regular web browser for the navbar.
        const webNavbar = document.getElementById('web-navbar');
        const updateNavbarSpacing = () => {
            document.body.style.paddingBottom = `${webNavbar.offsetHeight + 10}px`;
        };
        updateNavbarSpacing();
        window.addEventListener('resize', updateNavbarSpacing);

        // Accessible mode preference, only available outside the app webview.
        if (getCookie(ACCESSIBLE_MODE_COOKIE) === null) {
            setCookie(ACCESSIBLE_MODE_COOKIE, 'false');
        }

        const accessibleModeToggle = document.getElementById('accessible-mode-toggle');
        if (accessibleModeToggle) {
            accessibleModeToggle.checked = getCookie(ACCESSIBLE_MODE_COOKIE) === 'true';
            accessibleModeToggle.addEventListener('change', () => {
                setCookie(ACCESSIBLE_MODE_COOKIE, accessibleModeToggle.checked);
                accessibilityRedirect();
            });
        }

        accessibilityRedirect();
    }
});