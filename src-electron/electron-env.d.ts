/* eslint-disable */
/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    QUASAR_ELECTRON_PRELOAD: string;
    APP_URL: string;
  }
}
