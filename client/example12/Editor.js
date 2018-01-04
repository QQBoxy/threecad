/**************************************************
 File: Editor.js
 Name: Editor
 Explain: Editor
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
import * as THREE from 'three';

var Editor = function (container) {
    
};

Editor.prototype.mouseDown = function (viewer) {
    var self = this;
    var intersected = viewer.intersects[0];
    var geometry = intersected.object.geometry;
    var topology = intersected.object.topology;

    var normal = intersected.face.normal;
    var face = geometry.faces[intersected.faceIndex];
    var point = [face.a, face.b, face.c];

    for (var v = 0; v < point.length; v++) {
        var vid = point[v];
        var x = geometry.vertices[vid].x + normal.x * 2;
        var y = geometry.vertices[vid].y + normal.y * 2;
        var z = geometry.vertices[vid].z + normal.z * 2;
        geometry.vertices[vid] = new THREE.Vector3(x, y, z);
        topology.vertex[vid].vector3 = new THREE.Vector3(x, y, z);
    }
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
};

module.exports = Editor;