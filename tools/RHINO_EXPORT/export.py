import rhinoscriptsyntax as rs
import scriptcontext as sc

def get_type(object):
    return type(object).__name__

def get_objects(name):
    return sc.doc.Objects.FindByLayer(name)

def o(name, geometry, attrs):
    return {
        'type': name,
        'geometry': geometry,
        'attributes': attrs,
    }

def point(a):
    return [a.X, a.Y, a.Z]

def export_props(a):
#    print('\n'.join(dir(a.UserData)))
#    print(a.UserData.Count)
#    print(a.UserData.Item(0))
#    print(a.UserDictionary.Count)
#    print(a.GetUserString('val'))

    return {}

def export_point(geom):
    a = geom.Location
    return o('point', point(a), export_props(geom))

def export_polyline(geom):
    data = []
    for i in range(geom.PointCount):
        data.append(point(geom.Point(i)))
    return o('polyline', data, export_props(geom))

def export_line(geom):
    data = [point(x) for x in [geom.PointAtStart, geom.PointAtEnd]]
    return o('polyline', data, export_props(geom))

def export_objects(objects):
    ex = {
        'Point': export_point,
        'PolylineCurve': export_polyline,
        'LineCurve': export_line,
    }
    result = []
    for x in objects:
        geom = x.Geometry
        t = get_type(geom)
        if t not in ex:
            continue
        e = ex[t]
        result.append(e(geom))
    return result

def export_layer(name):
    objects = get_objects(name)
    return {
        'layer': name,
        'objects': export_objects(objects),
    }

def export_document():
    names = ['METRO', 'ROAD']
    return {
        'layers': [export_layer(x) for x in names]
    }

def serialize(doc):
    import json
    return json.dumps(doc, indent=4)

def save_document(doc, path):
    d = serialize(doc)
    with open(path, 'w') as f:
        f.write(d)

#e = export_layer('metro')
#e = export_layer('obstacles')
e = export_document()
#print(e)

save_document(e, 'U:\#TOOLBOX\SWARM_EXPORT\SWARM.json')

#print(serialize(e))
#for layer in sc.doc.Layers:
#    e = export_layer(layer.Name)
#    print(e)