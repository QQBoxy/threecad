/**************************************************
 File: Editor.js
 Name: Editor
 Explain: Editor
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
import * as THREE from 'three';

var Editor = function (container) {
    this.tool = "";
    this.enable = false;
    this.viewer = null;
    this.selected = new THREE.Vector3();
};

Editor.prototype.setTool = function (tool) {
    var self = this;
    self.tool = tool;
};

Editor.prototype.getVertices = function () {
    var self = this;
    var vertices = [];
    var intersected = self.viewer.intersects[0];
    var ids = [
        intersected.face.a,
        intersected.face.b,
        intersected.face.c
    ];
    var i = 0;
    for(i=0;i<ids.length;i++) {
        //使用拓樸資料
        vertices.push(intersected.object.topology.vertex[ids[i]]);
        //vertices.push(intersected.object.geometry.vertices[ids[i]]);
    }
    return vertices;
};

Editor.prototype.getNearest = function (vertices, point) {
    var self = this;
    var i = 0;
    var temp = Infinity;
    var distance = 0;
    var min = {};
    for (i = 0; i < vertices.length;i++) {
        distance = vertices[i].vector3.distanceTo(point);
        if (distance < temp) {
            temp = distance;
            min = vertices[i];
        }
    }
    return min;
};

Editor.prototype.pointNormal = function (point) {
    var self = this;
    var i = 0;
    var intersected = self.viewer.intersects[0];
    return point.faceIDs.reduce((accumlator, currentValue, currentIndex, array) => {
        var normal = intersected.object.geometry.faces[currentValue].normal;
        return accumlator.add(normal);
    }, new THREE.Vector3()).normalize();
};

Editor.prototype.action = function (viewer) {
    var self = this;
    if(!self.enable) return;
    
};

Editor.prototype.mouseDown = function (viewer) {
    var self = this;
    self.viewer = viewer;
    self.enable = true;

    var intersected = self.viewer.intersects[0];
    if (intersected.object.skip) return;

    var vertices = self.getVertices();
    var nearest = self.getNearest(vertices, self.viewer.intersects[0].point);

    var normal = self.pointNormal(nearest);

    var scalarNormal = normal.multiplyScalar(3);
    var geometry = new THREE.Geometry();
    geometry.vertices.push(nearest.vector3);
    geometry.vertices.push(new THREE.Vector3().copy(nearest.vector3).add(scalarNormal));
    var material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    var line = new THREE.Line(geometry, material);
    line.skip = true;
    self.viewer.scene.add(line);
    self.viewer.meshs.push(line);
};

Editor.prototype.mouseUp = function (viewer) {
    var self = this;
    if(!self.enable) return;
    self.enable = false;
};

module.exports = Editor;