export function lerp(min: number, max: number, coef: number) {
    return min + (max - min) * coef
}
