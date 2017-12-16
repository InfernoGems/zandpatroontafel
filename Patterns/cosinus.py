from math import cos, radians
from numpy import arange

path = []
for a in arange(0, 360, .1):
	path.append((a, cos(radians(a))))
