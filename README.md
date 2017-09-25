# Leaflet.MarkerCluster.List
**subplugin for the [Leaflet.MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster) to display clustered child elements in the list**

![sample image](assets/img1.png "sample image")

### Options
 * **labelFn** (fn (element, element index, cluster) ) - function to handle how to display each element in the list
    ```
    (el, ei, cluster) => {
      return '<p onclick="clickAction(' + el.options.id + ')">[' + ei + '] ' + el.options.listText + '</p>';
    }
  ```

 * **headerFn** (fn (elements, cluster) ) - function to handle header
    ```
    (els, cluster) => '<p>showing cluster with ' + els.length + ' elements</p>'
    ```

 * **sortFn** (fn (marker1, marker2) ) - implementation of markers sorting in list (see e.g. [mozilla docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) )
    ```
    (m1, m2) => m1.options.id > m2.options.id ? 1 : -1
    ```

 * **showHeader** (bool, default false) - whether to display header
 * **sidePanel** (bool, default false) - whether to show side panel with close button
 * **sidePanelWidth** (number, default 50) - width of side panel in px 
 * **centerOnChange** (bool, default false) - whether to pan map to active cluster after spiderfied event 
 * **list** (bool, default true) - whether to apply this list rule or not 


### Notes:
 - suitable for mobile devices where display is too small to spiderfy clustered child elements on map


### Author:
 - Adam Mertel | UNIVIE


### Demo:
 * [random data demo](https://adammertel.github.io/Leaflet.MarkerCluster.List/demo/demo1.html)
 * [combined with markercluster.placementStrategies](https://adammertel.github.io/Leaflet.MarkerCluster.List/demo/demo2.html)
