import { ProtocolWithReturn } from 'webext-bridge';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    openWindow: { targetUrl: string };
    refresh: ProtocolWithReturn<string, { status: string; error?: string }>;
    generateMagnet: ProtocolWithReturn<{ hash: string }, string>;
  }
}
