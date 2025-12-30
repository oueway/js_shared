import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

export function ResetPasswordSuccess() {
  return (
    <div className="p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Updated!</h2>
      <p className="text-slate-600 mb-6 font-medium">
        Your password has been changed successfully.
      </p>
      
      <div className="flex flex-col items-center justify-center gap-3 mt-8">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Redirecting to login...</p>
      </div>
    </div>
  );
}
