def create_gcode(path):
    gcode = 'G90 G16 G17\n'
    for r, phi in path:
        gcode += 'G01 X' + '{0:.20f}'.format(r) + ' Y' + '{0:.20f}'.format(phi) + '\n'#'G01 X{0:f} Y{0:f}'.format(r, phi) + '\n'
    return gcode

def import_path(file):
    namespace = {}
    with open(file) as f:
        exec(f.read(), namespace)
    return namespace['path']

def main():
    path = import_path('code.py')
    print(create_gcode(path))

main()
