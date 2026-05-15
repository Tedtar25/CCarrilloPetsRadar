import { useAzureMonitor } from 'applicationinsights';
import { envs } from '../config/envs';

export function setupApplicationInsights(): void {
  const cs = envs.APPLICATIONINSIGHTS_CONNECTION_STRING;
  if (!cs?.trim()) {
    return;
  }
  useAzureMonitor({
    azureMonitorExporterOptions: {
      connectionString: cs,
    },
  });
}
