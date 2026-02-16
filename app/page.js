"use client";

import { useState } from "react";

export default function Home() {
  const [cloudName, setCloudName] = useState("");
  const [preset, setPreset] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !cloudName || !preset) return;

    setLoading(true);
    setCopied(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setImageUrl(data.secure_url || "");
    } catch (err) {
      console.error(err);
      setImageUrl("");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setImageUrl("");
    setCopied(false);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Cloudinary Image Upload
          </h1>
          <p className="text-sm text-gray-500">
            Upload images and instantly get a hosted URL
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT — Controls */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Cloud Name"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2
                         text-black placeholder:text-gray-400
                         focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Upload Preset"
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2
                         text-black placeholder:text-gray-400
                         focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              className="block w-full text-sm text-black
                file:mr-4 file:rounded-md file:border-0
                file:bg-blue-600 file:px-4 file:py-2
                file:text-white hover:file:bg-blue-700"
            />

            {loading && (
              <p className="text-sm text-blue-600">Uploading image…</p>
            )}

            {imageUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    readOnly
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2
                               text-black bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyUrl}
                    className="rounded-md bg-gray-900 px-4 py-2
                               text-sm text-white hover:bg-black"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={clearAll}
                className="rounded-md border border-gray-300 px-4 py-2
                           text-sm text-gray-700 hover:bg-gray-100"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* RIGHT — Preview */}
          <div className="border rounded-lg bg-gray-50 flex items-center justify-center p-4">
            {!imageUrl && (
              <p className="text-sm text-gray-400">
                Image preview will appear here
              </p>
            )}

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="max-h-[400px] w-full object-contain rounded-md"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
