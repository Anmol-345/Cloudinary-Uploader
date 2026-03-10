"use client";


import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [cloudName, setCloudName] = useState("");
  const [preset, setPreset] = useState("");

  // Load cloudName and preset from localStorage on mount
  useEffect(() => {
    const storedCloud = localStorage.getItem("cloudinary_cloudName");
    const storedPreset = localStorage.getItem("cloudinary_preset");
    if (storedCloud) setCloudName(storedCloud);
    if (storedPreset) setPreset(storedPreset);
  }, []);

  // Save cloudName and preset to localStorage when they change (auto-save)
  useEffect(() => {
    if (cloudName) localStorage.setItem("cloudinary_cloudName", cloudName);
  }, [cloudName]);
  useEffect(() => {
    if (preset) localStorage.setItem("cloudinary_preset", preset);
  }, [preset]);

  // Manual save config
  const [configSaved, setConfigSaved] = useState(false);
  const saveConfig = () => {
    localStorage.setItem("cloudinary_cloudName", cloudName);
    localStorage.setItem("cloudinary_preset", preset);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 1500);
  };
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Accepts either an event (from input) or a File (from drag)
  const uploadImage = async (eOrFile) => {
    let file;
    if (eOrFile?.target?.files) {
      file = eOrFile.target.files[0];
    } else if (eOrFile instanceof File) {
      file = eOrFile;
    }
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
      const url = data.secure_url || "";
      setImageUrl(url);
      // Save to localStorage history
      if (url) {
        try {
          const prev = JSON.parse(localStorage.getItem("cloudinary_history")) || [];
          if (!prev.includes(url)) {
            localStorage.setItem("cloudinary_history", JSON.stringify([url, ...prev].slice(0, 16)));
          }
        } catch { }
      }
    } catch (err) {
      console.error(err);
      setImageUrl("");
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImage(e.dataTransfer.files[0]);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Cloudinary Image Upload
              </h1>
              <p className="text-sm text-gray-500">
                Upload images and instantly get a hosted URL
              </p>
            </div>
            <a
              href="/history"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition w-full md:w-auto text-center"
              style={{ minWidth: "120px" }}
            >
              History
            </a>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-4">

              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Cloud Name"
                  value={cloudName}
                  onChange={(e) => setCloudName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2
                             text-black placeholder:text-gray-400
                             focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={saveConfig}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  title="Save Cloud Name and Preset"
                >
                  Save
                </button>
                {configSaved && (
                  <span className="text-green-600 text-xs ml-2">Saved!</span>
                )}
              </div>

              <input
                type="text"
                placeholder="Upload Preset"
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2
                           text-black placeholder:text-gray-400
                           focus:ring-2 focus:ring-blue-500"
              />


              {/* Drag and Drop Upload Area */}
              <div
                ref={dropRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-md p-6 mb-2 flex flex-col items-center justify-center transition-colors duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-gray-500 text-sm mb-2">Drag & drop an image here, or click to select</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="hidden"
                  tabIndex={-1}
                />
              </div>

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

              <button
                onClick={clearAll}
                className="rounded-md border border-gray-300 px-4 py-2
                           text-sm text-gray-700 hover:bg-gray-100"
              >
                Clear All
              </button>
            </div>

            {/* RIGHT */}
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
      </div>

      {/* Footer Section */}
      <section className="w-full border-t bg-white py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            Built by{" "}
            <span className="font-medium text-gray-900">Anmol Sinha</span>
          </p>

          <div className="flex gap-4 text-sm">
            <a
              href="https://www.linkedin.com/in/anmolsinha21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Anmol-345"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              GitHub
            </a>
            <a
              href="https://anmol-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition"
            >
              Portfolio
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
