from math import sin
path = []
for phi in range(100):
	path.append((sin(phi/100)*10 + 1, phi/100))
