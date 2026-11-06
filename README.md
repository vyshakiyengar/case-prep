# Case Prep OS: the website

The interactive version of Case Prep OS: Google sign-in, a daily tracker, case log and dashboard, the 15-case casebook with a case player, timed drills, practice partners, and business-school student verification with perks and an admin list.

It's a React app (Vite + TypeScript + Tailwind) that uses **Firebase** for Google sign-in, the database and hosting. Firebase's free plan is enough to launch.

---

## Try it first (no setup)

```bash
npm install
npm run dev
```

Open http://localhost:5173. With no Firebase keys the app runs in **demo mode**: "Try the demo" signs you in as a demo user, data stays in your browser, and school verification is simulated. Everything else works.

You need [Node.js](https://nodejs.org) 20 or newer.

---

## Put it live with real Google sign-in (about 20 minutes)

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com and click **Create a project**. Google Analytics is optional.
2. In the project, click the **</>** (Web) icon to add a web app. Name it "Case Prep OS". You don't need Hosting yet.
3. Firebase shows a `firebaseConfig` block. Copy `.env.example` to a new file called `.env.local` and fill in:
   - `VITE_FIREBASE_API_KEY` = `apiKey`
   - `VITE_FIREBASE_AUTH_DOMAIN` = `authDomain`
   - `VITE_FIREBASE_PROJECT_ID` = `projectId`
   - `VITE_FIREBASE_APP_ID` = `appId`
   - `VITE_ADMIN_EMAILS` = the Google email **you** will sign in with

### 2. Turn on sign-in
**Build → Authentication → Get started → Sign-in method**:
1. Enable **Google**. Choose a support email and save.
2. Enable **Email/Password**, then switch on **Email link (passwordless sign-in)** inside it, and save. This is what sends the business-school verification emails. Students never get a password.
3. Under **Settings → Authorized domains**, add your website's domain once you have one (localhost is already there).
4. Optional: **Templates → Email address verification / Sign-in link**. Set the sender name to "Case Prep OS" so the email looks trustworthy.

### 3. Create the database
**Build → Firestore Database → Create database**. Choose **production mode** and a region close to your users (e.g. `europe-west2`, London). You can't change the region later.

### 4. Make yourself the admin
Open `firestore.rules` and replace `you@example.com` in `isAdmin()` with the same email you put in `VITE_ADMIN_EMAILS`.

### 5. Deploy
```bash
npm install -g firebase-tools
firebase login
firebase use --add          # pick your project; this updates .firebaserc
npm run deploy              # builds the site, then uploads it and the database rules
```
Firebase prints your live address (`https://your-project-id.web.app`). To use your own domain, go to **Hosting → Add custom domain** and follow the DNS steps. Then add that domain to **Authorized domains** (step 2.3).

Run `npm run deploy` again whenever you change anything.

---

## Business school verification and your student list

- Students go to **Student perks**, enter their school email, school, programme and graduation year, and optionally tick a box to receive marketing emails.
- Firebase emails them a one-click link. Opening it proves they own the inbox. The database rules only accept the student record if that exact school email has been verified on their account, so no one can type in a fake address.
- School names are filled in automatically for about 60 business schools (`src/lib/schools.ts`, matched by domain, including subdomains like `mba2027.hbs.edu`). Unknown domains are still accepted, but flagged "check" on your admin page. Personal addresses (Gmail, Outlook…) are rejected.
- **Your admin page:** sign in with your admin email and open `/admin` (also linked from Settings). It shows verified students, counts by school, who agreed to marketing, and has a **CSV export**. Only email people whose "Marketing consent" is "yes".
- **Perks:** add them on the admin page. Each perk can be a download link, a discount code, or any link. A simple way to give away a file: create a 100%-off discount code for it in Payhip and add it as a "Discount code" perk. Payhip then handles delivery.

**Before launch:** fill in the blanks in `src/pages/Privacy.tsx` (your name or company, contact email, data region, retention period) and have it checked. You're collecting personal data from UK/EU students, so UK GDPR applies.

---

## Partners

On **Partners**, a user creates an invite link and sends it (there's a WhatsApp button). When their partner signs in and accepts, each sees the other's weekly summary: tracker score, cases logged, average score, weakest stage and latest fix. Never the full case log.

---

## Checking the security rules

`tests/firestore.rules.test.mjs` checks the important rules: private prep data, student records only with a verified school email, admin-only student list, perks only for verified students, and partner sharing. To run it (needs Java):

```bash
npm run test:rules
```

---

## Where things are

| What | Where |
|---|---|
| Pages | `src/pages/` (Landing, Today, Tracker, CaseLog, Casebook, CasePlayer, Drills, Partners, Playbook, Perks, Admin…) |
| Firebase and demo data layer | `src/lib/backend.ts` |
| Dashboard maths | `src/lib/stats.ts` |
| Cases, drills, playbook content | `src/content/*.json` (generated from the casebook and tracker) |
| Business school domains | `src/lib/schools.ts` |
| Colours and fonts | `src/index.css` |
| Database security | `firestore.rules` |

## Costs

Firebase's free **Spark** plan covers hosting, Google sign-in and a generous database quota for an early-stage product. Sign-in emails (the school verification links) have a daily cap on the free plan. If you plan a big launch, check **Authentication → Usage**, or move to the pay-as-you-go **Blaze** plan, which stays free up to the same limits.
