export function AppLogo() {
  return (
    <div className="flex items-center gap-3" aria-label="JS Shared Example logo">
      <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
        JS
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Example App</h1>
        <p className="text-slate-500 text-sm">Test the auth pages locally</p>
      </div>
    </div>
  );
}
