export function clamp(v: number, min: number, max: number) {
    return v < min ? min : v > max ? max : v;
}

export function equal2<T>(a: [T, T], b: [T, T]) {
    return a[0] === b[0] && a[1] === b[1];
}

export function equalArrays<T>(a: T[], b: T[]) {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
