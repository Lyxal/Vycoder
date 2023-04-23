/**
 * def bin_list(x: int, len: int) -> list[int]:
    return [int(bool(x & (2**n))) for n in reversed(range(len))]
 */

function bin_list(x, len) {
    return [...Array(len).keys()].map(n => Number(Boolean(x & (2 ** n))));
}

/** def from_bin(x: list[int]) -> int:
    return int("".join(str(b) for b in x), base=2) if len(x) else 0
    */

function from_bin(x) {
    return parseInt(x.join(""), 2);
}

export function encode(
    inp,
    prediction,
    min_bits = 16
) {
    let out = [];

    // inclusive range [bottom, top]
    let bottom = 0;
    let top = 0;

    let bits = 0;


    for (let i = 0; i <= inp.length; i++) {
        let bits_to_add = Math.max(min_bits - (top + 1 - bottom).toString(2).length + 1, 0);
        bottom *= 2 ** bits_to_add
        top = (top + 1) * (2 ** bits_to_add) - 1
        bits += bits_to_add

        let ranges = prediction(inp.slice(0, i + 1)).reduce((a, b) => a.concat(a[a.length - 1] + b), [0]).slice(0, -1);
        console.log(prediction(inp.slice(0, i + 1)))
        ranges = ranges.map(y => Math.floor(y * (top + 1 - bottom) / ranges[ranges.length - 1]) + bottom);
        ranges.unshift(bottom);


        bottom = ranges[inp[i]];
        top = ranges[inp[i] + 1] - 1;

        let different_bits = (top ^ bottom).toString(2).length;
        let bits_to_store = bits - different_bits
        console.log(top);
        console.log(bottom);
        out = out.concat(bin_list(top, bits).slice(0, bits_to_store));
        bits = different_bits;
        bottom &= 2 ** bits - 1;
        top &= 2 ** bits - 1;
        console.log(out)
    }


    if (bottom == 0) {
        if (top + 1 != 2 ** bits) {
            out.push(0);
        }
    } else {
        out.push(1);
        for (let i = 0; i < bits - (top - bottom + 1).toString(2).length; i++) {
            out.push(0);
        }
    }

    return out;
}