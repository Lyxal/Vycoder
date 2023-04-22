import csv
from . import config

data_path = "vycoder/TrainingData.csv" if config.training else "vycoder/Data.csv"

frequencies = [0]*256

max_distance = 8
positions = [[[0]*256 for _ in range(257)] for _ in range(max_distance)]  # dimensions [max_distance, 257, 256]

with open(data_path, newline="") as f:
    for row in csv.reader(f):
        row = [int(x) for x in row]
        for i in range(len(row)):
            frequencies[row[i]] += 1
            for j in range(max_distance):
                if i-j-1 >= 0:
                    positions[j][row[i-j-1]][row[i]] += 1
                else:
                    positions[j][256][row[i]] += 1

pairs = positions[0]


def uniform(x):
    return [1]*256


def frequency(x):
    return frequencies


def frequency_plus_uniform(alpha):
    return lambda x: [x+alpha*sum(frequencies)/256 for x in frequencies]


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
