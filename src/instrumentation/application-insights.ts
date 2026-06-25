import * as appInsights from 'applicationinsights';
import { envs } from '../config/envs';

export function setupApplicationInsights(): void {
  const cs = envs.APPLICATIONINSIGHTS_CONNECTION_STRING;
  if (!cs?.trim()) {
    return;
  }
  appInsights.setup(cs).start();
}
