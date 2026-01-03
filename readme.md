🏗️ Labour Chowk (लेबर चौक)

Labour Chowk is a simple, problem-first platform that digitizes the offline daily-wage labour marketplace seen at physical Labour Chowks across India.

It helps:

Labourers find work faster

Contractors & individuals hire labour easily

Both sides connect directly, without middlemen

This project is intentionally designed as a low-cost, cross-platform, free-first application focused on usability, accessibility, and real-world constraints.

🌱 Project Philosophy

Solve a real, observed problem

Design for low literacy & low-end devices

Hindi-first, English-supported

No forced monetization

No dark patterns

One codebase → Android + iOS + Web

This is a problem-solving project, not a gig-economy clone.

👥 User Types
👷 Labour (श्रमिक)

Daily wage workers (मिस्त्री, हेल्पर, पेंटर, etc.)

Looking for short or long-term work

Sets their own expected daily rate

Shares availability & location

🧑‍💼 Contractor / Individual (ठेकेदार / व्यक्ति)

Contractors hiring daily labour

Individuals hiring labour for small jobs

Posts job requirements and offered rate

🔁 Core Concept

Labour Chowk is a local two-sided marketplace:

Labour lists availability

Employers browse nearby labour

Direct phone calls (no chat initially)

No in-app payments (v1)

🧠 Key Design Decisions
Decision	Reason
PWA first	One codebase, cheapest
Phone OTP login	Email not required
Hindi + icons	Low literacy friendly
No payments v1	Trust & simplicity
Location based	Real-world relevance
🧱 Tech Stack
Frontend (Single Codebase)

React + Vite

PWA enabled

Tailwind CSS

TypeScript (recommended)

Mobile App Packaging

Capacitor (Ionic)

Wraps web app into Android & iOS

No Swift / iOS coding needed

Backend

Firebase

Phone OTP Authentication

Firestore (NoSQL database)

Hosting

Cloud Functions (optional)

Maps & Location

Google Maps API (or Mapbox later)

📱 Platform Support

✅ Android

✅ iOS

✅ Web (PWA)

❌ Desktop-first UI

🧭 User Flow
First Launch (All Users)

Select language (Hindi / English)

Login using phone number (OTP)

Select role:

👷 Labour

🧑‍💼 Contractor / Individual

👷 Labour Flow

Create profile:

Name

Skill selection (icons + Hindi)

Expected daily rate

Location (auto via GPS)

Availability (Today / Tomorrow)

Home Screen:

Availability toggle (ON / OFF)

Status: “आप आस-पास के काम के लिए उपलब्ध हैं”

Employer calls labour directly

🧑‍💼 Contractor / Individual Flow

Post job:

Required skill

Location

Rate offered

Duration (1 day / multiple days)

Browse nearby labour:

Sorted by distance & rate

Filter by skill

Call labour

Mark job as completed

🖥️ Core Screens (MVP)
Shared

Language selection

OTP login

Role selection

Labour

Profile setup

Availability toggle

Profile preview

Employer

Post job

Labour list

Labour profile view

Total: ~8–10 screens

🔨 Skills / Work Categories (Bilingual)

Skills are shown with:

Icon

Hindi name (primary)

English name (secondary)

Icon	Hindi Name	English Name	Key
🧱	मिस्त्री	Mason	mason
🎨	पेंटर	Painter	painter
⚡	इलेक्ट्रीशियन	Electrician	electrician
🚰	प्लम्बर	Plumber	plumber
🪚	बढ़ई	Carpenter	carpenter
🧱	हेल्पर	Helper	helper
🧹	सफाई कामगार	Cleaner	cleaner
🛠️	वेल्डर	Welder	welder
🚚	माल ढोने वाला	Loader / Porter	loader
🏗️	साइट वर्कर	Construction Worker	construction_worker
🗃️ Data Model (Firebase)
User
{
  "id": "string",
  "phone": "string",
  "role": "labour | employer",
  "name": "string",
  "language": "hi | en",
  "location": { "lat": 0, "lng": 0 }
}

LabourProfile
{
  "userId": "string",
  "skills": ["mason", "helper"],
  "dailyRate": 700,
  "available": true
}

Job
{
  "id": "string",
  "postedBy": "userId",
  "skill": "mason",
  "rate": 800,
  "location": {},
  "status": "open | closed"
}

🚫 Out of Scope (v1)

Payments / wallet

Chat / messaging

Ratings (stars)

Escrow

AI matching

Dispute resolution

Heavy analytics

🛠️ Development Roadmap
Phase 1 – Setup

React + Vite

Tailwind

Firebase Auth (OTP)

PWA config

Language support

Phase 2 – Core Features

Labour profile creation

Job posting

Labour browsing

Location filtering

Phase 3 – Mobile Packaging

Capacitor Android build

Capacitor iOS build (Mac required)

Phase 4 – Pilot

Onboard 10–20 labourers

Test with real contractors

Iterate based on usage

🚀 Deployment
Web

Firebase Hosting

PWA installable via browser

Android

Google Play (Internal Testing)

iOS

TestFlight → App Store (optional)

💰 Monetization (Optional, Later)

Labour Chowk is free-first.

Possible future options:

Small per-hire fee (₹10–₹20)

Contractor subscriptions

CSR / NGO partnerships

Municipal tie-ups

Donations

🧑‍💻 Developer Guidelines

Optimize for low-end Android phones

Use large touch targets

Prefer icons over text

Keep bundle size small

Assume unstable internet

📜 License

To be decided:

Open-source

Community-driven

Non-exploitative

❤️ Final Note

Labour Chowk exists to respect labour, reduce uncertainty, and make work accessible with dignity.

Even if it stays small or free forever —
it solves a real problem, and that matters.