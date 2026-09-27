const srcAttributeRegex = /src\s*=\s*"(?<URI>\/static.+)"/g;
const fontsUriFunctionRegex = /url\((?<URI>\/fonts[^)]+)\)/g;
const fontsUriStringRegex = /(?:"|'|`)(?<URI>\/fonts[^"'`]+)(?:"|'|`)/g;

/**
 * Makes the images and fonts of the website that code references with paths
 * absolute, so that the code works when it's copied or sent.
 */
export const convertUrisIntoUrls = (code: string) => {
  srcAttributeRegex.lastIndex = 0;
  fontsUriFunctionRegex.lastIndex = 0;
  fontsUriStringRegex.lastIndex = 0;
  return code
    .replaceAll(
      srcAttributeRegex,
      (_match, uri) => `src="https://vuemail.dev${uri}"`,
    )
    .replaceAll(
      fontsUriFunctionRegex,
      (_match, uri) => `url(https://vuemail.dev${uri})`,
    )
    .replaceAll(fontsUriStringRegex, (_match, uri: string) =>
      _match.replace(uri, `https://vuemail.dev${uri}`),
    );
};
