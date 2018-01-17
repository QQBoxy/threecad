/**************************************************
 File: CSGBoolean.js
 Name: CSGBoolean
 Explain: CSGBoolean
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
import * as THREE from 'three';
import ThreeBSP from '../common/threeCSG';

var CSGBoolean = function () {
    this.viewer = null;
    this.editor = null;
};

CSGBoolean.prototype.setViewer = function (viewer) {
    var self = this;
    self.viewer = viewer;
};

CSGBoolean.prototype.setEditor = function (editor) {
    var self = this;
    self.editor = editor;
};

CSGBoolean.prototype.getMesh = function (id) {
    var self = this;
    var i = 0;
    for (i = 0; i < self.viewer.meshs.length; i++) {
        var mesh = self.viewer.meshs[i];
        if (mesh.id === id) {
            return mesh;
        }
    }
};

//聯集
CSGBoolean.prototype.union = function () {
    var self = this;
    if (self.editor.selectedMeshs.length === 2) {
        var meshA = self.getMesh(self.editor.selectedMeshs[0].meshId);
        var meshB = self.getMesh(self.editor.selectedMeshs[1].meshId);

        var selectA = new ThreeBSP(meshA.geometry);
        var selectB = new ThreeBSP(meshB.geometry);

        var union_bsp = selectA.union(selectB);
        var newGeometry = union_bsp.toGeometry();

        self.viewer.scene.remove(meshA);
        self.viewer.scene.remove(meshB);

        self.viewer.add(newGeometry);
        self.editor.clearBox();
    } else {
        alert("Please select two object.");
    }
};

//差集
CSGBoolean.prototype.subtract = function () {
    var self = this;
    if (self.editor.selectedMeshs.length === 2) {
        var meshA = self.getMesh(self.editor.selectedMeshs[0].meshId);
        var meshB = self.getMesh(self.editor.selectedMeshs[1].meshId);

        var selectA = new ThreeBSP(meshA.geometry);
        var selectB = new ThreeBSP(meshB.geometry);

        var subtract_bsp = selectA.subtract(selectB);
        var newGeometry = subtract_bsp.toGeometry();

        self.viewer.scene.remove(meshA);
        self.viewer.scene.remove(meshB);

        self.viewer.add(newGeometry);
        self.editor.clearBox();
    } else {
        alert("Please select two object.");
    }
};

//交集
CSGBoolean.prototype.intersect = function () {
    var self = this;
    if (self.editor.selectedMeshs.length === 2) {
        var meshA = self.getMesh(self.editor.selectedMeshs[0].meshId);
        var meshB = self.getMesh(self.editor.selectedMeshs[1].meshId);

        var selectA = new ThreeBSP(meshA.geometry);
        var selectB = new ThreeBSP(meshB.geometry);

        var intersect_bsp = selectA.intersect(selectB);
        var newGeometry = intersect_bsp.toGeometry();

        self.viewer.scene.remove(meshA);
        self.viewer.scene.remove(meshB);

        self.viewer.add(newGeometry);
        self.editor.clearBox();
    } else {
        alert("Please select two object.");
    }
};

module.exports = CSGBoolean;