import { LevelCells, LevelInfo, LevelSize } from "../Level";

const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function unpackLevelCells(in_: string, { width, height }: LevelSize) {
    const length = width * height;
    if (in_.length !== Math.floor((length + 5) / 6)) {
        throw new RangeError("Invalid level cells");
    }
    const out = new Array<boolean>(length);
    for (let inI = 0, outI = 0; outI < length; inI++) {
        let v = base64Chars.indexOf(in_[inI]);
        for (let i = 0; i < 6; i++) {
            if (outI < out.length) {
                out[outI++] = (v & 0x20) != 0;
            }
            v <<= 1;
        }
    }
    return out;
}

export function packLevelCells(in_: boolean[]) {
    let out = "";
    for (let inI = 0; inI < in_.length; ) {
        let v = 0;
        for (let i = 0; i < 6; i++) {
            v <<= 1;
            v |= +(inI < in_.length && in_[inI++]);
        }
        out += base64Chars[v];
    }
    return out;
}

export function unpackLevel(packed: string): [LevelInfo & LevelSize, string] {
    console.log(packed);
    let i = 0;
    const nameLength =
        (base64Chars.indexOf(packed[i++]) << 6) |
        base64Chars.indexOf(packed[i++]);
    const name = packed.slice(i, (i += nameLength));
    const width = base64Chars.indexOf(packed[i++]);
    const height = base64Chars.indexOf(packed[i++]);
    return [{ name, width, height }, packed.slice(i)];
}

export function packLevel(level: LevelInfo & LevelCells): string {
    let out = "";
    out +=
        base64Chars[level.name.length >> 6] +
        base64Chars[level.name.length & 63];
    out += base64Chars[level.width] + base64Chars[level.height];
    out += packLevelCells(level.cells);
    return out;
}
