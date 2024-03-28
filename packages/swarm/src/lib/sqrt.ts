// // Based on the fast inverse square root function
// // https://en.wikipedia.org/wiki/Fast_inverse_square_root
// // Some original comments preserved for humor value
// // Designed to try to mimic the original as closely as possible
// export function fastInverseSqrt(number) {
//     const threehalfs = 1.5
//
//     let x2 = number * 0.5
//     let y = number
//     //evil floating bit level hacking
//     let buf = new ArrayBuffer(4)
//     (new Float32Array(buf))[0] = number
//     let i = (new Uint32Array(buf))[0]
//     i = (0x5f3759df - (i >> 1)) //What the fuck?
//     (new Uint32Array(buf))[0] = i
//     y = (new Float32Array(buf))[0]
//     y = y * (threehalfs - (x2 * y * y))   // 1st iteration
// //  y  = y * ( threehalfs - ( x2 * y * y ) )   // 2nd iteration, this can be removed
//
//     return y;
// }

//Based on the fast inverse square root function
// https://en.wikipedia.org/wiki/Fast_inverse_square_root
// Some original comments preserved for humor value
// Designed to try to mimic the original as closely as possible
export function fastInverseSqrt(number) {
    var i;
    var x2, y;
    const threehalfs = 1.5;

    x2 = number * 0.5;
    y = number;
    //evil floating bit level hacking
    var buf = new ArrayBuffer(4);
    (new Float32Array(buf))[0] = number;
    i = (new Uint32Array(buf))[0];
    i = (0x5f3759df - (i >> 1)); //What the fuck?
    (new Uint32Array(buf))[0] = i;
    y = (new Float32Array(buf))[0];
    y = y * (threehalfs - (x2 * y * y));   // 1st iteration
    //  y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

    return y;
}
