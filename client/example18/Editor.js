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
    this.timer = null;
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
        vertices.push(intersected.object.topology.vertex[ids[i]]);
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

    self.timer = window.setInterval(() => {
        viewer.intersects = viewer.raycaster.intersectObjects(viewer.scene.children);
        if (viewer.intersects.length > 0) {
            var intersected = self.viewer.intersects[0];
            var vertices = self.getVertices();
            var nearest = self.getNearest(vertices, self.viewer.intersects[0].point);
            var normal = self.pointNormal(nearest);
            var scalarNormal = normal.multiplyScalar(1.01);

            var geometry = intersected.object.geometry;
            geometry.vertices[nearest.ID].add(scalarNormal);
            nearest.vector3.add(scalarNormal);

            //重新計算面的法向量
            for (var i = 0; i < nearest.faceIDs.length; i++) {
                var id = nearest.faceIDs[i];
                var cb = new THREE.Vector3();
                var ab = new THREE.Vector3();
                var vA = geometry.vertices[geometry.faces[id].a];
                var vB = geometry.vertices[geometry.faces[id].b];
                var vC = geometry.vertices[geometry.faces[id].c];
                cb.subVectors(vC, vB);
                ab.subVectors(vA, vB);
                cb.cross(ab);
                geometry.faces[id].normal.copy(cb.normalize());
            }
            geometry.normalsNeedUpdate = true;
            geometry.verticesNeedUpdate = true;
            geometry.elementsNeedUpdate = true;
        }
    }, 100);
};

Editor.prototype.mouseUp = function (viewer) {
    var self = this;
    if(!self.enable) return;
    window.clearInterval(self.timer);
    self.enable = false;
};

module.exports = Editor;