import * as hexColors from './hexColors';

describe('isHex', () => {
	it('returns true if a hex color', () => {
		expect(hexColors.isHex('#000')).toBeTruthy();
		expect(hexColors.isHex('#fff')).toBeTruthy();
		expect(hexColors.isHex('#0000')).toBeTruthy();
		expect(hexColors.isHex('#ffff')).toBeTruthy();
		expect(hexColors.isHex('#000000')).toBeTruthy();
		expect(hexColors.isHex('#ffffff')).toBeTruthy();
		expect(hexColors.isHex('#00000000')).toBeTruthy();
		expect(hexColors.isHex('#ffffffff')).toBeTruthy();
		expect(hexColors.isHex('0000')).toBeTruthy();
		expect(hexColors.isHex('ffff')).toBeTruthy();
		expect(hexColors.isHex('00000000')).toBeTruthy();
		expect(hexColors.isHex('ffffffff')).toBeTruthy();
	});

	it('returns false if not a hex color', () => {
		expect(hexColors.isHex('#00000')).toBeFalsy();
		expect(hexColors.isHex('#fffff')).toBeFalsy();
		expect(hexColors.isHex('#00000h')).toBeFalsy();
		expect(hexColors.isHex('#fffffz')).toBeFalsy();
		expect(hexColors.isHex('#0000000')).toBeFalsy();
		expect(hexColors.isHex('#fffffff')).toBeFalsy();
		expect(hexColors.isHex('00000')).toBeFalsy();
		expect(hexColors.isHex('fffff')).toBeFalsy();
		expect(hexColors.isHex('00000h')).toBeFalsy();
		expect(hexColors.isHex('fffffz')).toBeFalsy();
		expect(hexColors.isHex('0000000')).toBeFalsy();
		expect(hexColors.isHex('fffffff')).toBeFalsy();
		expect(hexColors.isHex('##000000')).toBeFalsy();
		expect(hexColors.isHex('##ffffff')).toBeFalsy();
		expect(hexColors.isHex('red')).toBeFalsy();
		expect(hexColors.isHex('transparent')).toBeFalsy();
	});
});

describe('normalizeHex', () => {
	it('returns normalized hex value if string is valid hex value', () => {
		expect(hexColors.normalizeHex('#000')).toEqual('#000');
		expect(hexColors.normalizeHex('#fff')).toEqual('#fff');
		expect(hexColors.normalizeHex('#0000')).toEqual('#0000');
		expect(hexColors.normalizeHex('#ffff')).toEqual('#ffff');
		expect(hexColors.normalizeHex('#000000')).toEqual('#000000');
		expect(hexColors.normalizeHex('#ffffff')).toEqual('#ffffff');
		expect(hexColors.normalizeHex('#00000000')).toEqual('#00000000');
		expect(hexColors.normalizeHex('#ffffffff')).toEqual('#ffffffff');
		expect(hexColors.normalizeHex('000')).toEqual('#000');
		expect(hexColors.normalizeHex('fff')).toEqual('#fff');
		expect(hexColors.normalizeHex('0000')).toEqual('#0000');
		expect(hexColors.normalizeHex('ffff')).toEqual('#ffff');
		expect(hexColors.normalizeHex('000000')).toEqual('#000000');
		expect(hexColors.normalizeHex('ffffff')).toEqual('#ffffff');
		expect(hexColors.normalizeHex('00000000')).toEqual('#00000000');
		expect(hexColors.normalizeHex('ffffffff')).toEqual('#ffffffff');
		expect(hexColors.normalizeHex('            000000')).toEqual('#000000');
		expect(hexColors.normalizeHex('  ffffff  ')).toEqual('#ffffff');
	});

	it('returns original string if string is not a valid hex value', () => {
		expect(hexColors.normalizeHex('#00000z')).toEqual('#00000z');
		expect(hexColors.normalizeHex('#fffffg')).toEqual('#fffffg');
		expect(hexColors.normalizeHex('00000')).toEqual('00000');
		expect(hexColors.normalizeHex('fffff')).toEqual('fffff');
		expect(hexColors.normalizeHex('00000z')).toEqual('00000z');
		expect(hexColors.normalizeHex('ffffffg')).toEqual('ffffffg');
		expect(hexColors.normalizeHex('0000000')).toEqual('0000000');
		expect(hexColors.normalizeHex('fffffff')).toEqual('fffffff');
		expect(hexColors.normalizeHex('##000000')).toEqual('##000000');
		expect(hexColors.normalizeHex('##ffffff')).toEqual('##ffffff');
		expect(hexColors.normalizeHex('red')).toEqual('red');
		expect(hexColors.normalizeHex('transparent')).toEqual('transparent');
	});
});

