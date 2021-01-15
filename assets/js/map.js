require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/SceneLayer",
    "esri/widgets/Slider",
    "esri/layers/MapImageLayer",
    "esri/widgets/LayerList",
    "esri/geometry/SpatialReference",
    "esri/geometry/projection",
    "esri/Camera"
  ], function (
    Map,
    SceneView,
    SceneLayer,
    Slider,
    MapImageLayer,
    LayerList,
    SpatialReference,
    projection,
    Camera
  ) {
    const zeroOne = {
      type: "mesh-3d",
      symbolLayers:[{
        type: 'fill',
        material: {color: "#d4d4ce"}
      }]
    }
    const twoThree = {
      type: "mesh-3d",
      symbolLayers:[{
        type: 'fill',
        material: {color: "#af9995"}
      }]
    }
    const fourFive = {
      type: "mesh-3d",
      symbolLayers:[{
        type: 'fill',
        material: {color: "#895e5c"}
      }]
    }
    const sixSeven = {
      type: "mesh-3d",
      symbolLayers:[{
        type: 'fill',
        material: {color: "#642323"}
      }]
    }
    //define renderer
    const renderer = {
      type: "class-breaks",  // autocasts as new UniqueValueRenderer()
      field: "tot_rec",
      legendOptions: {
        title:"Recommended Retrofittings",
        showLegend: false
      },
      
      classBreakInfos: [{
        minValue: 0,
        maxValue: 1,
        symbol: zeroOne
      },{
        minValue: 2,
        maxValue: 3,
        symbol: twoThree
      },{
        minValue: 4,
        maxValue: 5,
        symbol: fourFive
      },{
        minValue: 6,
        maxValue: 7,
        symbol: sixSeven
      }
      ],visualVariables: [
        
        {
          type: 'color',
          field: 'total_site_energy_kbtu',
          stops:[
            {
              value: 0, 
              color:[212,212,206,0.9]
            },
            {
              value: 50000000, 
              color:[255, 212, 0, 0.9]
            }
          ], legendOptions: {
            showLegend: false,
            title: "Total Energy Consumption/Year, in kBTU"

          }
        }

      ]
      
    };
    const zips = ['Default Extent',
          '02132-WEST ROXBURY',
          '02128-EAST BOSTON',
          '02136-HYDE PARK',
          '02130-JAMAICA PLAIN',
          '02131-ROSLINDALE',
          '02124-DORCHESTER CENTER',
          '02125-DORCHESTER',
          '02122-DORCHESTER',
          '02121-DORCHESTER',
          '02119-ROXBURY',
          '02127-SOUTH BOSTON',
          '02135-BRIGHTON',
          '02114-BOSTON',
          '02111-BOSTON',
          '02110-BOSTON',
          '02108-BOSTON',
          '02109-BOSTON',
          '02163-BOSTON',
          '02113-BOSTON',
          '02118-BOSTON',
          '02210-BOSTON',
          '02116-BOSTON',
          '02115-BOSTON',
          '02215-BOSTON',
          '02129-CHARLESTOWN',
          '02134-ALLSTON',
          '02126-MATTAPAN',
          '02120-ROXBURY CROSSING',
          '02467-CHESTNUT HILL'];

          const zipCodeSelect = document.getElementById('zip-code');

          for (i=0; i<zips.length; i++){
            var option = document.createElement("option");
            option.text = zips[i];
            zipCodeSelect.add(option)
          };



        const mapLayer = new MapImageLayer({
          url: "https://gisprpxy.itd.state.ma.us/arcgisserver/rest/services/AGOL/ZIP_Codes_NT/MapServer",
          sublayers: [
            {
              id: 0,
              visible: true,
              definitionExpression: "COUNTY = 'SUFFOLK'",
              renderer: {
                type: 'simple',
                symbol : {
                type: 'simple-fill',
                size: 5,
                color: [ 0, 0, 0, 0 ],
                outline: {
                  width: 3,
                  color:'#fda50f'
          }
          }
        }
        }
      ]
    });

    //define layer
      const layer = new SceneLayer({
        url:
        "https://tiles.arcgis.com/tiles/0MSEUqKaxRlEPj5g/arcgis/rest/services/Boston_Buildings_with_Parcel_Level_Energy_Data_WSL1/SceneServer",
        renderer: renderer,  
        outfields: ['use_class','tot_rec', 'yr_built', 'pid'],
          popupTemplate: {
            // autocasts as new PopupTemplate()
            title: "Parcel ID: {pid}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "yr_built",
                    label: "Year built:"
                  },
                  
                  {
                    fieldName: "use_class",
                    label: "Parcel type:"
                  },
                  {
                    fieldName: "tot_rec",
                    label: "Total number of retrofit recommendations:"
                  },
                  {
                    fieldName: "total_site_energy_kbtu",
                    label: "Total energy per year by kBTU:"
                  }
                ]
              }
            ]
          }
        });

        

      //define slider
      const yearSlider = new Slider({
        container: "year",
        min: 1800,
        max: 2020,
        steps: 5,
        values: [1800, 2020],
        draggableSegmentsEnabled: false,
        visibleElements: {
          labels: true,
          rangeLabels: true
        }
      });

      layer.definitionExpression = `yr_built >= ${yearSlider.values[0]} AND yr_built < ${yearSlider.values[1]}`;

      yearSlider.on("thumb-drag", function (event) {
        if (event.state ==='stop') {
          layer.definitionExpression = `yr_built >= ${yearSlider.values[0]} AND yr_built < ${yearSlider.values[1]}`;
          }
        });


      const map = new Map({
	      basemap: "topo",
	      ground: "world-elevation",
        layers: [mapLayer, layer]
      });
      const defaultCam = new Camera({
        position: {
          x: -71.11,
          y: 42.38,
          z: 929,
          spatialReference: {
            wkid: 4326
          }
        },
        heading: 130,
        tilt: 75
      })
  
      const view = new SceneView({
        container: "viewDiv3",
        map: map,
        zoom: 15,
        camera: defaultCam
          });

          const layerlist = new LayerList({
            view: view,
            container: 'infoDiv'
          });

         /*
            new Legend({
              view: view,
              container: 'infoDiv',
              layerInfos:[{
                layer: layer,
                title: 'Boston Buildings by Retrofit Recommendations'
              }]
            });*/
          view.ui.add('infoDiv', 'top-right');
          
          const outSpatialReference = new SpatialReference({
            wkid: 4326
          });

          const cities = mapLayer.findSublayerById(0);

          function setMapDefinitionExpression (event) {
            var zipCode = event.target.value;
            if (zipCode=='Default Extent') {
              cities.definitionExpression = "COUNTY = 'SUFFOLK'";
              view.camera=defaultCam;
            } else {
            cities.definitionExpression = `POSTCODE = '${zipCode.split('-')[0]}'`;
            return cities.createFeatureLayer()
            .then(function (featLayer){
              var query = featLayer.createQuery();
              query.where = cities.definitionExpression;
              var features = featLayer.queryFeatures(query);
              return features;
            })
            .then(function (response) {
              var features = response.features;
              console.log(features[0]);
              projection.load().then(function () {
                features[0].geometry = projection.project(
                  features[0].geometry,
                  outSpatialReference
                )
                view.goTo({
                  target: features[0].geometry.centroid
                });
              });
            })
          }
        }
          zipCodeSelect.addEventListener("change", setMapDefinitionExpression);
 
        });

$(function (){
  $infoDiv = $('#infoDiv');
  $widgetButton = $('#widgetButton');
  $widgetButton.on('click', function(){
    $infoDiv.fadeToggle('slow', function(){
    if ($infoDiv.is(':visible')){
    $widgetButton.text(function() {
      return 'Hide Widget Pane';
    });
   } else{
    $widgetButton.text(function() {
      return 'Show Widget Pane';
   });
  };
});
});
});

