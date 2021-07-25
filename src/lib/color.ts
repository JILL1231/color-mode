const maxIn = 255;

const colorMap:{[key:string]:any} = {
  "red":"#f00",
  "orange":"#ffa500",
  "yellow":"#ff0",
  "green":"#0f0",
  "cyan":"#0ff",
  "blue":"#00f",
  "violet":"#ee82ee",
  "black":"#000",
  "white":"#fff" 
};

const getDefaultHex = (color:string):string => {
  const key:string = color.toLowerCase();
  return colorMap[key];
};

// 是否为有效颜色
const isHex = (color:string):string => {
  const result = /(^#[0-9A-Fa-f]{6}$)|(^#[0-9A-Fa-f]{3}$)/i.test(color);
  return result?'hex':'';
};
const isColor = (color:string):string => {
  const result = /^(rgb|rgba|hsb|hsv|hsl|yuv|kelvin)\(/.test(color);
  // 若为rgba，修复为rgb
  const type = result && color.split('(')[0]||''
  return type==='rgba'? 'rgb':type;
};

const isDefault = (color:string):string => {
  const result = getDefaultHex(color)
  return result?'hex':'';
};

const isColorType = (color:string):string => {
  color = color.replace(/\'|\"/g, '')
  return isHex(color) || isColor(color) || isDefault(color);
};

// 处理字符串长度，少则补0，多则裁剪
const parse = (d: string, len: number = 2) => {
  d += '';
  if (d.length < len) {
    d = '0'.repeat(len - d.length) + d;
  } else {
    d = d.slice(0, len);
  }
  return d;
};

/* eslint-disable */
const _gcd=(a:any, b:any):any =>{
  return !b ? a : _gcd(b, a % b);
};

const getSolutionOfLinearConguenceEquation=(a:number, b:number, n:number) => {
  let d,
    k,
    r,
    ref,
    s,
    x,
    x0;
  if (a * b === 0) {
    return false;
  }
  d = _gcd(a, n);
  return [b];

};

const _hueToRgb=(p:number, q:number, t:number) =>{
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

// 获取最小值
const limit = (number: number, min: number, max: number) => Math.min(max, Math.max(min, number));

class Color {
  // 将rgb、rgba、十六进色值转译为数组形式的rgb
  decode(color: string) {
    let rgb;
    // 色温
    if (/^kelvin\(/.test(color)) {
      return [color.split('(')[1].split(')')[0]];
    }
    // rgba格式
    if (/^(rgba?|hsb|hsv|hsl|yuv)\(/.test(color)) {
      const matcher: string[] =
        color.match(
          /(rgba?|hsb|hsv|hsl|yuv)\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\.\d]+))?\)/
        ) || [];
      rgb = [matcher[1], matcher[2], matcher[3]].map(item => parseInt(item));
      if (matcher[4] !== undefined) {
        let alpha: number = +matcher[4] > 1 ? 1 : +matcher[4] < 0 ? 0 : +matcher[4];
        rgb.push(alpha);
      }
      return rgb;
    }
    // 若为默认字符串，则获取其枚举
    let isDefaultHex = getDefaultHex(color)
    if(isDefaultHex){
      color = isDefaultHex;
    }
    // 十六进制格式
    color = color.replace(/^#/, '');
    const len = color.length;
    if (len !== 6 && len !== 3) {
      color = '000000';
    }
    if (len === 3) {
      rgb = color.split('').map(item => `${item}${item}`);
    } else {
      rgb = color.match(/[0-9a-f]{2}/gi) || [];
    }

    return rgb.map((i: string) => {
      let i2num: number = parseInt(i, 16);
      if (i2num < 0) { i2num = 0; }
      if (i2num > maxIn) { i2num = maxIn; }
      return i2num;
    });
  }
  /**
   * HEX to RGB\HSB\HSV\HSL\YUV\KELVIN
   */
  // 转为三原色：(r:红[0-255],g:绿[0-255],b:蓝[0-255])
  hex2rgb([r, g, b]:number[]) {
    return [r, g, b]
  }
  // 转为色温
  hex2kelvin([r, g, b]:number[]) {
    const epsilon = 0.4;
    let temperature;
    let minTemperature = 1000;
    let maxTemperature = 40000;
    while (maxTemperature - minTemperature > epsilon) {
      temperature = (maxTemperature + minTemperature) / 2;
      const [_r, , _b] = this.kelvin2rgb(temperature);
      if (_b / _r >= b / r) {
        maxTemperature = temperature;
      } else {
        minTemperature = temperature;
      }
    }
    return temperature ? Math.round(temperature) : null;
  }
  // to hsv (h:色相[0°-360°],s:饱和度[0%-100%],v:明度[0%-100%])
  hex2hsv([r, g, b]:number[]) {

    r /= maxIn;
    g /= maxIn;
    b /= maxIn;

    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const C = M - m;
    let h;
    let s;
    let v;

    if (C == 0) { h = 0; }
    else if (M === r) { h = ((g - b) / C) % 6; }
    else if (M === g) { h = (b - r) / C + 2; }
    else { h = (r - g) / C + 4; }
    h *= 60;
    if (h < 0) { h += 360; }
    v = M;
    if (C === 0) { s = 0; }
    else { s = C / v; }
    s *= 100;
    v *= 100;
    return [Math.round(h),Math.round(s),Math.round(v)];
  }
  // to hsb (h:色相[0°-360°],s:饱和度[0%-100%],b:亮度[0%-100%])
  hex2hsb([r, g, b]:number[]) {
    return this.hex2hsv([r, g, b]);
  }
  // to hsl (h:色相[0°-360°],s:饱和度[0%-100%],l:明度[0%-100%])
  hex2hsl([r, g, b]:number[]) {
    r /= maxIn;
    g /= maxIn;
    b /= maxIn;
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const d = M - m;
    let h;
    let l;
    let s;
    if (d == 0) { h = 0; }
    else if (M === r) { h = ((g - b) / d) % 6; }
    else if (M === g) { h = (b - r) / d + 2; }
    else { h = (r - g) / d + 4; }
    h *= 60;
    if (h < 0) { h += 360; }
    l = (M + m) / 2;
    if (d == 0) { s = 0; }
    else { s = d / (1 - Math.abs(2 * l - 1)); }
    s *= 100;
    l *= 100;
    return [h, s, l];
  }
  // yuv表色系 (y:明亮度[0%-100%],u:蓝色通道[0-255],v:红色通道[0-255])
  hex2yuv([r, g, b]:number[]) {
    return this.rgb2yuv([r, g, b]);
  }
  /**
   * RGB to HEX\HSB\HSV\HSL\YUV\KELVIN
   */
  rgb2hex([r, g, b]:number[]) {
    let hex: number = Math.round(r * 65536) + Math.round(g * 256) + Math.round(b);
    let hex2str = hex.toString(16);
    const len = hex2str.length;
    if (len < 6) { for (let i = 0; i < 6 - len; i++) { hex2str = `0${hex}`; } }
    hex2str = hex2str.toUpperCase();
    return `#${hex2str}`;
  }
  rgb2hsv([r, g, b]:number[]) {
    r = parseFloat('' + r);
    g = parseFloat('' + g);
    b = parseFloat('' + b);
    if (r < 0) { r = 0; }
    if (g < 0) { g = 0; }
    if (b < 0) { b = 0; }
    if (r > 255) { r = 255; }
    if (g > 255) { g = 255; }
    if (b > 255) { b = 255; }
    r /= 255;
    g /= 255;
    b /= 255;
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const C = M - m;
    let h, s, v;
    if (C === 0) { h = 0; }
    else if (M === r) { h = ((g - b) / C) % 6; }
    else if (M === g) { h = (b - r) / C + 2; }
    else { h = (r - g) / C + 4; }
    h *= 60;
    if (h < 0) { h += 360; }
    v = M;
    if (C === 0) { s = 0; }
    else { s = C / v; }
    s *= 100;
    v *= 100;
    return [h, s, v];
  }
  /**
 * RGB的颜色值转换hsv
 * @example
 * rgbToHsv(255,0,0) = {h: 0, s: 1, v: 1}
 * rgbToHsv(128,1,0) = {h: 0, s: 1, v: 0.5019607843137255}
 * @param {Number} r - 红色值, 0~255
 * @param {Number} g - 绿色值, 0~255
 * @param {Number} b - 蓝色值, 0~255
 * @returns {object}
 * h - hue表示色相
 * s - Saturation饱和度
 * v - Value表示明度
 */
  rgbToHsv([r, g, b]:number[]) {
    let h,
      s,
      v;

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    v = max / 255.0;
    if (max === 0) {
      return { h: -1, s: 0, v };
    }
    s = delta / max;
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h *= 60;
    if (h < 0) h += 360;

    return { h: Math.round(h), s, v };
  };
  rgb2hsb([r, g, b]:number[]) {
    return this.rgb2hsv([r, g, b]);
  }
  rgb2hsl([r, g, b]:number[]) {
    r = parseFloat('' + r);
    g = parseFloat('' + g);
    b = parseFloat('' + b);
    if (r < 0) { r = 0; }
    if (g < 0) { g = 0; }
    if (b < 0) { b = 0; }
    if (r > 255) { r = 255; }
    if (g > 255) { g = 255; }
    if (b > 255) { b = 255; }
    r /= 255;
    g /= 255;
    b /= 255;
    const M = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const d = M - m;
    let h, s, l;
    if (d === 0) { h = 0; }
    else if (M === r) { h = ((g - b) / d) % 6; }
    else if (M === g) { h = (b - r) / d + 2; }
    else { h = (r - g) / d + 4; }
    h *= 60;
    if (h < 0) { h += 360; }
    l = (M + m) / 2;
    if (d === 0) { s = 0; }
    else { s = d / (1 - Math.abs(2 * l - 1)); }
    s *= 100;
    l *= 100;
    h = h.toFixed(0);
    s = s.toFixed(0);
    l = l.toFixed(0);
    return [h, s, l];
  }
  /**
 * RGB转换hsl, 也是来自维基百科的公式实现
 * @example
 * rgbToHsl(255, 0, 0) = {h: 0, s: 1, l: 0.5}
 * rgbToHsl(128, 255, 128) = {h: 120, s: 1, l: 0.7509803921568627}
 * rgbToHsl(0,0,128) = {h: 240, s: 1, l: 0.25098039215686274}
 * @param {Number} rr - 红色值, 0~255
 * @param {Number} gg - 绿色值, 0~255
 * @param {Number} bb - 蓝色值, 0~255
 * @returns {object}
 * h - hue表示色相
 * s - Saturation饱和度
 * v - Lightness表示亮度
 */
  rgbToHsl([rr, gg, bb]:number[]) { // 255, 255, 255
    let r,
      g,
      b,
      h,
      s,
      l,
      min,
      max;

    r = parseFloat(''+rr) / 255;
    g = parseFloat(''+gg) / 255;
    b = parseFloat(''+bb) / 255;

    min = Math.min(r, g, b);
    max = Math.max(r, g, b);

    l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = Number.NaN;
    } else if (l < 0.5) s = (max - min) / (max + min);
    else s = (max - min) / (2 - max - min);

    switch (max) {
      case r: h = (g - b) / (max - min); break;
      case g: h = 2 + (b - r) / (max - min); break;
      case b: h = 4 + (r - g) / (max - min); break;
    }

    h *= 60;
    h += h < 0 ? 360 : 0;

    return { h, s, l };
  };
  /**
   * convert an rgb in JSON format into to a Kelvin color temperature
   */
  rgb2kelvin([r, g, b]: number[]) {
    const epsilon = 0.4;
    let temperature;
    let minTemperature = 1000;
    let maxTemperature = 40000;
    while (maxTemperature - minTemperature > epsilon) {
      temperature = (maxTemperature + minTemperature) / 2;
      const [_r, , _b] = this.kelvin2rgb(temperature);
      if (_b / _r >= b / r) {
        maxTemperature = temperature;
      } else {
        minTemperature = temperature;
      }
    }
    return temperature ? Math.round(temperature) : null;
  }
  rgb2yuv([r, g, b]:number[]) {
    const y = r * 0.299 + g * 0.587 + b * 0.114;
    const u = r * -0.168736 + g * -0.331264 + b * 0.5 + 128;
    const v = r * 0.5 + g * -0.418688 + b * -0.081312 + 128;
    return [y, u, v];
  }

  /**
   * HSB to HEX\RGB\HSV\HSL\YUV\KELVIN
   */
  hsb2hex([h, s, b]:number[]) {
    return this.hsv2hex([h, s, b]);
  }

  hsb2rgb([h, s, b]:number[]) {
    return this.hsv2rgb([h, s, b]);
  }

  hsb2hsv([h, s, b]:number[]) {
    return [h,s,b];
  }
  hsb2hsl([h, s, b]:number[]) {
    const rgb = this.hsv2rgb([h, s, b]);
    return this.rgb2hsl(rgb);
  }
  hsb2yuv([h, s, b]:number[]) {
    const rgb = this.hsv2rgb([h, s, b]);
    return this.rgb2yuv(rgb);
  }
  hsb2kelvin([h, s, b]:number[]) {
    const rgb = this.hsv2rgb([h, s, b]);
    return this.rgb2kelvin(rgb);
  }
  /**
   * HSV to HEX\RGB\HSB\HSL\YUV\KELVIN
   */
  hsv2hex([h, s, v]:number[]) {
    const rgb = this.hsv2rgb([h, s, v]);
    return this.rgb2hex(rgb);
  }
  hsv2rgb([h, s, v]:number[]) {
    const hsb = [h, s, v].map((bit, i) => {
      let _bit = bit;
      if (_bit) { _bit = parseFloat('' + _bit); }
      if (i === 0) {
        return (_bit %= 360) < 0 ? _bit + 360 : _bit;
      }
      return limit(Math.round(bit), 0, 100);
    });

    const br = Math.round(hsb[2] / 100 * 255);
    if (hsb[1] == 0) { return [br, br, br]; }

    const hue = hsb[0];
    const f = hue % 60;
    const p = Math.round(hsb[2] * (100 - hsb[1]) / 10000 * 255);
    const q = Math.round(hsb[2] * (6000 - hsb[1] * f) / 600000 * 255);
    const t = Math.round(hsb[2] * (6000 - hsb[1] * (60 - f)) / 600000 * 255);

    let rgb;
    switch (Math.floor(hue / 60)) {
      case 0:
        rgb = [br, t, p];
        break;
      case 1:
        rgb = [q, br, p];
        break;
      case 2:
        rgb = [p, br, t];
        break;
      case 3:
        rgb = [p, q, br];
        break;
      case 4:
        rgb = [t, p, br];
        break;
      default:
        rgb = [br, p, q];
        break;
    }
    return rgb;
  }
  /**
 * hsv转rgb, 来自维基百科的公式的完整实现, 变量名都没改
 * @example
 * hsvToRgb(0, 1, 1)  = {r: 255, g: 0, b: 0}
 * hsvToRgb(0.5, 1, 0.5) = {r: 128, g: 1, b: 0}
 * @param {Number} h - hue表示色相, 0°~360°
 * @param {Number} s - Saturation饱和度，0%~100%
 * @param {Number} v - Value表示明度, 0%~100%
 * @returns {Object} RGB的颜色值
 * r - red, 0~255
 * g - green, 0~255
 * b - blue, 0~255
 */
  hsvToRgb(h:number, s:number, v:number) {
    let r,
      g,
      b,
      i,
      f,
      p,
      q,
      t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));

    i = (getSolutionOfLinearConguenceEquation(1, Math.floor(h / 60), 6) || [0])[0];

    f = h / 60 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };
  hsv2hsb([h, s, v]:number[]) {
    return [h,s,v];
  }
  hsv2hsl([h, s, v]:number[]) {
    const rgb = this.hsv2rgb([h,s,v]);
    return this.rgb2hsl(rgb);
  }
  hsv2yuv([h, s, v]:number[]) {
    const rgb = this.hsv2rgb([h,s,v]);
    return this.rgb2yuv(rgb);
  }
  hsv2kelvin([h, s, v]:number[]) {
    const rgb = this.hsv2rgb([h,s,v]);
    return this.rgb2kelvin(rgb);
  }
  /**
   * YUV to HEX\RGB\HSB\HSL\HSV\KELVIN
   */
  yuv2hex([y, u, v]: number[]){
    const rgb = this.yuv2rgb([y, u, v]);
    return this.rgb2hex(rgb)
  }
  yuv2rgb([y, u, v]: number[]) {
    let r;
    let g;
    let b;

    // y = parseInt(y);
    // u = parseInt(u);
    // v = parseInt(v);

    r = y + 1.4075 * (v - 128);
    g = y - 0.3455 * (u - 128) - 0.7169 * (v - 128);
    b = y + 1.779 * (u - 128);

    // r = Math.floor(r);
    // g = Math.floor(g);
    // b = Math.floor(b);

    r = r < 0 ? 0 : r;
    r = r > maxIn ? maxIn : r;

    g = g < 0 ? 0 : g;
    g = g > maxIn ? maxIn : g;

    b = b < 0 ? 0 : b;
    b = b > maxIn ? maxIn : b;

    const rgb = [r, g, b];
    if (a !== undefined) {
      rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
    }
    return rgb;
  }
  yuv2hsb([y, u, v]: number[]) {
    const rgb = this.yuv2rgb([y, u, v]);
    return this.rgb2hsv(rgb)
  }
  yuv2hsl([y, u, v]: number[]) {
    const rgb = this.yuv2rgb([y, u, v]);
    return this.rgb2hsl(rgb)
  }
  yuv2hsv([y, u, v]: number[]) {
    const rgb = this.yuv2rgb([y, u, v]);
    return this.rgb2hsv(rgb)
  }
  yuv2kelvin([y, u, v]: number[]) {
    const rgb = this.yuv2rgb([y, u, v]);
    return this.rgb2kelvin(rgb);
  }

  /**
   * HSL to HEX\RGB\HSB\YUV\HSV\KELVIN
   */
  hsl2rgb([h , s, l ]:number[]) {
    h = parseFloat('' + h);
    s = parseFloat('' + s);
    l = parseFloat('' + l);
    if (h < 0) { h = 0; }
    if (s < 0) { s = 0; }
    if (l < 0) { l = 0; }
    if (h >= 360) { h = 359; }
    if (s > 100) { s = 100; }
    if (l > 100) { l = 100; }
    s /= 100;
    l /= 100;
    const C = (1 - Math.abs(2 * l - 1)) * s;
    const hh = h / 60;
    const X = C * (1 - Math.abs(hh % 2 - 1));
    let r = 0;
    let g = 0;
    let b = 0;
    if (hh >= 0 && hh < 1) {
      r = C;
      g = X;
    } else if (hh >= 1 && hh < 2) {
      r = X;
      g = C;
    } else if (hh >= 2 && hh < 3) {
      g = C;
      b = X;
    } else if (hh >= 3 && hh < 4) {
      g = X;
      b = C;
    } else if (hh >= 4 && hh < 5) {
      r = X;
      b = C;
    } else {
      r = C;
      b = X;
    }
    const m = l - C / 2;
    r += m;
    g += m;
    b += m;
    r *= maxIn;
    g *= maxIn;
    b *= maxIn;
    // r = Math.floor(r);
    // g = Math.floor(g);
    // b = Math.floor(b);

    const rgb = [r, g, b];
    if (a !== undefined) {
      rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
    }
    return rgb;
  }
  /**
 * 维基百科的hsl转rgb的完整实现，变量名没有改
 * @example
 * hslToRgb(0, 1, 0.5) = {r: 255, g: 0, b: 0}
 * hslToRgb(120, 1, 0.75) = {r: 128, g: 255, b: 128}
 * hslToRgb(240, 1, 0.25) = {r: 0, g: 0, b: 128}
 * @param {Number} h - hue表示色相, 0°~360°
 * @param {Number} s - Saturation饱和度，0%~100%
 * @param {Number} l - Lightness表示亮度, 0%~100%
 * @returns {Object} RGB的颜色值
 * r - red, 0~255
 * g - green, 0~255
 * b - blue, 0~255
 */
  hslToRgb(h:number, s:number, l:number) { // 360, 1.0, 1.0
    const h0 = (h % 360 + 360) % 360 / 360;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = _hueToRgb(p, q, h0 + 1 / 3);
    const g = _hueToRgb(p, q, h0);
    const b = _hueToRgb(p, q, h0 - 1 / 3);

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  hsl2hex([h , s, l ]:number[]) {
    const rgb = this.hsl2rgb([h , s, l ]);
    return this.rgb2hex(rgb);
  }
  hsl2hsb([h , s, l ]:number[]) {
    const rgb = this.hsl2rgb([h , s, l ]);
    return this.rgb2hsv(rgb);
  }
  hsl2hsv([h , s, l ]:number[]) {
    const rgb = this.hsl2rgb([h , s, l ]);
    return this.rgb2hsv(rgb);
  }
  hsl2yuv([h , s, l ]:number[]) {
    const rgb = this.hsl2rgb([h , s, l ]);
    return this.rgb2yuv(rgb);
  }
  hsl2kelvin([h , s, l ]:number[]) {
    const rgb = this.yuv2rgb([h , s, l ]);
    return this.rgb2kelvin(rgb);
  }

  /**
   * KELVIN to HEX\RGB\HSB\YUV\HSV\HSL
   */

  /**
   *
   *  Neil Bartlett
   *  neilbartlett.com
   *  2015-01-22
   *
   *  Copyright [2015] [Neil Bartlett] *
   *
   * Color Temperature is the color due to black body radiation at a given
   * temperature. The temperature is given in Kelvin. The concept is widely used
   * in photography and in tools such as f.lux.
   *
   * The function here converts a given color temperature into a near equivalent
   * in the RGB colorspace. The function is based on a curve fit on standard sparse
   * set of Kelvin to RGB mappings.
   *
   * Two conversions are presented here. The one colorTempertature2RGBUSingTH
   * is a JS version of the algorithm developed by Tanner Helland. The second is a
   * slightly more accurate conversion based on a refitting of the original data
   * using different curve fit functions. The performance cost of the two
   * approaches is very similar and in general the second algorithm is preferred.
   *
   * NOTE The approximations used are suitable for photo-mainpulation and other
   * non-critical uses. They are not suitable for medical or other high accuracy
   * use cases.
   *
   * Accuracy is best between 1000K and 40000K.
   *
   * See http://github.com/neilbartlett/color-temperature for further details.
   *
   **/

  /**
   * A JS verion of Tanner Helland's original algorithm.
   * Input: color temperature in degrees Kelvin
   * Output: json object of red, green and blue components of the Kelvin temperature
   */
   kelvin2rgbUsingTH(kelvin: number) {
    const temperature = kelvin / 100.0;
    let red;
    let green;
    let blue;

    if (temperature <= 66.0) {
      red = 255;
    } else {
      red = temperature - 60.0;
      red = 329.698727446 * Math.pow(red, -0.1332047592);
      if (red < 0) { red = 0; }
      if (red > 255) { red = 255; }
    }

    /* Calculate green */

    if (temperature <= 66.0) {
      green = temperature;
      green = 99.4708025861 * Math.log(green) - 161.1195681661;
      if (green < 0) { green = 0; }
      if (green > 255) { green = 255; }
    } else {
      green = temperature - 60.0;
      green = 288.1221695283 * Math.pow(green, -0.0755148492);
      if (green < 0) { green = 0; }
      if (green > 255) { green = 255; }
    }

    /* Calculate blue */

    if (temperature >= 66.0) {
      blue = 255;
    } else if (temperature <= 19.0) {
      blue = 0;
    } else {
      blue = temperature - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      if (blue < 0) { blue = 0; }
      if (blue > 255) { blue = 255; }
    }

    return [red, green, blue];
  }

  /**
   * A more accurate version algorithm based on a different curve fit to the
   * original RGB to Kelvin data.
   * Input: color temperature in degrees Kelvin
   * Output: json object of red, green and blue components of the Kelvin temperature
   */
  kelvin2rgb(kelvin: number) {
    const temperature = kelvin / 100.0;
    let red;
    let green;
    let blue;

    if (temperature < 66.0) {
      red = 255;
    } else {
      // a + b x + c Log[x] /.
      // {a -> 351.97690566805693`,
      // b -> 0.114206453784165`,
      // c -> -40.25366309332127
      // x -> (kelvin/100) - 55}
      red = temperature - 55.0;
      red =
        351.97690566805693 +
        0.114206453784165 * red -
        40.25366309332127 * Math.log(red);
      if (red < 0) { red = 0; }
      if (red > 255) { red = 255; }
    }

    /* Calculate green */

    if (temperature < 66.0) {
      // a + b x + c Log[x] /.
      // {a -> -155.25485562709179`,
      // b -> -0.44596950469579133`,
      // c -> 104.49216199393888`,
      // x -> (kelvin/100) - 2}
      green = temperature - 2;
      green =
        -155.25485562709179 -
        0.44596950469579133 * green +
        104.49216199393888 * Math.log(green);
      if (green < 0) { green = 0; }
      if (green > 255) { green = 255; }
    } else {
      // a + b x + c Log[x] /.
      // {a -> 325.4494125711974`,
      // b -> 0.07943456536662342`,
      // c -> -28.0852963507957`,
      // x -> (kelvin/100) - 50}
      green = temperature - 50.0;
      green =
        325.4494125711974 +
        0.07943456536662342 * green -
        28.0852963507957 * Math.log(green);
      if (green < 0) { green = 0; }
      if (green > 255) { green = 255; }
    }

    /* Calculate blue */

    if (temperature >= 66.0) {
      blue = 255;
    } else if (temperature <= 20.0) {
      blue = 0;
    } else {
      // a + b x + c Log[x] /.
      // {a -> -254.76935184120902`,
      // b -> 0.8274096064007395`,
      // c -> 115.67994401066147`,
      // x -> kelvin/100 - 10}
      blue = temperature - 10;
      blue =
        -254.76935184120902 +
        0.8274096064007395 * blue +
        115.67994401066147 * Math.log(blue);
      if (blue < 0) { blue = 0; }
      if (blue > 255) { blue = 255; }
    }

    return [red, green, blue];
  }
  kelvin2hex(kelvin: number) {
    const rgb = this.kelvin2rgb(kelvin)
    return this.rgb2hex(rgb)
  }
  kelvin2hsv(kelvin: number) {
    const rgb = this.kelvin2rgb(kelvin)
    return this.rgb2hsv(rgb)
  }
  kelvin2hsl(kelvin: number) {
    const rgb = this.kelvin2rgb(kelvin)
    return this.rgb2hsl(rgb)
  }
  kelvin2hsb(kelvin: number) {
    const rgb = this.kelvin2rgb(kelvin)
    return this.rgb2hsv(rgb)
  }
  kelvin2yuv(kelvin: number) {
    const rgb = this.kelvin2rgb(kelvin)
    return this.rgb2yuv(rgb)
  }

  // 随机数
  randomRgb(min = 0, max = 255) {
    const random = (mi: number, ma: number) => {
      let x = max;
      let y = min;
      if (x < y) {
        x = mi;
        y = ma;
      }
      return Math.random() * (x - y) + y;
    };

    return [random(min, max), random(min, max), random(min, max)];
  }

  randomHsb() {
    const random = (min: number, max: number) => {
      let x = max;
      let y = min;
      if (x < y) {
        x = min;
        y = max;
      }
      return Math.random() * (x - y) + y;
    };

    return [random(0, 360), random(0, 100), random(0, 100)];
  }

  // 补色
  complement(color: string) {
    const rgb = this.decode(color).map(item => Math.round(+item));
    const mm = Math.min(...rgb) + Math.max(...rgb);
    const [r, g, b] = rgb.map(item => mm - item);
    const hex = this.rgb2hex([r, g, b]);
    return hex;
  }

  // 反相
  reversed(color: string) {
    const rgb = this.decode(color).map(item => Math.round(item));
    const [r, g, b] = rgb.map(item => maxIn - item);
    return this.rgb2hex([r, g, b]);
  }

  hex2RgbString(hex: string, a: number) {
    const rgb = this.decode(hex);
    return toRgbString(rgb, a);
  }

  hsv2RgbString(h: number, s: number, v: number, a: number) {
    const [r, g, b, al] = this.hsv2rgb([h, s, v]);
    return toRgbString([r, g, b], al);
  }

  hsb2RgbString(...args: any) {
    return this.hsv2RgbString.apply(this, args);
  }

  hsl2RgbString(h: number, s: number, l: number, a: number) {
    const [r, g, b, al] = this.hsl2rgb([h, s, l, a]);
    return toRgbString([r, g, b], al);
  }

  yuv2RgbString(y: number, u: number, v: number, a: number) {
    const [r, g, b, al] = this.yuv2rgb([y, u, v, a]);
    return toRgbString([r, g, b], al);
  }


  toRgbString(rgb: number[], a: number) {
    return toRgbString(rgb, a);
  }

}

const toRgbString = (rgb: number[], a: number) => {
  const len = rgb.length;

  if (len === 4) {
    a = rgb.pop();
  }
  rgb = rgb.map(item => Math.round(item));
  if (len === 4) {
    rgb.push(a);
    return `rgba(${rgb.join(', ')})`;
  }

  if (a !== undefined && rgb.length === 3) {
    rgb.push(a > 1 ? 1 : a < 0 ? 0 : a);
    return `rgba(${rgb.join(', ')})`;
  }
  return `rgb(${rgb.join(', ')})`;
};

const color = new Color();


export default {
  color,
  isColorType
}
