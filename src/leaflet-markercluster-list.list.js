/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerCluster.List = L.Control.extend({
  options: {
    position: 'topright',
  },

  initialize(group, options) {
    this.group = group;
    L.Control.prototype.initialize.call(this, options);
  },

  onAdd(map) {
    const container = L.DomUtil.create(
      'div',
      'markercluster-list leaflet-bar'
    );

    map.setListContainer(container);

    setTimeout(() => { this.moveContainer(map); }, 100);

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

    const orderedMarkers = markers.sort(this.options.sortFn);

    const rows = orderedMarkers.map((marker, mi) => {
      let rowClass = mi % 2 ? 'cluster-list-row-even' : 'cluster-list-row-odd';
      rowClass += ' cluster-list-row';
      return `<tr class="${rowClass}"><td>${this.options.labelFn(marker, mi, cluster)}</td></tr>`;
    });

    const head = this.options.showHeader ?
      `<div class="cluster-list-header">${this.options.headerFn(markers, cluster)}</div>` : '';

    let html = head;
    html += `<div id="marker-cluster-list-content">`;
    html += `<div class="table-wrapper" style="margin-right: ${this.sidePanelWidth()}px">`;
    html += `<table><tbody>${rows.join('')}</tbody></table>`;
    html += '</div>';
    html += this.sidePanelBuild();
    html += '</div>';

    this.updateContent(html);
    this.sidePanelBindEvent();
  },

  sidePanelBindEvent() {
    if (this.isSidePanel()) {
      const sideButton = document.getElementById('cluster-list-side-panel-button');
      sideButton.addEventListener('click', () => this.handleCloseClick());
    }
  },

  sidePanelBuild() {
    let html = '';
    if (this.isSidePanel()) {
      html += `<div class="cluster-list-side-panel" style="width: ${this.sidePanelWidth()}px">`;
      html += '<button id="cluster-list-side-panel-button" class="cluster-list-side-panel-button" value="x" ></button>';
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

  handleCloseClick() {
    this.group.listCloseButtonClick();
  },

  updateContent(content) {
    this.getContainer().innerHTML = content;
  },

  hide() {
    this.updateContent('');
  }

});

L.markerClusterGroup.list = (group, options) => new L.MarkerCluster.List(group, options);
