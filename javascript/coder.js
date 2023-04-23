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

export function decode(inp, prediction, minBits = 16n) {
  let out = [];

  // inclusive range [bottom, top]
  let bottom = 0n;
  let top = 0n;

  let bits = 0n;
  let acc = 0n;
  let i = 0;
  let consumed = 0n;

  while (top - bottom + 1n > 2n ** (BigInt(i) - BigInt(inp.length) + 1n)) {
    let bitsToAdd = max(minBits - BigInt(top + 1n - bottom).toString(2).length + 1n, 0n);

    bottom *= 2n ** bitsToAdd;
    top = (top + 1n) * (2n ** bitsToAdd) - 1n;
    let l = max(BigInt(min(inp.length - i, bitsToAdd)), 0n);
    acc = acc * (2n ** l) + BigInt(fromBin(inp.slice(i, i + Number(l))));
    acc *= 2n ** (bitsToAdd - l);
    i += Number(bitsToAdd);

    bits += bitsToAdd;

    let ranges = [...prediction(out)].reduce((acc, x) => {
      let last = acc[acc.length - 1] || bottom;
      acc.push(BigInt(x) * (top + 1n - bottom) / prediction(out)[prediction(out).length - 1] + bottom);
      return acc;
    }, []);

    let x = ranges.findIndex((r, j) => r > acc);
    out.push(x);

    ranges.unshift(bottom);

    bottom = ranges[x];
    top = ranges[x + 1n] - 1n;

    let differentBits = BigInt(top ^ bottom).toString(2).length;
    consumed += bits - differentBits;

    bits = differentBits;
    bottom &= 2n ** bits - 1n;
    top &= 2n ** bits - 1n;
    acc &= 2n ** bits - 1n;
  }

  return out;
}
