# 🏀 Milano Public Courts

A modern web platform designed to connect people playing basketball in public courts across Milan.

Scan a QR code at a playground, check who’s there, and join the game.

---

## ✨ Overview

Milano Public Courts is a lightweight web application that helps players:

- Discover public basketball courts in Milan
- See who plans to be at a specific court
- Mark their presence for a given day
- Check real-time updates about court conditions
- Organize spontaneous games directly on location

The project focuses on **simplicity, locality, and real-world usage**, avoiding complex social features in favor of practical, on-the-ground coordination.

---

## 🚀 Key Features

### 📍 Court Navigation
- Search and browse basketball courts across Milan
- Dedicated page for each court
- Direct access via QR codes placed on location

---

### 👥 Presence System
- Mark your presence for a specific day
- View who is planning to be at a court
- Live counters updated across:
  - Home page
  - Court page

---

### 🏟️ Court Information
Each court includes:
- Address and location
- Visual gallery
- Community updates
- Court condition (Pro / Minus)

---

### 🗺️ Map Integration
- Embedded map showing the exact position of the court

---

### 🛠️ Admin Panel (Prototype)
- Login-based admin access
- Create and edit courts
- Manage:
  - Name
  - Address
  - Description
  - Images
  - Coordinates
  - Pro / Minus sections

> Note: Admin system currently uses local storage (prototype stage)

---

### 📸 Image Management
- Drag & drop image upload (admin)
- Gallery preview
- Remove images with a simple click

---

### 🎨 UI / UX
- Modern and minimal design
- Dark / Light mode
- Strong visual identity with basketball-inspired orange accents
- Responsive layout optimized for mobile devices

---

## 📱 Mobile First Approach

The application is designed with mobile usage in mind:

- Fast access via QR codes
- Simple interaction (1–2 taps)
- Clean and readable layout on small screens
- Optimized spacing and touch targets

---

## ⚙️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **State Management:** Local state + localStorage (MVP)
- **Deployment (planned):** Vercel / Netlify
- **Backend (planned):** Supabase / PostgreSQL

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/basket-milano.git
cd basket-milano
