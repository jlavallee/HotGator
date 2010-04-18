import os

try:
    import simplejson
except:
    import json as simplejson

class Point:
    def __init__(self,x,y):
        #assert (x > -180) and (x < 180)
        #assert (y > -90) and (y < 90)
        self.x = x
        self.y = y
    
    def __str__(self):
        return self.wkt
    
    @property
    def wkt(self):
        return 'POINT( %f %F )' % (self.x,self.y)

    @property
    def json(self):
        return simplejson.dumps({"type": "Point", "coordinates": [self.x,self.y]})

    def intersects(self,bbox):
        assert isinstance(bbox,tuple)
        minx,miny,maxx,maxy = bbox
        return not (self.x>maxx or self.x<minx or self.y>maxy or self.y<miny)

def read_caligator_json(filename):
    # get data from:
    #http://calagator.org/events.json?date%5Bstart%5D=2010-01-01&date%5Bend%5D=2010-12-31&commit=Filter
    return simplejson.loads(open(filename,'r').read())

def stream_csv(header,events_list):
    
    e_list = []
    ids = {}
    csv_items = ['%s,%s,%s' % header]
    for e in events_list:
        venue_id = e.get('venue_id')
        if venue_id:
            if venue_id in ids.keys():
                ids[venue_id] += 1        
            else:
                ids[venue_id] = 1
    
    for e in events_list:
        venue = e.get('venue')
        if venue:
            pnt = Point(venue['longitude'],venue['latitude'])
            v_id = e['venue_id']
            if v_id not in e_list:
                if pnt.x and pnt.y and pnt.intersects(bbox):
                    e_list.append(v_id)
                    csv_items.append('%s,%s,%s' % (pnt.x, pnt.y, ids[v_id]))
    return '\n'.join(csv_items)

def stream_vrt(name,csv,x,y,z):
    vrt = '''<OGRVRTDataSource>
    <OGRVRTLayer name="%(name)s">
        <SrcDataSource>%(csv)s</SrcDataSource>
        <GeometryType>wkbPoint</GeometryType>
        <LayerSRS>WGS84</LayerSRS>
        <GeometryField encoding="PointFromColumns" x="%(x)s" y="%(y)s" z="%(z)s"/>
    </OGRVRTLayer>
</OGRVRTDataSource>''' % locals()
    return vrt

def interpolate(vrt_file,bbox,filename,radius=0,smooth=0,width=256,height=256):
    xmin, ymin, xmax, ymax = bbox#-123.115196,45.351904,-122.237663,45.69395
    layer = vrt_file.replace('.vrt','')
    cmd = 'gdal_grid -a invdist:power=2.0:smoothing=%(smooth)f -txe %(xmin)f %(xmax)f -tye %(ymin)f %(ymax)f -outsize %(width)d %(height)d -l %(layer)s -of GTiff -ot Float32 %(vrt_file)s %(filename)s' % locals()
    os.system(cmd)

if __name__ == '__main__':
    # lets restrict points to this area (roughly PDX and neighborhoods)
    # bounding coordinates are in degrees
    bbox = (-123.115196,45.351904,-122.237663,45.69395)
    x,y,z = 'lon','lat','event_count'
    csv_header = x,y,z
    json_file = 'testdata/events.json'
    csv_file = 'heat.csv'
    vrt_file = 'heat.vrt'
 
    events_list = read_caligator_json(json_file)
    open(csv_file,'w').write(stream_csv(csv_header,events_list))
    open(vrt_file,'w').write(stream_vrt('heat',csv_file,x,y,z))
    # then open to demo in QGIS
    # it will be greyscale until you display values with color range
    interpolate(vrt_file,bbox,'pdx.tif',radius=.5,smooth=.001)