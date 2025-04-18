import {
  type CloudConfig,
  type BackendService,
  type MyResult,
  buildBackendService
} from '@enibrn/malt-ffb';

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const { handleError } = useErrors();

  const cloudConfig: CloudConfig = {
    endpoint: config.public.endpoint as string,
    projectId: config.public.projectId as string,
  };

  const backendServiceResult: MyResult<BackendService> = await buildBackendService(cloudConfig);
  if (!backendServiceResult.success) {
    handleError(backendServiceResult.error);
    return;
  }
  console.log('Backend service initialized successfully', backendServiceResult.data);

  nuxtApp.provide('backendService', backendServiceResult.data);
});