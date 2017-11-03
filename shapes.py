from numpy import arange
from math import sin, cos
from scipy.interpolate import interp1d

class Shape(object):
    def __init__(self, starting_points = None):
        if starting_points is not None:
            self._points = starting_points
        else:
            self._points = []

    def add_point(self, point):
        self._points.append(point)

    @property
    def gcode(self):
        return #This should return self._points translated to gcode

    def __add__(self, other):
        return Shape(self._points + other._points)

    def __repr__(self):
        return 'Shape' #This should return self.gcode

    def __iter__(self):
        return iter(self._points)


class Circle(Shape):
    def __init__(self, r, step_size = None, starting_points = None):
        if step_size is None:
            step_size = 1
        else:
            step_size = step_size
        super().__init__(starting_points)
        for a in arange(0, 360 + step_size, step_size):
            self._points.append((cos(a) * r, sin(a) * r))


class Curve(Shape):
    def __init__(self, points, step_size = None):
        if step_size is None:
            step_size = 1
        super().__init__(points)
        f = interp1d([x for x, y in points], [y for x, y in points])
        for a in arange(0, max(points, key = lambda xy: xy[0])[0] + step_size, step_size):
            self._points.append((a, f(a)))
