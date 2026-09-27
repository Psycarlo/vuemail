import logSymbols from 'log-symbols';
import { conf } from '../../utils/conf';

export async function resendReset() {
  conf.delete('resendApiKey');

  console.info(`${logSymbols.success} Resend API Key successfully deleted`);
}
