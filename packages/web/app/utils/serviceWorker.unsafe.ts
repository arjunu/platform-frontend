export async function unregister(): Promise<boolean> {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    return registration.unregister();
  }

  return false;
}
