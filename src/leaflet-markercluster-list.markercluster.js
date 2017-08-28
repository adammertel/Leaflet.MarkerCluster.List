/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerCluster.include({
  _spiderfy: L.MarkerCluster.prototype.spiderfy,
  _unspiderfy: L.MarkerCluster.prototype.unspiderfy,

  spiderfy() {
    if (this.options.list) {
      const childMarkers = this.getAllChildMarkers();
      const group = this._group;
      group.fire('spiderfied', {
        cluster: this,
        markers: childMarkers
      });
      
      this._map.on('click', this.unspiderfy, this);
      group.unassignSelectedClass();
      this.assignSelectedClass();
    } else {
      this._spiderfy();
    }
  },
  
  unspiderfy() {
    if (this.options.list) {
      const childMarkers = this.getAllChildMarkers();
      const group = this._group;
      
      group.fire('unspiderfied', {
        cluster: this,
        markers: childMarkers
      });
      
      group.unassignSelectedClass();
    } else {
      this._unspiderfy();
    }
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
