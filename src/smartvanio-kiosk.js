/**
 * VanCtl Kiosk
 *
 * Hides the HA sidebar for kiosk/tablet use with a ☰ toggle button.
 *
 * Confirmed working DOM targets (HA 2024+):
 *   ha-drawer.shadowRoot → aside (nav panel) + div (app content)
 *   hui-root.shadowRoot  → div.header / div.toolbar
 */

class VanCtlKiosk {
  constructor() {
    this.ha   = document.querySelector("home-assistant");
    this.main = this.ha.shadowRoot.querySelector("home-assistant-main").shadowRoot;
    this.isOpen = false;
    this.llAttempts = 0;

    this.run();

    new MutationObserver(this.watchDashboards.bind(this)).observe(
      this.main.querySelector("ha-drawer"),
      { childList: true }
    );
  }

  run(lovelace = this.main.querySelector("ha-panel-lovelace")) {
    if (!lovelace) return;
    this.llAttempts++;
    try {
      void lovelace.lovelace.config;
      this.insertStyles(lovelace);
    } catch (e) {
      if (this.llAttempts < 200) {
        setTimeout(() => this.run(lovelace), 50);
      } else {
        this.insertStyles(lovelace);
      }
    }
  }

  insertStyles(lovelace) {
    const huiRoot = lovelace.shadowRoot?.querySelector("hui-root")?.shadowRoot;
    const drawer  = this.main.querySelector("ha-drawer");

    // Slim header. padding-left on .toolbar shifts the title right so our
    // toggle button (fixed top-left, 44px wide) doesn't overlap it.
    if (huiRoot) {
      this.addStyle(huiRoot, "vk-header",
        `.header { --header-height: 48px !important; }
         .toolbar { min-height: 48px !important; padding-left: 48px !important; }
         ha-menu-button { display: none !important; }`
      );
    }

    // Hide sidebar and reclaim layout space.
    // Confirmed working in v10: inject into ha-drawer.shadowRoot.
    if (drawer?.shadowRoot) {
      this.addStyle(drawer.shadowRoot, "vk-drawer",
        `aside { display: none !important; }
         div   { margin-left: 0 !important; margin-inline-start: 0 !important; }`
      );
    }

    window.dispatchEvent(new Event("resize"));
    this.llAttempts = 0;
    this.buildToggle();
  }

  // ── Toggle ────────────────────────────────────────────────────

  buildToggle() {
    if (this.main.querySelector("#vk-toggle")) return;

    this.backdrop = document.createElement("div");
    this.backdrop.id = "vk-backdrop";
    Object.assign(this.backdrop.style, {
      display: "none", position: "fixed", inset: "0",
      zIndex: "9997", background: "rgba(0,0,0,0.4)",
    });
    this.backdrop.addEventListener("click", () => this.closeSidebar());

    this.btn = document.createElement("button");
    this.btn.id = "vk-toggle";
    this.btn.textContent = "☰";
    Object.assign(this.btn.style, {
      position: "fixed", top: "6px", left: "4px", zIndex: "9999",
      width: "40px", height: "40px", borderRadius: "8px",
      background: "rgba(10,21,32,0.88)", border: "1px solid #1e3a55",
      color: "#7ab0d8", fontSize: "18px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(4px)", padding: "0", lineHeight: "1",
    });
    this.btn.addEventListener("click", () =>
      this.isOpen ? this.closeSidebar() : this.openSidebar()
    );

    this.main.appendChild(this.backdrop);
    this.main.appendChild(this.btn);
  }

  openSidebar() {
    const lovelace = this.main.querySelector("ha-panel-lovelace");
    const huiRoot  = lovelace?.shadowRoot?.querySelector("hui-root")?.shadowRoot;
    const drawer   = this.main.querySelector("ha-drawer");

    if (huiRoot) this.removeStyle(huiRoot, "vk-header");
    if (drawer?.shadowRoot) this.removeStyle(drawer.shadowRoot, "vk-drawer");
    window.dispatchEvent(new Event("resize"));

    this.backdrop.style.display = "block";
    this.btn.textContent = "✕";
    this.isOpen = true;
  }

  closeSidebar() {
    const lovelace = this.main.querySelector("ha-panel-lovelace");
    const huiRoot  = lovelace?.shadowRoot?.querySelector("hui-root")?.shadowRoot;
    const drawer   = this.main.querySelector("ha-drawer");

    if (huiRoot) {
      this.addStyle(huiRoot, "vk-header",
        `.header { --header-height: 48px !important; }
         .toolbar { min-height: 48px !important; padding-left: 48px !important; }
         ha-menu-button { display: none !important; }`
      );
    }
    if (drawer?.shadowRoot) {
      this.addStyle(drawer.shadowRoot, "vk-drawer",
        `aside { display: none !important; }
         div   { margin-left: 0 !important; margin-inline-start: 0 !important; }`
      );
    }
    window.dispatchEvent(new Event("resize"));

    this.backdrop.style.display = "none";
    this.btn.textContent = "☰";
    this.isOpen = false;
  }

  watchDashboards(mutations) {
    mutations.forEach(({ addedNodes }) => {
      for (const node of addedNodes) {
        if (node.localName === "ha-panel-lovelace") {
          this.isOpen = false;
          this.llAttempts = 0;
          this.run(node);
        }
      }
    });
  }

  // ── Style helpers ─────────────────────────────────────────────

  addStyle(container, id, css) {
    if (!container || container.querySelector(`#${id}`)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    container.appendChild(style);
  }

  removeStyle(container, id) {
    container?.querySelector(`#${id}`)?.remove();
  }
}

Promise.resolve(customElements.whenDefined("hui-view")).then(() => {
  window.VanCtlKiosk = new VanCtlKiosk();
});
