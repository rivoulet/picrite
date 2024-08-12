export function clamp(v: number, min: number, max: number) {
    return v < min ? min : v > max ? max : v;
}

export function equal2<T>(a: [T, T], b: [T, T]) {
    return a[0] === b[0] && a[1] === b[1];
}
