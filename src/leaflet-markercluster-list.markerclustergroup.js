/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerClusterGroup.WithList = L.MarkerClusterGroup.extend({
  options: {
    labelFn: (...args) => '...',
    headerFn: (...args) => '',
    sortFn: (...args) => 1,
    showHeader: false,
    sidePanel: false,
    sidePanelWidth: 50,
    list: true
  },

  initialize(options) {
    L.MarkerClusterGroup.prototype.initialize.call(this, options);
  },

  onAdd(map) {
    this.list = L.markerClusterGroup.list(this, this.options);
    this.list.addTo(map);

    this.on('spiderfied', (data) => {
      // console.log('*****on spiderfied*******')
      this.refreshList(data);
    });

    this.on('unspiderfied', (data) => {
      // console.log('*****on unspiderfied*******')
      this.hideList();
    });

    L.MarkerClusterGroup.prototype.onAdd.call(this, map);
  },
  
  refreshList(data) {
    this.options.list ? this.list.show(data) : null;
  },
  
  hideList() {
    if (this.list) {
      this.list.hide();
    }
  },

  listCloseButtonClick() {    
    this._spiderfied.unspiderfy();
  },
  
  clearLayers() {
    this.hideList();    
    L.MarkerClusterGroup.prototype.clearLayers.call(this);
  },

  unassignSelectedClass() {
    document.querySelectorAll('div.marker-cluster-selected').forEach((mc) => {
      mc.classList.remove('marker-cluster-selected');
    });
  }
});

L.markerClusterGroup.withList = function (options) {
  return new L.MarkerClusterGroup.WithList(options);
};
