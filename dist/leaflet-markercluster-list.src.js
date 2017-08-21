
/* global L:true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerClusterGroup.WithList = L.MarkerClusterGroup.extend({
  options: {
    list: true
  },

  initialize(options) {
    L.MarkerClusterGroup.prototype.initialize.call(this, options);
  },

  onAdd(map) {
    this.list = L.markerClusterGroup.list({});
    this.list.addTo(map);

    L.MarkerClusterGroup.prototype.onAdd.call(this, map);
  },

  refreshList(children) {
    this.list.refreshContent(children);
  }
});

L.markerClusterGroup.withList = function (options) {
  return new L.MarkerClusterGroup.WithList(options);
};

L.MarkerCluster.List = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd(map) {
    const container = L.DomUtil.create('div', 'markercluster-list leaflet-bar');

    const row = L.DomUtil.create('p', 'marker-cluster-list-row', container);
    row.innerHTML = 'ahoj';

    setTimeout(() => {
      this.moveContainer(map);
    }, 100);

    return container;
  },

  moveContainer(map) {
    const mapDom = map.getContainer();
    const controlDom = this.getContainer();
    mapDom.appendChild(controlDom);
  },

  refreshContent(elements) {
    const rows = elements.map((element, ei) => {
      console.log(element);
      return `<tr><td>${ei}</td></tr>`;
    });
    const html = `<table><tbody>${rows.join('')}</tbody></table>`;
    this.getContainer().innerHTML = html;
  }

});

L.markerClusterGroup.list = function (options) {
  return new L.MarkerCluster.List(options);
};

L.MarkerCluster.ListMarker = L.CircleMarker.extend({
  options: {
    id: 0,
    listText: ''
  },

  initialize(latlng, options) {
    this.options.id = options.id;
    this.options.listText = options.listText;
    L.CircleMarker.prototype.initialize.call(this, latlng, options);
  }
});

L.markerClusterGroup.listMarker = function (latlng, options) {
  return new L.MarkerCluster.ListMarker(latlng, options);
};
