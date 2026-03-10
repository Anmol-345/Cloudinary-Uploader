"use client";

import { useEffect, useState } from "react";

export default function History() {
  const [images, setImages] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("cloudinary_history");
    if (stored) {
      // Show newest first (already in reverse order if pushed at front)
      setImages(JSON.parse(stored));
    }
  }, []);

  const handleCopy = (url, idx) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const clearHistory = () => {
    localStorage.removeItem("cloudinary_history");
    setImages([]);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center justify-center"
            title="Back to Home"
            style={{ minWidth: 36 }}
          >
            &lt;
          </a>
          <h1 className="text-2xl font-semibold text-gray-900">Upload History</h1>
        </div>
        <button
          onClick={clearHistory}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Clear History
        </button>
      </div>
      {images.length === 0 ? (
        <p className="text-gray-500">No images in history.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              className="relative group bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={url}
                alt={`Uploaded ${images.length - 1 - idx}`}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => handleCopy(url, idx)}
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                title="Copy URL"
              >
                {copiedIndex === idx ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <rect x="3" y="3" width="13" height="13" rx="2" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
