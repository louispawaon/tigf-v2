import { createFileRoute } from '@tanstack/react-router'
import type { ReactElement } from 'react'
import { PrivacyPolicyNavbar } from '../components/PrivacyPolicyNavbar'
import { buildPrivacyHead } from '../seo/buildHead'
import { resolvePublicSiteOrigin } from '../seo/resolvePublicSiteOrigin'

export const Route = createFileRoute('/privacy-policy')({
  head: async () => {
    const siteOrigin = await resolvePublicSiteOrigin()
    return buildPrivacyHead(siteOrigin)
  },
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage(): ReactElement {
  return (
    <>
      <main className="min-h-screen px-5 pb-20 pt-[100px] sm:px-10 md:px-16 md:pb-24 lg:px-[295px]">
        <article className="privacy-policy-page">
          <header className="privacy-policy-header">
            <h1>Privacy Policy</h1>
            <p className="privacy-policy-updated">Effective date: April 16, 2026</p>
          </header>

          <section className="privacy-policy-section">
            <h2>1. Overview</h2>
            <p>
              <span className="font-heading italic">Today, I&apos;m grateful for (&quot;TIGF&quot;)</span> is
              a personal journaling application built on a local-first, offline-first architecture.
              Your entries are written on your device and stored on your device. They are never
              transmitted to any server, and we have no ability to access, read, or recover them.
            </p>
            <p>
              This policy describes what data the App uses, how it is stored, and what controls you
              have over it.
            </p>
          </section>

        <section className="privacy-policy-section">
          <h2>2. Data We Do Not Collect</h2>
          <p>The App does not collect any of the following:</p>
          <ul>
            <li>Personal identifiers (name, email address, phone number)</li>
            <li>Account credentials - the App has no account system</li>
            <li>Journal entries or any content you write</li>
            <li>Usage analytics or behavioral data</li>
            <li>Device identifiers or IP addresses</li>
            <li>Cookies or tracking pixels</li>
          </ul>
          <br/>
          <p>No data from this App is transmitted to us or any third party.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>3. How Your Data Is Stored</h2>
          <p>
            All content you create in the App is stored exclusively in your browser&apos;s IndexedDB
            - a structured local database built into modern browsers. This is distinct from cookies
            or localStorage.
          </p>
          <p>What this means in practice:</p>
          <ul>
            <li>Your entries exist only on the device and browser you used to write them</li>
            <li>We cannot access, read, or recover your entries under any circumstances</li>
            <li>Your data is not automatically backed up or synced to another device</li>
            <li>
              Clearing your browser data, uninstalling the App, or switching devices will
              permanently delete your entries with no means of recovery
            </li>
          </ul>
        </section>

        <section className="privacy-policy-section">
          <h2>4. App Assets and Offline Functionality</h2>
          <p>
            To support offline use, the App caches its own assets - JavaScript, CSS, fonts, and
            HTML - on your device using a browser service worker. This allows the App to load and
            function without an internet connection after the first visit.
          </p>
          <p>
            These cached files are application code only. They contain no personal data and are not
            used to track or identify you. The cache is managed by your browser and can be cleared
            at any time through your browser settings.
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>5. Third-Party Services</h2>
          <p>
            The App loads fonts from Google Fonts at first launch. These font files are then cached
            locally by the service worker for subsequent offline use. Beyond this initial request,
            the App makes no external network calls during normal use.
          </p>
          <p>
            Google&apos;s font delivery may log standard request metadata (such as IP address)
            subject to Google&apos;s own privacy policy. The App itself does not receive or store
            any of this information.
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>6. Data Sharing</h2>
          <p>
            We do not sell, share, or transmit your data - because we never receive it. Your
            journal content never leaves your device.
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>7. Your Control Over Your Data</h2>
          <p>You have complete control over your data:</p>
          <ul>
            <li>You may delete individual entries within the App at any time</li>
            <li>
              You may remove all App data by clearing your browser&apos;s site data in your browser
              settings
            </li>
            <li>If export functionality is available, you may export your entries to a local file</li>
          </ul>
          <br/>
          <p>Because data is stored locally, deletion is permanent and cannot be undone or recovered.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>8. Security</h2>
          <p>
            Because your data is stored locally and never transmitted, it is not exposed to risks
            associated with server-side storage such as data breaches or unauthorized access from
            our end. The security of your data depends on the security of your own device, browser,
            and operating system.
          </p>
          <p>
            We recommend keeping your device and browser up to date and using device-level
            encryption where available.
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            The App has no account creation, no data transmission, and no ability to identify any
            user - including minors. Because no personal data is collected or processed, there is
            no meaningful distinction in how the App handles data from users of any age.
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>10. Future Features</h2>
          <p>
            A future version of the App may introduce optional features such as encrypted cloud
            backup or cross-device synchronization. These features will be strictly opt-in, designed
            with privacy as the default, and this policy will be updated with full details before
            any such feature is available.
          </p>
          <p>No data will be transmitted to any server without your explicit action to enable a sync feature.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>11. Changes to This Policy</h2>
          <p>
            If this policy changes in a material way, the updated version will be posted with a
            revised date at the top. Continued use of the App after changes are posted constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>12. Contact</h2>
          <p>Questions about this Privacy Policy may be directed to:</p>
          <p className="privacy-policy-contact-name">Louis Miguel Pawaon</p>
          <p>miggypawaon@gmail.com </p>
        </section>
        </article>
      </main>
      <PrivacyPolicyNavbar />
    </>
  )
}
