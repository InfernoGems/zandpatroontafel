from math import cos, radians

path = []
for a in range(36000):
        r = 1.5*cos(a / 100)
        phi = a /9600

        path.append((r, phi))
