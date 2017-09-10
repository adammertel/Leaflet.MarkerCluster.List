/* global L:true, document: true */
/* eslint no-underscore-dangle: 0 */

'use strict';

L.MarkerCluster.List = L.Control.extend({
  options: {
    position: 'topright',
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

    const orderedMarkers = markers.sort( this.options.sortFn )

    const rows = orderedMarkers.map((marker, mi) => {
      let rowClass = mi % 2 ? 'cluster-list-row-even' : 'cluster-list-row-odd';
      rowClass += ' cluster-list-row';
      return `<tr class="${rowClass}"><td>${this.options.labelFn(marker, mi, cluster)}</td></tr>`;
    });

    const head = this.options.showHeader ?
      `<div class="cluster-list-header">${this.options.headerFn(markers, cluster)}</div>` : '';

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
  },

});

L.markerClusterGroup.list = function (options) {
  return new L.MarkerCluster.List(options);
};
