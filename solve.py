import numpy as np
import math
from sympy import Symbol, solve

RAY = Symbol('RAY')


class Force():
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def getForce(self):
        return self.x, self.y


height = 3
length = 2
DEGREE = 60
RAD = math.atan(height / length)
cc = math.cos(RAD)
ss = math.sin(RAD)

NUM_JOINTS = 7
NUM_EDGES = NUM_JOINTS + (NUM_JOINTS - 3)
Matrix = []

load = {}
joints = ["A", "B", "C", "D", "E", "F", "G"]
for letter in joints:
    load[letter] = Force(0, 0)

load["D"].y = 20
load["E"].y = 20
load["F"].y = 10


p = []
for letter in joints:
    temp1 = []
    loadX, loadY = load[letter].getForce()
    temp1.append(loadX)

    temp2 = []
    temp2.append(loadY)

    p.append(temp1)
    p.append(temp2)

P = np.matrix(p)

# ROW 1:Ax, ROW 2:Ay, ROW 3:Bx, ROW 4:By
for _ in range(NUM_EDGES + 3):
    temp = []
    # COL 1:Member 1 / EDGE
    for _ in range(NUM_EDGES + 3):
        temp.append(0)
    Matrix.append(temp)

start = 0
count = 0
for i in range(NUM_EDGES):
    if i%2:
        Matrix[start][i] = 1
        Matrix[start+4][i] = -1
        start += 2
    else:
        Matrix[start][i] = cc
        Matrix[start+2][i] = -cc
        Matrix[start + 1][i] = -ss if count % 2 else ss
        Matrix[start + 3][i] = ss if count % 2 else -ss
        count += 1

Matrix[1][NUM_EDGES] = 1   # RAY
Matrix[0][NUM_EDGES+1] = 1   # RAX
Matrix[NUM_EDGES+2][NUM_EDGES+2] = 1   # RGY


Matrix = np.matrix(Matrix)
print(Matrix)

inv = np.linalg.inv(Matrix)

sol = np.matmul(inv, -P)
print(sol)

forceType = {}
for i in range(NUM_EDGES):
    forceType[i] = "Tension" if sol[i] > 0 else "Compression"


for key, value in forceType.items():
    print(key+1, value)