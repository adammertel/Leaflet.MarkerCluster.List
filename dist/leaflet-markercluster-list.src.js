/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

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

  show(data) {
    const markers = data.markers;
    const cluster = data.cluster;

    const rows = markers.map((marker, mi) => {
      let rowClass = mi % 2 ? 'cluster-list-row-even' : 'cluster-list-row-odd';
      rowClass += ' cluster-list-row';
      return `<tr class="${rowClass}"><td>${this.options.labelFn(marker, mi, cluster)}</td></tr>`;
    });

    const head = this.options.showHeader ? `<div class="cluster-list-header">${this.options.headerFn(markers, cluster)}</div>` : '';

    let html = head;
    html += `<div class="table-wrapper" style="margin-right: ${this.sidePanelWidth()}">`;
    html += `<table><tbody>${rows.join('')}</tbody></table>`;
    html += '</div>';
    html += this.sidePanelBuild();

    this.updateContent(html);
    this.sidePanelBideEvent();
  },

  sidePanelBideEvent() {
    if (this.isSidePanel()) {
      const sideButton = document.querySelectorAll('.cluster-list-side-panel button')[0];
      sideButton.addEventListener('click', e => this.hide());
    }
  },

  sidePanelBuild() {
    let html = '';
    if (this.isSidePanel()) {
      html += `<div class="cluster-list-side-panel" style="width: ${this.sidePanelWidth()}">`;
      html += '<button onmouseclick="this.hide()" class="cluster-list-side-panel-button" value="x" > </button>';
      html += '</div>';
    }
    return html;
  },

  isSidePanel() {
    return this.options.sidePanel;
  },

  sidePanelWidth() {
    return this.isSidePanel() ? this.options.sidePanelWidth : 0;
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
  }
});

L.markerClusterGroup.listMarker = function (latlng, options) {
  return new L.MarkerCluster.ListMarker(latlng, options);
};
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
/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerClusterGroup.WithList = L.MarkerClusterGroup.extend({
  options: {
    labelFn: (...args) => '...',
    headerFn: (...args) => '',
    showHeader: false,
    sidePanel: false,
    sidePanelWidth: 50,
    list: true
  },

  initialize(options) {
    L.MarkerClusterGroup.prototype.initialize.call(this, options);
  },

  onAdd(map) {
    this.list = L.markerClusterGroup.list(this.options);
    this.list.addTo(map);

    this.on('spiderfied', data => {
      this.refreshList(data);
    });

    this.on('unspiderfied', data => {
      this.hideList();
    });

    L.MarkerClusterGroup.prototype.onAdd.call(this, map);
  },

  refreshList(data) {
    this.options.list ? this.list.show(data) : null;
  },

  hideList() {
    this.options.list ? this.list.hide() : null;
  },

  unassignSelectedClass() {
    document.querySelectorAll('div.marker-cluster-selected').forEach(mc => {
      mc.classList.remove('marker-cluster-selected');
    });
  }
});

L.markerClusterGroup.withList = function (options) {
  return new L.MarkerClusterGroup.WithList(options);
};
