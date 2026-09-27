import Conf from 'conf';

// Just simple encryption. This isn't completely safe
// because anyone can find this key here
const encryptionKey = 'r7#v2Qm}9$Lk(@x:3,FD8P)w45&[eZ61';

export const conf = new Conf<{
  resendApiKey?: string;
}>({ projectName: 'vuemail', encryptionKey });
