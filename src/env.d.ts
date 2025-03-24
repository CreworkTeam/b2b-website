/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_MIXPANEL_TOKEN: string;
  readonly GMAIL_SMTP_USER: string;
  readonly GMAIL_SMTP_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
