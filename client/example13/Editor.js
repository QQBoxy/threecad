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
    var faceIDs = [];

    var vid = 0;
    for (var v = 0; v < point.length; v++) {
        vid = point[v];
        var x = geometry.vertices[vid].x + normal.x * 2;
        var y = geometry.vertices[vid].y + normal.y * 2;
        var z = geometry.vertices[vid].z + normal.z * 2;
        geometry.vertices[vid] = new THREE.Vector3(x, y, z);
        topology.vertex[vid].vector3 = new THREE.Vector3(x, y, z);

        //有變動過的面
        faceIDs.push(...topology.vertex[vid].faceIDs);
    }

    //過濾重複的面
    faceIDs = faceIDs.filter(function (face, index, arr) {
        return arr.indexOf(face) === index;
    });

    //重新計算面的法向量
    for (var i = 0; i < faceIDs.length;i++) {
        var id = faceIDs[i];
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

    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
};

module.exports = Editor;