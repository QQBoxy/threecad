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
    this.selectedIDs = [];
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

Editor.prototype.circleSelect = function (point, radius, selectedIDs) {
    var self = this;
    var intersected = self.viewer.intersects[0];
    var topology = intersected.object.topology;
    if(!selectedIDs) selectedIDs = [];
    selectedIDs.push(point.ID);
    var i = 0;
    var j = 0;
    var edgeIDs = point.edgeIDs;
    for(i=0;i<edgeIDs.length;i++) {
        var edgeID = edgeIDs[i];
        var edge = topology.edge[edgeID];
        var vertexIDs = edge.vertexIDs;
        for(j=0;j<vertexIDs.length;j++) {
            var vertexID = vertexIDs[j];
            if(selectedIDs.indexOf(vertexID) === -1) {
                var vector = topology.vertex[vertexID];
                var distance = intersected.point.distanceTo(vector.vector3);
                if(distance < radius) {
                    self.circleSelect(vector, radius, selectedIDs);
                }
            }
        }
    }
    return selectedIDs;
};

Editor.prototype.smoothstep = function (x) {
    // 3x^2 - 2x^3
    if (x <= 0) {
        return 0;
    } else if (x > 0 && x < 1) {
        return 3 * (x * x) - 2 * (x * x * x);
    } else if (x >= 1) {
        return 1;
    }
};

Editor.prototype.action = function (viewer) {
    var self = this;
    if(!self.enable) return;

};

Editor.prototype.mouseDown = function (viewer) {
    var self = this;
    self.viewer = viewer;
    self.enable = true;

    var radius = 3;
    var intensity = 1.5;

    var intersected = self.viewer.intersects[0];
    if (intersected.object.skip) return;
    var topology = intersected.object.topology;
    var geometry = intersected.object.geometry;
    
    var vertices = self.getVertices();
    var nearest = self.getNearest(vertices, intersected.point);
    var normal = self.pointNormal(nearest);
    var selectedIDs = self.circleSelect(nearest, radius);

    var i = 0;
    var j = 0;
    for(i=0;i<selectedIDs.length;i++) {
        var selectedID = selectedIDs[i];
        var selected = topology.vertex[selectedID];

        var distance = intersected.point.distanceTo(selected.vector3);
        var normalize = 1 - (distance / radius); // 0 ~ 1

        var solution = self.smoothstep(normalize);
        var newVector = normal.clone().multiplyScalar(solution).multiplyScalar(intensity);
        selected.vector3.add(newVector);
        geometry.vertices[selected.ID].copy(selected.vector3);

        for (j = 0; j < selected.faceIDs.length; j++) {
            var id = selected.faceIDs[j];
            var cb = new THREE.Vector3();
            var ab = new THREE.Vector3();
            var vA = topology.vertex[topology.face[id].vertexIDs[0]].vector3;
            var vB = topology.vertex[topology.face[id].vertexIDs[1]].vector3;
            var vC = topology.vertex[topology.face[id].vertexIDs[2]].vector3;
            cb.subVectors(vC, vB);
            ab.subVectors(vA, vB);
            cb.cross(ab);
            geometry.faces[id].normal.copy(cb.normalize());
        }

        //修正中心點位置
        topology.computeCenter(selected.ID);
    }
    geometry.normalsNeedUpdate = true;
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
};

Editor.prototype.mouseUp = function (viewer) {
    var self = this;
    if(!self.enable) return;
    self.enable = false;
};

module.exports = Editor;