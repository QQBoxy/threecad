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
    this.currentObject = null;
    this.preFace = new THREE.Face3();
    this.preMouse = new THREE.Vector2();
    this.preVertices = [];
};

Editor.prototype.setTool = function (tool) {
    var self = this;
    self.tool = tool;
};

Editor.prototype.action = function () {
    var self = this;
    if(!self.enable) return;

    var distance = self.preMouse.distanceTo(self.viewer.mouse) * 10;

    var geometry = self.currentObject.geometry;
    var topology = self.currentObject.topology;

    var normal = self.preFace.normal;
    var point = [self.preFace.a, self.preFace.b, self.preFace.c];
    
    var vid = 0;
    for (var v = 0; v < point.length; v++) {
        vid = point[v];
        
        var x = self.preVertices[v].x + normal.x * distance;
        var y = self.preVertices[v].y + normal.y * distance;
        var z = self.preVertices[v].z + normal.z * distance;
        
        geometry.vertices[vid] = new THREE.Vector3(x, y, z);
        topology.vertex[vid].vector3 = new THREE.Vector3(x, y, z);
    }
    //更新模型資訊
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
};

Editor.prototype.mouseDown = function (viewer) {
    var self = this;
    var intersected = viewer.intersects[0];
    self.enable = true;
    self.viewer = viewer;
    self.preFace.copy(intersected.face);
    self.currentObject = viewer.meshs.find((mesh) => (intersected.object.id === mesh.id));
    self.preMouse.copy(self.viewer.mouse);

    var point = [self.preFace.a, self.preFace.b, self.preFace.c];
    self.preVertices = [];
    var vid = 0;
    for (var v = 0; v < point.length; v++) {
        vid = point[v];
        var vertex = new THREE.Vector3();
        vertex.copy(self.currentObject.geometry.vertices[vid]);
        self.preVertices.push(vertex);
    }
};

Editor.prototype.mouseUp = function (viewer) {
    var self = this;
    if(!self.enable) return;
    self.enable = false;

    var geometry = self.currentObject.geometry;
    var topology = self.currentObject.topology;
    var point = [self.preFace.a, self.preFace.b, self.preFace.c];

    var faceIDs = [];

    var vid = 0;
    for (var v = 0; v < point.length; v++) {
        vid = point[v];
        faceIDs.push(...topology.vertex[vid].faceIDs);
    }

    //過濾重複的面
    faceIDs = faceIDs.filter(function (face, index, arr) {
        return arr.indexOf(face) === index;
    });

    //重新計算面的法向量
    for (var i = 0; i < faceIDs.length; i++) {
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
    geometry.normalsNeedUpdate = true;
    self.preVertices = [];
};

module.exports = Editor;