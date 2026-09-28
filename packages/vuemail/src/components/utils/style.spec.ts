import { styleToString, toStyleObject } from './style';

// The expected strings are the ones React 19 serializes the same styles into.
describe('styleToString()', () => {
  it('gives numbers a px unit, except for the properties React leaves unitless', () => {
    expect(
      styleToString({
        width: 10,
        marginTop: 1.25,
        top: -5,
        fontSize: 0,
        lineHeight: 1.5,
        fontWeight: 600,
        opacity: 0.5,
        zIndex: 2,
        flex: 1,
        aspectRatio: 1.5,
      }),
    ).toBe(
      'width:10px;margin-top:1.25px;top:-5px;font-size:0;line-height:1.5;font-weight:600;opacity:0.5;z-index:2;flex:1;aspect-ratio:1.5',
    );
  });

  it('follows React on vendor-prefixed properties, which only has some of them as unitless', () => {
    expect(
      styleToString({
        WebkitLineClamp: 2,
        MozBoxFlex: 1,
        msZoom: 1,
        WebkitOpacity: 0.5,
        MozOpacity: 0.5,
      }),
    ).toBe(
      '-webkit-line-clamp:2;-moz-box-flex:1;-ms-zoom:1;-webkit-opacity:0.5px;-moz-opacity:0.5px',
    );
  });

  it('keeps custom properties, and leaves out values that are empty', () => {
    expect(
      styleToString({
        '--gap': 4,
        color: 'var(--accent)',
        msTransform: 'none',
        background: undefined,
        border: '',
      }),
    ).toBe('--gap:4;color:var(--accent);-ms-transform:none');
    expect(styleToString({ color: undefined })).toBeUndefined();
  });
});

describe('toStyleObject()', () => {
  it('normalizes the style values Vue accepts', () => {
    expect(
      toStyleObject([
        'background-image: url(data:image/png;base64,AAA=); color: red;',
        { fontSize: 16, 'line-height': '24px', margin: undefined },
      ]),
    ).toEqual({
      backgroundImage: 'url(data:image/png;base64,AAA=)',
      color: 'red',
      fontSize: 16,
      lineHeight: '24px',
      margin: undefined,
    });
  });
});
