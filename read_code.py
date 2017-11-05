def create_gcode(path):
    gcode = 'G90\nG92 X1 Y0\n'
    for r, phi in path:
        gcode += 'G90 G01 X' + '{0:.5f}'.format(r) + ' Y' + '{0:.5f}'.format(phi) + ' F100\n'
    return gcode

def import_path(file):
    namespace = {}
    with open(file) as f:
        exec(f.read(), namespace)
    return namespace['path']

def main():
    path = import_path('code.py')
    print(create_gcode(path))

if __name__ == '__main__':
    main()
