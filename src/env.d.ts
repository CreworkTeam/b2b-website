/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_MIXPANEL_TOKEN: string;
  readonly BREVO_SMTP_USER: string;
  readonly BREVO_SMTP_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
