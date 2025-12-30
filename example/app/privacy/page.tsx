export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us when you create an account, such as your name and email address.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, and to communicate with you.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Data Security</h2>
          <p className="mb-4">
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4. Cookies</h2>
          <p className="mb-4">
            We may use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
          </p>
        </div>
      </div>
    </div>
  );
}
