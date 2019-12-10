// Source: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template-typescript/src/serviceWorker.ts

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config): void {
  if (
    process.env.NODE_ENV === "production" &&
    "serviceWorker" in navigator &&
    !("Cypress" in window)
  ) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(
      (process as { env: { [key: string]: string } }).env.PUBLIC_URL,
      window.location.href,
    );
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener("load", async () => {
      const swUrl = `/sw.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        await checkValidServiceWorker(swUrl, config);
      } else {
        // Is not localhost. Just register service worker
        await registerValidSW(swUrl, config);
      }
    });
  }
}

async function registerValidSW(swUrl: string, config?: Config): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.register(swUrl);

  registration.onupdatefound = () => {
    const installingWorker = registration.installing;
    if (installingWorker === null) {
      return;
    }
    installingWorker.onstatechange = () => {
      if (installingWorker.state === "installed") {
        if (navigator.serviceWorker.controller) {
          // At this point, the updated precached content has been fetched,
          // but the previous service worker will still serve the older
          // content until all client tabs are closed.

          // Execute callback
          if (config && config.onUpdate) {
            config.onUpdate(registration);
          }
        } else {
          // At this point, everything has been precached.

          // Execute callback
          if (config && config.onSuccess) {
            config.onSuccess(registration);
          }
        }
      }
    };
  };

  return registration;
}

async function checkValidServiceWorker(
  swUrl: string,
  config?: Config,
): Promise<ServiceWorkerRegistration | boolean> {
  // Check if the service worker can be found. If it can't reload the page.
  const response = await fetch(swUrl);
  // Ensure service worker exists, and that we really are getting a JS file.
  const contentType = response.headers.get("content-type");
  if (
    response.status === 404 ||
    (contentType !== null && contentType.indexOf("javascript") === -1)
  ) {
    // No service worker found. Probably a different app. Reload the page.
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    window.location.reload();
    return false;
  } else {
    // Service worker found. Proceed as normal.
    return registerValidSW(swUrl, config);
  }
}

export async function unregister(): Promise<boolean> {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    return registration.unregister();
  }

  return false;
}
