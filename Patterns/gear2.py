r, phi = 0, 0
r_increment = 1
phi_increment = 1/360
path = []
for _ in range(90):
	phi += phi_increment
	path.append((r, phi))
	r += r_increment
	path.append((r, phi))
	phi += phi_increment
	path.append((r, phi))
	r -= r_increment
	path.append((r, phi))