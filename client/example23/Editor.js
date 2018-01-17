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
    this.selectedMeshs = [];
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

Editor.prototype.clearBox = function () {
    var self = this;
    var i = 0;
    for (i = 0; i < self.viewer.meshs.length; i++) {
        var mesh = self.viewer.meshs[i];
        if (mesh.selectedBox) {
            self.viewer.scene.remove(mesh);
        }
    }
    self.selectedMeshs = [];
};

Editor.prototype.mouseDown = function (viewer) {
    var self = this;
    self.viewer = viewer;
    self.enable = true;

    var intersected = self.viewer.intersects[0];
    var topology = intersected.object.topology;
    var geometry = intersected.object.geometry;
    var isSelectedBox = intersected.object.selectedBox;

    if (isSelectedBox) {
        var i = 0;
        for (i = 0; i < self.selectedMeshs.length;i++) {
            var mesh = self.selectedMeshs[i];
            if (mesh.boxId === intersected.object.id) {
                self.viewer.scene.remove(intersected.object);
                self.selectedMeshs.splice(i, 1);
                break;
            }
        }
    } else {
        geometry.computeBoundingBox();
        var box_x = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        var box_y = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
        var box_z = geometry.boundingBox.max.z - geometry.boundingBox.min.z;
        var boxGeometry = new THREE.BoxGeometry(box_x + 0.1, box_y + 0.1, box_z + 0.1);
        var boxMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true, //單一法向量渲染
            transparent: true,
            opacity: 0.5
        });

        var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.copy(geometry.boundingBox.getCenter());
        boxMesh.selectedBox = true;
        boxMesh.skip = true;
        
        self.viewer.scene.add(boxMesh);
        self.viewer.meshs.push(boxMesh);
        self.selectedMeshs.push({
            meshId: intersected.object.id,
            boxId: boxMesh.id
        });
    }
};

Editor.prototype.mouseUp = function (viewer) {
    var self = this;
    if(!self.enable) return;
    self.enable = false;
};

module.exports = Editor;