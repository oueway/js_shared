export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Description of Service</h2>
          <p className="mb-4">
            We provide a demonstration platform for JS Shared components. This service is provided "as is" and is intended for educational and demonstration purposes.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. User Conduct</h2>
          <p className="mb-4">
            You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">4. Disclaimer</h2>
          <p className="mb-4">
            The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </div>
      </div>
    </div>
  );
}
