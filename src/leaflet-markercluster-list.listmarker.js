/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerCluster.ListMarker = L.CircleMarker.extend({
  options: {
    fillColor: 'blue',
    radius: 8,
    fill: true,
    stroke: true,
    color: 'grey',
    weight: 2.5,
    opacity: 0.7,
    fillOpacity: 1,
    className: 'markercluster-list-marker'
  },

  initialize(latlng, options) {
    L.Util.setOptions(this, options);
    L.CircleMarker.prototype.initialize.call(this, latlng, options);
  },
});

L.markerClusterGroup.listMarker = function (latlng, options) {
  return new L.MarkerCluster.ListMarker(latlng, options);
};
