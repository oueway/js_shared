'use client';

import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuthUIConfig } from '../../lib/auth-ui-config';

interface AuthCaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

export function AuthCaptcha({ onVerify, onError }: AuthCaptchaProps) {
  const config = useAuthUIConfig();
  const captchaConfig = config.security?.captcha;

  if (!captchaConfig || !captchaConfig.siteKey) {
    return null;
  }

  return (
    <div className="flex justify-center my-4 min-h-[65px]">
      <Turnstile
        siteKey={captchaConfig.siteKey}
        onSuccess={onVerify}
        onError={onError}
        options={{
          theme: 'auto',
        }}
      />
    </div>
  );
}
