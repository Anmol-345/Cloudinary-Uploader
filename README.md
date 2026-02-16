# Cloudinary Image Uploader

A clean, production-ready web tool to upload images to **Cloudinary** and instantly get a hosted image URL with live preview and copy support.

Built using **Next.js (App Router)**, **React**, and **Tailwind CSS**.

---

## ✨ Features

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

- Upload images directly to Cloudinary
- Live image preview after upload
- Instant hosted image URL generation
- One-click URL copy
- Clear all fields with a single button
- Responsive two-column layout (desktop & mobile friendly)
- No backend required (unsigned uploads)

---

## 🖼 UI Layout

### Desktop
- **Left panel**
  - Cloud Name input
  - Upload Preset input
  - Image upload field
  - Generated URL + Copy button
  - Clear All button

- **Right panel**
  - Uploaded image preview

### Mobile
- Inputs appear first
- Image preview stacks below

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cloudinary-uploader.git
cd cloudinary-uploader
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔧 Cloudinary Setup

### Step 1: Get Cloud Name
- Go to your Cloudinary dashboard
- Copy your **Cloud Name**

### Step 2: Create an Upload Preset
- Navigate to **Settings → Upload**
- Create a new preset
- Set it to **Unsigned**
- Save the preset name

---

## 📦 Tech Stack

- Next.js
- React
- Tailwind CSS
- Cloudinary Upload API

---

## 🔐 Security Note

This project uses **unsigned uploads**, which are suitable for:
- Internal tools
- Demos
- Prototypes
- Admin-only usage

For public production apps, use signed uploads and backend validation.

---

## 📄 License

MIT License
