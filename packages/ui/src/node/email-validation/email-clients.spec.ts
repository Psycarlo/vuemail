// @vitest-environment node
import {
  DEFAULT_RELEVANT_EMAIL_CLIENTS,
  getRelevantEmailClients,
} from './email-clients';

test('getRelevantEmailClients() defaults to the most used email clients', () => {
  expect(getRelevantEmailClients()).toEqual(DEFAULT_RELEVANT_EMAIL_CLIENTS);
  expect(getRelevantEmailClients([])).toEqual(DEFAULT_RELEVANT_EMAIL_CLIENTS);
});

test('getRelevantEmailClients() keeps the known email clients configured', () => {
  expect(getRelevantEmailClients([' Gmail', 'hey', 'unknown'])).toEqual([
    'gmail',
    'hey',
  ]);
  expect(getRelevantEmailClients(['unknown'])).toEqual(
    DEFAULT_RELEVANT_EMAIL_CLIENTS,
  );
});
