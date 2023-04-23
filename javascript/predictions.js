import data from './data.js';

let frequencies = Array(256).fill(0);

let max_distance = 8;
let positions = Array(max_distance).fill(Array(257).fill(Array(256).fill(0)));

for (let i = 0; i < data.length; i++) {
    let row = data[i];
    for (let j = 0; j < row.length; j++) {
        frequencies[row[j]] += 1;
        for (let k = 0; k < max_distance; k++) {
            if (j - k - 1 >= 0) {
                positions[k][row[j - k - 1]][row[j]] += 1;
            } else {
                positions[k][256][row[j]] += 1;
            }
        }
    }
}

let pairs = positions[0];

function uniform(x) {
    return Array(256).fill(1);
}

function frequency(x) {
    return frequencies;
}

/* python:
def frequency_plus_uniform(alpha):
    return lambda x: [x+alpha*sum(frequencies)/256 for x in frequencies]
*/

function frequency_plus_uniform(alpha) {
    return function (x) {
        return frequencies.map((x) => x + alpha * frequencies.reduce((a, b) => a + b) / 256);
    };
}

/* python:
def pair_frequency(alpha, beta):
    lookup = [[pairs[x][y]*sum(frequencies) + alpha*frequencies[y]*sum(pairs[x]) + sum(frequencies)*sum(pairs[x])*beta for y in range(256)] for x in range(257)]
    assert all(max(row)/sum(row) < 0.5 for row in lookup)
    def f(lst):
        if len(lst):
            x = lst[-1]
        else:
            x = 256
        return lookup[x]
    return f
*/

function pair_frequency(alpha, beta) {
    let lookup = Array(257).fill(Array(256).fill(0));
    for (let x = 0; x < 257; x++) {
        for (let y = 0; y < 256; y++) {
            lookup[x][y] = pairs[x][y] * frequencies.reduce((a, b) => a + b) + alpha * frequencies[y] * pairs[x].reduce((a, b) => a + b) + frequencies.reduce((a, b) => a + b) * pairs[x].reduce((a, b) => a + b) * beta;
        }
    }
    return function (lst) {
        if (lst.length) {
            x = lst[lst.length - 1];
        } else {
            x = 256;
        }
        return lookup[x];
    };
}

/* python:
def pair_frequency2(alpha, beta):
    lookup = [[pairs[x][y]*(sum(frequencies)+256*alpha) + beta*(frequencies[y] + alpha) for y in range(256)] for x in range(257)]
    assert all(max(row)/sum(row) < 0.5 for row in lookup)
    def f(lst):
        if len(lst):
            x = lst[-1]
        else:
            x = 256
        return lookup[x]
    return f
*/

export function pair_frequency2(alpha, beta) {
    let lookup = Array(257).fill(Array(256).fill(0));
    for (let x = 0; x < 257; x++) {
        for (let y = 0; y < 256; y++) {
            lookup[x][y] = pairs[x][y] * (frequencies.reduce((a, b) => a + b) + 256 * alpha) + beta * (frequencies[y] + alpha);
        }
    }
    return function (lst) {
        if (lst.length) {
            x = lst[lst.length - 1];
        } else {
            x = 256;
        }
        return lookup[x];
    };
}

/* python:
def weighted_positions(distance_weight, alpha, beta):
    def f(lst):
        out = [0]*256
        for i in reversed(range(max_distance)):
            if i < len(lst):
                out = [distance_weight(i)*x + y for x, y in zip(positions[i][lst[-i-1]], out)]
            elif i == 0:
                out = [distance_weight(i)*x + y for x, y in zip(positions[i][256], out)]
        out = [x*(sum(frequencies)+256*alpha) + beta*(y + alpha) for x, y in zip(out, frequencies)]
        return out
    return f
*/

function zip() {
    var args = [].slice.call(arguments);
    var shortest = args.length == 0 ? [] : args.reduce((a, b) => {
        return a.length < b.length ? a : b
    });

    return shortest.map(function (_, i) {
        return args.map(function (array) { return array[i] })
    });
}

export function weighted_positions(distance_weight, alpha, beta) {
    return function (lst) {
        let out = Array(256).fill(0);
        for (let i = max_distance - 1; i >= 0; i--) {
            if (i < lst.length) {
                out = zip(positions[i].at(lst[-i - 1]), out).map(x => distance_weight(i) * x[0] + x[1])
            } else if (i == 0) {
                out = zip(positions[i][256], out).map(x => distance_weight(i) * x[0] + x[1])
            }
        }
        out = zip(out, frequencies).map(x => x[0] * (frequencies.reduce((a, b) => a + b) + 256 * alpha) + beta * (x[1] + alpha));
        return out;
    };
}