/*
  leaflet control list plugin
  https://github.com/adammertel/Leaflet.Control.List
  Adam Mertel | univie
*/
/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerCluster.List = L.Control.extend({
  options: {
    position: 'topright'
  },
  initialize: function initialize(group, options) {
    this.group = group;
    L.Control.prototype.initialize.call(this, options);
  },
  onAdd: function onAdd(map) {
    var _this = this;
    var container = L.DomUtil.create('div', 'markercluster-list leaflet-bar');
    map.setListContainer(container);
    setTimeout(function () {
      _this.moveContainer(map);
    }, 100);
    return container;
  },
  moveContainer: function moveContainer(map) {
    var mapDom = map.getContainer().parentElement;
    var controlDom = this.getContainer();
    mapDom.appendChild(controlDom);
    L.DomUtil.toFront(controlDom);
  },
  show: function show(data) {
    var _this2 = this;
    var markers = data.markers;
    var cluster = data.cluster;
    var orderedMarkers = markers.sort(this.options.sortFn);
    var rows = orderedMarkers.map(function (marker, mi) {
      var rowClass = mi % 2 ? 'cluster-list-row-even' : 'cluster-list-row-odd';
      rowClass += ' cluster-list-row';
      return "<tr class=\"" + rowClass + "\"><td>" + _this2.options.labelFn(marker, mi, cluster) + "</td></tr>";
    });
    var head = this.options.showHeader ? "<div class=\"cluster-list-header\">" + this.options.headerFn(markers, cluster) + "</div>" : '';
    var html = head;
    html += '<div id="marker-cluster-list-content">';
    html += "<div class=\"table-wrapper\" style=\"margin-right: " + this.sidePanelWidth() + "px\">";
    html += "<table><tbody>" + rows.join('') + "</tbody></table>";
    html += '</div>';
    html += this.sidePanelBuild();
    html += '</div>';
    this.updateContent(html);
    this.sidePanelBindEvent();
  },
  sidePanelBindEvent: function sidePanelBindEvent() {
    var _this3 = this;
    if (this.isSidePanel()) {
      var sideButton = document.getElementById('cluster-list-side-panel-button');
      sideButton.addEventListener('click', function () {
        return _this3.handleCloseClick();
      });
    }
  },
  sidePanelBuild: function sidePanelBuild() {
    var html = '';
    if (this.isSidePanel()) {
      html += "<div class=\"cluster-list-side-panel\" style=\"width: " + this.sidePanelWidth() + "px\">";
      html += '<button id="cluster-list-side-panel-button" class="cluster-list-side-panel-button" value="x" ></button>';
      html += '</div>';
    }
    return html;
  },
  isSidePanel: function isSidePanel() {
    return this.options.sidePanel;
  },
  sidePanelWidth: function sidePanelWidth() {
    return this.isSidePanel() ? this.options.sidePanelWidth : 0;
  },
  handleCloseClick: function handleCloseClick() {
    this.group.listCloseButtonClick();
  },
  updateContent: function updateContent(content) {
    this.getContainer().innerHTML = content;
  },
  hide: function hide() {
    this.updateContent('');
  }
});
L.markerClusterGroup.list = function (group, options) {
  return new L.MarkerCluster.List(group, options);
};
/* global L:true */
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
  initialize: function initialize(latlng, options) {
    L.Util.setOptions(this, options);
    L.CircleMarker.prototype.initialize.call(this, latlng, options);
  }
});
L.markerClusterGroup.listMarker = function (latlng, options) {
  return new L.MarkerCluster.ListMarker(latlng, options);
};
/* global L:true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerCluster.include({
  _spiderfy: L.MarkerCluster.prototype.spiderfy,
  _unspiderfy: L.MarkerCluster.prototype.unspiderfy,
  spiderfy: function spiderfy() {
    var group = this._group;
    if (group.options.list) {
      var childMarkers = this.getAllChildMarkers();
      group._spiderfied = this;
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
  unspiderfy: function unspiderfy() {
    var group = this._group;
    group.unassignSelectedClass();
    if (group.options.list) {
      var childMarkers = this.getAllChildMarkers();
      group._spiderfied = this;
      group.fire('unspiderfied', {
        cluster: this,
        markers: childMarkers
      });
    } else {
      this._unspiderfy();
    }
  },
  assignSelectedClass: function assignSelectedClass() {
    this._icon.classList.add('marker-cluster-selected');
  }
});
L.Map = L.Map.include({
  _remove: L.Map.prototype.remove,
  setListContainer: function setListContainer(container) {
    this.listContainer = container;
  },
  remove: function remove() {
    this.listContainer.remove();
    this._remove();
  }
});
/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerClusterGroup.WithList = L.MarkerClusterGroup.extend({
  options: {
    labelFn: function labelFn() {
      return '...';
    },
    headerFn: function headerFn() {
      return '';
    },
    sortFn: function sortFn() {
      return 1;
    },
    showHeader: false,
    sidePanel: false,
    sidePanelWidth: 50,
    list: true,
    centerOnChange: false
  },
  initialize: function initialize(options) {
    L.MarkerClusterGroup.prototype.initialize.call(this, options);
  },
  onAdd: function onAdd(map) {
    var _this = this;
    this.list = L.markerClusterGroup.list(this, this.options);
    this.list.addTo(map);
    this.on('spiderfied', function (data) {
      if (_this.options.centerOnChange) {
        map.panTo(data.cluster.getLatLng());
      }
      // console.log('*****on spiderfied*******')
      _this.refreshList(data);
    });
    this.on('unspiderfied', function () {
      // console.log('*****on unspiderfied*******')
      _this.hideList();
    });
    L.MarkerClusterGroup.prototype.onAdd.call(this, map);
  },
  refreshList: function refreshList(data) {
    if (this.options.list) {
      this.list.show(data);
    }
  },
  hideList: function hideList() {
    if (this.options.list === true) {
      this.list.hide();
    }
  },
  listCloseButtonClick: function listCloseButtonClick() {
    // this.hideList();
    this._spiderfied.unspiderfy();
  },
  clearLayers: function clearLayers() {
    this.hideList();
    L.MarkerClusterGroup.prototype.clearLayers.call(this);
  },
  unassignSelectedClass: function unassignSelectedClass() {
    var selectedClusterElements = document.getElementsByClassName('marker-cluster-selected');
    var selectedClusterArray = [];
    for (var i = 0; i < selectedClusterElements.length; i++) {
      selectedClusterArray.push(selectedClusterElements[i]);
    }
    ;
    selectedClusterArray.map(function (mc) {
      console.log(mc);
      mc.classList.remove('marker-cluster-selected');
    });
  }
});
L.markerClusterGroup.withList = function (options) {
  return new L.MarkerClusterGroup.WithList(options);
};
