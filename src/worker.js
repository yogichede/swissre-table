// worker.js
self.onmessage = async (e) => {
  const { fileUrl } = e.data;
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(fileUrl, { signal });
    const reader = response.body.getReader();
    const contentLength = +response.headers.get("Content-Length");

    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedLength += value.length;
      const percent = Math.round((receivedLength / contentLength) * 100);
      self.postMessage({ type: "progress", percent });
    }

    self.postMessage({ type: "complete" });
  } catch (err) {
    if (err.name === "AbortError") {
      self.postMessage({ type: "cancelled" });
    } else {
      self.postMessage({ type: "error", message: err.message });
    }
  }

  self.onmessage = (msg) => {
    if (msg.data.type === "cancel") {
      controller.abort();
    }
  };
};