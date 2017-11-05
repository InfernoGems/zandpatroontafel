from math import sin
path = []
for phi in range(360):
	path.append((sin(phi) + 1, phi))
