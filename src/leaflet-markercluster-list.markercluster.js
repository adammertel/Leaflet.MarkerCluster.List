/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerCluster.include({
  _spiderfy: L.MarkerCluster.prototype.spiderfy,

  spiderfy() {
    const childMarkers = this.getAllChildMarkers();
    const group = this._group;

    group.fire('spiderfied', {
      cluster: this,
      markers: childMarkers
    });

    this._map.on('click', this.unspiderfy, this);
    group.unassignSelectedClass();
    this.assignSelectedClass();
  },

  unspiderfy() {
    const childMarkers = this.getAllChildMarkers();
    const group = this._group;

    group.fire('unspiderfied', {
      cluster: this,
      markers: childMarkers
    });

    group.unassignSelectedClass();
  },

  assignSelectedClass() {
    this._icon.classList.add('marker-cluster-selected');
  },

});

L.Map = L.Map.include({
  _remove: L.Map.prototype.remove,

  setListContainer(container) {
    this.listContainer = container;
  },

  remove() {
    this.listContainer.remove();
    this._remove();
  }
});
