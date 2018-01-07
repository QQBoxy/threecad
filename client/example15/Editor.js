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
        vertices.push(intersected.object.geometry.vertices[ids[i]]);
    }
    return vertices;
};

Editor.prototype.getNearest = function (vertices, point) {
    var i = 0;
    var temp = Infinity;
    var distance = 0;
    var min = {};
    for (i = 0; i < vertices.length;i++) {
        distance = vertices[i].distanceTo(point);
        if (distance < temp) {
            temp = distance;
            min = vertices[i];
        }
    }
    return min;
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
    console.log(nearest);
    
    var geometry = new THREE.SphereBufferGeometry(0.2, 16, 16);
    var material = new THREE.MeshPhongMaterial({
        color: 0x00ff00
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.skip = true;

    mesh.position.copy(nearest);
    self.viewer.scene.add(mesh);
    console.log(mesh);
    self.viewer.meshs.push(mesh);
    
};

Editor.prototype.mouseUp = function (viewer) {
    var self = this;
    if(!self.enable) return;
    self.enable = false;
    
};

module.exports = Editor;