
/* global L:true */
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
  },

  unspiderfy() {
    const childMarkers = this.getAllChildMarkers();
    const group = this._group;

    group.fire('unspiderfied', {
      cluster: this,
      markers: childMarkers
    });
  }

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

L.MarkerClusterGroup.WithList = L.MarkerClusterGroup.extend({
  options: {
    labelFn: e => e.options.id
  },

  initialize(options) {
    L.MarkerClusterGroup.prototype.initialize.call(this, options);
  },

  onAdd(map) {
    this.list = L.markerClusterGroup.list(this.options);
    this.list.addTo(map);

    this.on('spiderfied', data => {
      console.log('spiderfied');
      this.refreshList(data.markers);
    });

    this.on('unspiderfied', data => {
      console.log('unspiderfied');
      this.hideList();
      // a.layer is actually a cluster
      //console.log('cluster ' + a.layer.getAllChildMarkers().length);
    });

    L.MarkerClusterGroup.prototype.onAdd.call(this, map);
  },

  refreshList(children) {
    this.list.show(children);
  },

  hideList() {
    this.list.hide();
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

    map.setListContainer(container);

    setTimeout(() => {
      this.moveContainer(map);
    }, 100);

    return container;
  },

  moveContainer(map) {
    const mapDom = map.getContainer().parentElement;
    const controlDom = this.getContainer();

    mapDom.appendChild(controlDom);
    L.DomUtil.toFront(controlDom);
  },

  show(elements) {
    const rows = elements.map((element, ei) => {
      let rowClass = ei % 2 ? 'cluster-list-row-even' : 'cluster-list-row-odd';
      rowClass += ' cluster-list-row';
      return `<tr class="${rowClass}"><td>${this.options.labelFn(element)}</td></tr>`;
    });

    const thead = this.options.header ? `<thead><tr><th>${this.options.header}</th></tr></thead>` : '';

    const html = `<table><tbody>${thead}${rows.join('')}</tbody></table>`;

    this.updateContent(html);
  },

  updateContent(content) {
    this.getContainer().innerHTML = content;
  },

  hide() {
    this.updateContent('');
  }

});

L.markerClusterGroup.list = function (options) {
  return new L.MarkerCluster.List(options);
};

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
  }
});

L.markerClusterGroup.listMarker = function (latlng, options) {
  return new L.MarkerCluster.ListMarker(latlng, options);
};
