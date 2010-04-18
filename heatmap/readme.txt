Heatmaps from caligator data
----------------------------

PDXOSGIS hackfest - April 17th, 2010

'process.py' is a work-in-progress python script that is scoping some potential steps to:

1) ingest json data from caligator
2) pull out individual locations and the # of events per location
3) push the data into a csv + vrt combo that GDAL can read
4) use gdal_grid to interpolate the point zvalues into a heat surface

Potential next steps are to:

1) refine the options passed to gdal_grid to get things looking nicer
2) create a Mapnik XML file to color the grid, and then serve tiles using TileLite
3) refactor code to automate the whole process within a web app/web request
3) turn the VRT file into GeoJSON or something that can be displayed and symbolized on a google map/OpenLayers, because that would likely be just as useful/understandable as a heat map (we chose to play with heat maps for the fun and challenge)
