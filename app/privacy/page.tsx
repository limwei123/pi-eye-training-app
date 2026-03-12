export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-600">Effective date: March 2026</p>

        <p>
          Eye Training & Vision Exercise respects your privacy and is committed
          to protecting your information.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Information We Collect</h2>
          <p>
            This app may collect limited information required for authentication
            and payment processing through the Pi Network SDK, such as your Pi
            username, Pi user ID, and payment transaction details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">How We Use Information</h2>
          <p>We use this information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>authenticate users through Pi Network</li>
            <li>process Pi payments inside the app</li>
            <li>improve app functionality and user experience</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Data Storage</h2>
          <p>
            We do not intentionally collect unnecessary personal data. Only the
            information needed for app login, payment verification, and service
            operation may be processed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Third-Party Services</h2>
          <p>
            This app uses Pi Network SDK services for authentication and payment
            processing. Your use of those services may also be subject to Pi
            Network&apos;s own policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Children&apos;s Privacy</h2>
          <p>
            This app is not intended to knowingly collect personal information
            from children without appropriate supervision.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any updates
            will be posted on this page.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>Developer Public Name: EyeExercise Lab</p>
        </section>
      </div>
    </main>
  )
}