describe('hexToRgbARaw', () => {
	it('returns an object of RGBA values if string is valid hex value', () => {
		expect(hexColors.hexToRgbARaw('#000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
		expect(hexColors.hexToRgbARaw('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
		expect(hexColors.hexToRgbARaw('#aaa')).toEqual({ r: 170, g: 170, b: 170, a: 1 });
		expect(hexColors.hexToRgbARaw('#0000')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
		expect(hexColors.hexToRgbARaw('#ffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
		expect(hexColors.hexToRgbARaw('#aaaa')).toEqual({ r: 170, g: 170, b: 170, a: 0.667 });
		expect(hexColors.hexToRgbARaw('#000000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
		expect(hexColors.hexToRgbARaw('#ffffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
		expect(hexColors.hexToRgbARaw('#aaaaaa')).toEqual({ r: 170, g: 170, b: 170, a: 1 });
		expect(hexColors.hexToRgbARaw('#00000000')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
		expect(hexColors.hexToRgbARaw('#ffffffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
		expect(hexColors.hexToRgbARaw('#aaaaaaaa')).toEqual({ r: 170, g: 170, b: 170, a: 0.667 });
	});
});

describe('hexToRgb', () => {
	it('returns a string containing the CSS rgb() property value', () => {
		expect(hexColors.hexToRgb('#000')).toEqual('rgb(0, 0, 0)');
		expect(hexColors.hexToRgb('#fff')).toEqual('rgb(255, 255, 255)');
		expect(hexColors.hexToRgb('#aaa')).toEqual('rgb(170, 170, 170)');
		expect(hexColors.hexToRgb('#0000')).toEqual('rgb(0, 0, 0)');
		expect(hexColors.hexToRgb('#ffff')).toEqual('rgb(255, 255, 255)');
		expect(hexColors.hexToRgb('#aaaa')).toEqual('rgb(170, 170, 170)');
		expect(hexColors.hexToRgb('#000000')).toEqual('rgb(0, 0, 0)');
		expect(hexColors.hexToRgb('#ffffff')).toEqual('rgb(255, 255, 255)');
		expect(hexColors.hexToRgb('#aaaaaa')).toEqual('rgb(170, 170, 170)');
		expect(hexColors.hexToRgb('#00000000')).toEqual('rgb(0, 0, 0)');
		expect(hexColors.hexToRgb('#ffffffff')).toEqual('rgb(255, 255, 255)');
		expect(hexColors.hexToRgb('#aaaaaaaa')).toEqual('rgb(170, 170, 170)');
	});
});

describe('hexToRgbA', () => {
	it('returns a string containing the CSS rgba() property value, including passed alpha value', () => {
		expect(hexColors.hexToRgbA('#000', 1)).toEqual('rgba(0, 0, 0, 1)');
		expect(hexColors.hexToRgbA('#fff', 1)).toEqual('rgba(255, 255, 255, 1)');
		expect(hexColors.hexToRgbA('#aaa', 1)).toEqual('rgba(170, 170, 170, 1)');
		expect(hexColors.hexToRgbA('#0000', 0)).toEqual('rgba(0, 0, 0, 0)');
		expect(hexColors.hexToRgbA('#ffff', 1)).toEqual('rgba(255, 255, 255, 1)');
		expect(hexColors.hexToRgbA('#aaaa', 0.667)).toEqual('rgba(170, 170, 170, 0.667)');
		expect(hexColors.hexToRgbA('#000000', 1)).toEqual('rgba(0, 0, 0, 1)');
		expect(hexColors.hexToRgbA('#ffffff', 1)).toEqual('rgba(255, 255, 255, 1)');
		expect(hexColors.hexToRgbA('#aaaaaa', 1)).toEqual('rgba(170, 170, 170, 1)');
		expect(hexColors.hexToRgbA('#00000000', 0)).toEqual('rgba(0, 0, 0, 0)');
		expect(hexColors.hexToRgbA('#ffffffff', 1)).toEqual('rgba(255, 255, 255, 1)');
		expect(hexColors.hexToRgbA('#aaaaaaaa', 0.667)).toEqual('rgba(170, 170, 170, 0.667)');
	});
});
