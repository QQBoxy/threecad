/**************************************************
 File: Refinement.js
 Name: Refinement
 Explain: Refinement
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
import * as THREE from 'three';

var Refinement = function () {
    this.viewer = null;
};

Refinement.prototype.setViewer = function (viewer) {
    var self = this;
    self.viewer = viewer;
};

Refinement.prototype.computeNormal = function (vA, vB, vC) {
    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();
    cb.subVectors(vC, vB);
    ab.subVectors(vA, vB);
    cb.cross(ab);
    return cb.normalize();
};

Refinement.prototype.midedge = function () {
    var self = this;

    var geometry = self.viewer.meshs[0].geometry;
    var topology = self.viewer.meshs[0].topology;

    var len = topology.edge.length;

    var i = 0;
    for (i = 0; i < len; i++) {
        var edge = topology.edge[i];
        var center = edge.center;
        var vertexIDs = edge.vertexIDs;
        var faceIDs = edge.faceIDs;

        //建立新的邊線中點 D
        var VertexD = topology.create('vertex');
        VertexD.vector3 = center.clone();

        var faceTop = topology.face[faceIDs[0]];
        var faceBottom = topology.face[faceIDs[1]];

        //取得頂點ID
        var vertexIdA = vertexIDs[0];
        var vertexIdB = vertexIDs[1];
        var vertexIdC = faceTop.vertexIDs.find(
            (element, index, array) => (vertexIDs.indexOf(element) === -1)
        );
        var vertexIdD = VertexD.ID;
        var vertexIdE = faceBottom.vertexIDs.find(
            (element, index, array) => (vertexIDs.indexOf(element) === -1)
        );
        
        //舊有的邊線
        var edgeAC = topology.edgeIDWithVertices(vertexIdA, vertexIdC);
        var edgeBC = topology.edgeIDWithVertices(vertexIdB, vertexIdC);
        var edgeAE = topology.edgeIDWithVertices(vertexIdA, vertexIdE);
        var edgeBE = topology.edgeIDWithVertices(vertexIdB, vertexIdE);
        //創造新的邊線
        var edgeAD = topology.create('edge').ID;
        var edgeBD = topology.create('edge').ID;
        var edgeCD = topology.create('edge').ID;
        var edgeED = topology.create('edge').ID;

        //創造新的面
        var faceACD = topology.create('face').ID;
        var faceCBD = topology.create('face').ID;
        var faceAED = topology.create('face').ID;
        var faceEBD = topology.create('face').ID;

        //計算原始網格法向量
        var topNormal = self.computeNormal(
            topology.vertex[faceTop.vertexIDs[0]].vector3,
            topology.vertex[faceTop.vertexIDs[1]].vector3,
            topology.vertex[faceTop.vertexIDs[2]].vector3
        );
        //計算第一個分割面法向量
        var subNormal = self.computeNormal(
            topology.vertex[vertexIdA].vector3,
            topology.vertex[vertexIdC].vector3,
            topology.vertex[vertexIdD].vector3
        );
        
        //Va, Vb, Vc, Eab, Ebc, Eca, F
        if (topNormal.dot(subNormal) === 1) {
            topology.addTriangleData(vertexIdC, vertexIdD, vertexIdA, edgeCD, edgeAD, edgeAC, faceACD);
            topology.addTriangleData(vertexIdA, vertexIdD, vertexIdE, edgeAD, edgeED, edgeAE, faceAED);
            topology.addTriangleData(vertexIdE, vertexIdD, vertexIdB, edgeED, edgeBD, edgeBE, faceEBD);
            topology.addTriangleData(vertexIdB, vertexIdD, vertexIdC, edgeBD, edgeCD, edgeBC, faceCBD);
        } else {
            topology.addTriangleData(vertexIdC, vertexIdA, vertexIdD, edgeAC, edgeAD, edgeCD, faceACD);
            topology.addTriangleData(vertexIdA, vertexIdE, vertexIdD, edgeAE, edgeED, edgeAD, faceAED);
            topology.addTriangleData(vertexIdE, vertexIdB, vertexIdD, edgeBE, edgeBD, edgeED, faceEBD);
            topology.addTriangleData(vertexIdB, vertexIdC, vertexIdD, edgeBC, edgeCD, edgeBD, faceCBD);
        }

        topology.remove(edge);
        topology.remove(faceTop);
        topology.remove(faceBottom);
    }

    var newGeometry = topology.convertToGeometry();
    self.viewer.scene.remove(self.viewer.meshs[0]);
    self.viewer.add(newGeometry);
};

module.exports = Refinement;