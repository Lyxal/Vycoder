import csv
from codepage import codepage

programs = []

with open("programs.txt", "r", encoding="utf-8") as f:
    for line in f:
        programs.append(line.strip())

# sort programs by distance to average program length

average_length = sum(len(program) for program in programs) / len(programs)
programs.sort(
    key=lambda program: abs(len(program) - average_length), reverse=True
)

with open("Data.csv", "w", newline="") as f:
    writer = csv.writer(f)
    for vyxal in programs:
        writer.writerow([codepage.index(c) for c in vyxal])

with open("TrainingData.csv", "w", newline="") as f:
    writer = csv.writer(f)
    for vyxal in programs[:1000]:
        writer.writerow([codepage.index(c) for c in vyxal])

with open("TestData.csv", "w", newline="") as f:
    writer = csv.writer(f)
    for vyxal in programs[1000:]:
        writer.writerow([codepage.index(c) for c in vyxal])
