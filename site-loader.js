(() => {
  const load = (source) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${source}?v=20260618-2`;
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });
  const readLocal = () => {
    try { return localStorage.getItem("portfolioContent"); } catch { return null; }
  };
  const writeLocal = (value) => {
    try { localStorage.setItem("portfolioContent", JSON.stringify(value)); } catch { /* Server data remains available. */ }
  };
  (async () => {
    try {
      const response = await fetch("/api/content", { cache: "no-store" });
      if (!response.ok) throw new Error("Content service unavailable");
      const serverContent = await response.json();
      if (serverContent) {
        window.portfolioServerContent = serverContent;
        writeLocal(serverContent);
      }
      else {
        const oldContent = readLocal();
        if (oldContent) {
          const saved = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: oldContent });
          if (saved.ok) {
            window.portfolioServerContent = JSON.parse(oldContent);
            writeLocal(window.portfolioServerContent);
          }
        }
      }
    } catch {
      // Live Server and other static hosts keep using the browser's local copy.
    }
    for (const file of ["language.js", "portfolio-content.js", "main.js", "message.js"]) {
      try { await load(file); } catch { console.error(`Could not load ${file}`); }
    }
  })();
})();
