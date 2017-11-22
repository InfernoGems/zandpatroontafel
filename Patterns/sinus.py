from math import sin, radians

path = []
for a in range(3600):
        r = 1.5*sin(a / 100)
        phi = a /9600

        path.append((r, phi))
