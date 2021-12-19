const rgbToLightness = (r: number, g: number, b: number) =>
    1 / 2 * (Math.max(r, g, b) + Math.min(r, g, b));

const rgbToSaturation = (r: number, g: number, b: number) => {
    const L = rgbToLightness(r, g, b);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return (L === 0 || L === 1)
        ? 0
        : (max - min) / (1 - Math.abs(2 * L - 1));
};

const rgbToHue = (r: number, g: number, b: number) => Math.round(
    Math.atan2(
        Math.sqrt(3) * (g - b),
        2 * r - g - b,
    ) * 180 / Math.PI
);

const rgbToHsl = (r: number, g: number, b: number) => {
    const lightness = rgbToLightness(r, g, b);
    const saturation = rgbToSaturation(r, g, b);
    const hue = rgbToHue(r, g, b);
    return [hue, saturation, lightness];
}

const hslToRgb = (h: number, s: number, l: number) => {
    const C = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    const X = C * (1 - Math.abs(hPrime % 2 - 1));
    const m = l - C / 2;
    const withLight = (r: number, g: number, b: number) => [r + m, g + m, b + m];
    if (hPrime <= 1) { return withLight(C, X, 0); } else
        if (hPrime <= 2) { return withLight(X, C, 0); } else
            if (hPrime <= 3) { return withLight(0, C, X); } else
                if (hPrime <= 4) { return withLight(0, X, C); } else
                    if (hPrime <= 5) { return withLight(X, 0, C); } else
                        if (hPrime <= 6) { return withLight(C, 0, X); }
}

const modulo = (x: number, n: number) => (x % n + n) % n;

class Color {
    red: number;
    green: number;
    blue: number;
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
    constructor(red: number, green: number, blue: number, hue: number, saturation: number, lightness: number, alpha?: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
        if (typeof alpha !== 'undefined') {
            this.alpha = alpha;
        } else {
            this.alpha = 1.0;
        }
    }
    hueRotation = (rotation: number) => {
        this.hue = modulo(this.hue + rotation, 360)
        let rgb = hslToRgb(this.hue, this.saturation, this.lightness)
        console.log(rgb);
        this.red = rgb[0];
        this.green = rgb[1];
        this.blue = rgb[2];
    }
    toCssRGBA = () => {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    }
}

const rgbToObject = (red: number, green: number, blue: number, alpha?: number) => {
    const [hue, saturation, lightness] = rgbToHsl(red, green, blue);
    return new Color(red, green, blue, hue, saturation, lightness, alpha);
}
const hslToObject = (hue: number, saturation: number, lightness: number, alpha?: number) => {
    const [red, green, blue] = hslToRgb(hue, saturation, lightness);
    return new Color(red, green, blue, hue, saturation, lightness, alpha);
}
