(() => {
  const script = document.createElement("script");
  script.src = "cms.js?v=20260618-2";
  const loadCms = () => document.body.append(script);
  (async () => {
    try {
      const response = await fetch("/api/content", { cache: "no-store" });
      if (!response.ok) throw new Error("Content service unavailable");
      const serverContent = await response.json();
      let local = null;
      try { local = localStorage.getItem("portfolioContent"); } catch { /* Server storage works without browser storage. */ }
      if (serverContent) {
        window.portfolioServerContent = serverContent;
        try { localStorage.setItem("portfolioContent", JSON.stringify(serverContent)); } catch { /* Keep server copy. */ }
      }
      else if (local) {
        const saved = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: local });
        if (!saved.ok) throw new Error("Could not sync local content");
        window.portfolioServerContent = JSON.parse(local);
      }
      window.portfolioApiAvailable = true;
    } catch {
      window.portfolioApiAvailable = false;
    }
    loadCms();
  })();
})();
