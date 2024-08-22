import { LevelCells, LevelDimensions } from "../Level";

const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function unpackLevelCells(packed: string): LevelDimensions & LevelCells {
    const width = base64Chars.indexOf(packed[0]);
    const height = base64Chars.indexOf(packed[1]);
    const length = width * height;
    if (packed.length !== Math.floor((length + 5) / 6) + 2) {
        throw new RangeError("Invalid level cells");
    }
    const cells = new Array<boolean>(length);
    for (let inI = 2, outI = 0; outI < length; inI++) {
        let v = base64Chars.indexOf(packed[inI]);
        for (let i = 0; i < 6; i++) {
            if (outI < cells.length) {
                cells[outI++] = (v & 0x20) != 0;
            }
            v <<= 1;
        }
    }
    return {
        width,
        height,
        cells,
    };
}

export function packLevelCells(level: LevelDimensions & LevelCells): string {
    let cells = base64Chars[level.width] + base64Chars[level.height];
    for (let inI = 0; inI < level.cells.length; ) {
        let v = 0;
        for (let i = 0; i < 6; i++) {
            v <<= 1;
            v |= +(inI < level.cells.length && level.cells[inI++]);
        }
        cells += base64Chars[v];
    }
    return cells;
}
