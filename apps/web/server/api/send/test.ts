// The methods other than POST and OPTIONS, which Next.js answers with a 405
// on React Email's route handler
export default defineEventHandler((event) => sendNoContent(event, 405));
