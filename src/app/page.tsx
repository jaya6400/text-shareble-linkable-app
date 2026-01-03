"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createPaste() {
    setError(null);
    setResult(null);

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    const body: any = { content };
    if (ttl) body.ttl_seconds = Number(ttl);
    if (maxViews) body.max_views = Number(maxViews);

    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create paste");
      }

      setResult(data);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="card">
        <h1>Text Sharable Link- Pastebin Lite</h1>

        <textarea
          rows={8}
          placeholder="Enter your paste content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label>
          TTL (seconds)
          <input
            type="number"
            min="1"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
        </label>

        <label>
          Max views
          <input
            type="number"
            min="1"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </label>

        <button onClick={createPaste} disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <div>Paste created:</div>
            <a href={result.url} target="_blank">
              {result.url}
            </a>
          </div>
        )}
      </div>

      <footer>
        Simple Text sharable Pastebin app • Built by jaya6400
      </footer>
    </main>
  );
}
