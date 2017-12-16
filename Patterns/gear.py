from numpy import arange

path = []

up = False
for a in range(360):
	for a2 in arange(a, a + 1.1, 0.1):
		if up:
			path.append((a2, 1))
		else:
			path.append((a2, 0))
	up = not up