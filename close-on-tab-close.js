/**
 * Dev-only Vite plugin: when the browser tab closes, shut this dev server
 * down. No paired backend here (this site is static), so it's self-close
 * only.
 *
 * Detection is client-signaled, not connection-tracked: an injected script
 * fires `navigator.sendBeacon` on the page's `pagehide` event (covers a real
 * tab close and a window close; does NOT cover the browser process being
 * killed outright, since no JS runs in that case). `pagehide` also fires on
 * a plain refresh/navigation, so a grace period (`graceMs`) is used instead
 * of shutting down immediately -- any other request arriving in that window
 * (the refreshed page re-fetching its assets) cancels the pending shutdown.
 */
export function closeOnTabClose({ graceMs = 2000 } = {}) {
  let timer = null;

  const scheduleShutdown = (server) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      await server.close();
      process.exit(0);
    }, graceMs);
  };

  const cancelShutdown = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    name: "close-on-tab-close",
    apply: "serve",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          injectTo: "body",
          children:
            'window.addEventListener("pagehide", () => { navigator.sendBeacon("/__dev_tab_closing"); });',
        },
      ];
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/__dev_tab_closing") {
          res.statusCode = 204;
          res.end();
          scheduleShutdown(server);
          return;
        }
        cancelShutdown();
        next();
      });
    },
  };
}
