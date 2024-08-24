import { LevelCells, LevelSize, SavedLevelInfo, SolvedState } from "src/Level";

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

export function unpackLevel(
    packed: string,
    id: string,
    hasPlayInfo: boolean,
): [SavedLevelInfo & LevelSize, string] {
    let i = 0;
    const nameLength =
        (base64Chars.indexOf(packed[i++]) << 6) |
        base64Chars.indexOf(packed[i++]);
    const name = atob(packed.slice(i, (i += nameLength)));
    let solved: SolvedState;
    let record: number | null = null;
    if (hasPlayInfo) {
        solved = base64Chars.indexOf(packed[i++]);
        const recordStringLength = base64Chars.indexOf(packed[i++]);
        if (recordStringLength) {
            const recordString = packed.slice(i, (i += recordStringLength));
            record = parseFloat(recordString);
        }
    } else {
        solved = SolvedState.Unsolved;
    }
    const width = base64Chars.indexOf(packed[i++]);
    const height = base64Chars.indexOf(packed[i++]);
    return [{ id, name, solved, record, width, height }, packed.slice(i)];
}

export function packLevel(
    level: SavedLevelInfo & LevelCells,
    hasPlayInfo: boolean,
): string {
    let out = "";
    const name = btoa(level.name);
    out += base64Chars[name.length >> 6] + base64Chars[name.length & 63];
    out += name;
    if (hasPlayInfo) {
        out += base64Chars[level.solved];
        if (level.record === null) {
            out += base64Chars[0];
        } else {
            const recordString = level.record.toString();
            out += base64Chars[recordString.length];
            out += recordString;
        }
    }
    out += base64Chars[level.width] + base64Chars[level.height];
    out += packLevelCells(level.cells);
    return out;
}
