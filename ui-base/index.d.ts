import { type BackendService } from '@enibrn/malt-ffb';

declare module '#app' {
  interface NuxtApp {
    $backendService: BackendService;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $backendService: BackendService;
  }
}

export {}