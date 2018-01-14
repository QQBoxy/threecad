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
    var vertexIdA = 0;
    var vertexIdB = 0;
    var vertexIdC = 0;
    var vertexIdD = 0;
    var vertexIdE = 0;
    var faceTop = null;
    var faceBottom = null;

    var edgeAC = 0;
    var edgeBC = 0;
    var edgeAE = 0;
    var edgeBE = 0;
    var edgeAD = 0;
    var edgeBD = 0;
    var edgeCD = 0;
    var edgeDE = 0;

    var faceACD = 0;
    var faceCBD = 0;
    var faceAED = 0;
    var faceEBD = 0;

    var geometry = self.viewer.meshs[0].geometry;
    var topology = self.viewer.meshs[0].topology;

    console.log(self.viewer.meshs[0]);

    var len = topology.edge.length;

    var i = 0;
    for (i = 0; i < len; i++) {
        var edge = topology.edge[i];
        var center = edge.center;
        var vertexIDs = edge.vertexIDs;
        var faceIDs = edge.faceIDs;

        //判斷邊線是否為封閉
        var isClosed = (faceIDs.length > 1);

        //建立新的邊線中點 D
        var VertexD = topology.create('vertex');
        VertexD.vector3 = center.clone();VertexD.vector3 = center.clone();

        faceTop = topology.face[faceIDs[0]];
        if (isClosed) {
            faceBottom = topology.face[faceIDs[1]];
        }

        //取得頂點ID
        vertexIdA = vertexIDs[0];
        vertexIdB = vertexIDs[1];
        vertexIdC = faceTop.vertexIDs.find(
            (element, index, array) => (vertexIDs.indexOf(element) === -1)
        );
        vertexIdD = VertexD.ID;
        if (isClosed) {
            vertexIdE = faceBottom.vertexIDs.find(
                (element, index, array) => (vertexIDs.indexOf(element) === -1)
            );
        }

        //舊有的邊線
        edgeAC = topology.edgeIDWithVertices(vertexIdC, vertexIdA);
        edgeBC = topology.edgeIDWithVertices(vertexIdB, vertexIdC);
        if (isClosed) {
            edgeAE = topology.edgeIDWithVertices(vertexIdA, vertexIdE);
            edgeBE = topology.edgeIDWithVertices(vertexIdE, vertexIdB);
        }

        //創造新的邊線
        edgeAD = topology.create('edge').ID;
        edgeBD = topology.create('edge').ID;
        edgeCD = topology.create('edge').ID;
        if (isClosed) {
            edgeDE = topology.create('edge').ID;
        }

        //創造新的面
        faceACD = topology.create('face').ID;
        faceCBD = topology.create('face').ID;
        if (isClosed) {
            faceAED = topology.create('face').ID;
            faceEBD = topology.create('face').ID;
        }

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
        if (topNormal.dot(subNormal) >= 0) {
            topology.addTriangleData(vertexIdC, vertexIdD, vertexIdA, edgeCD, edgeAD, edgeAC, faceACD);
            if (isClosed) {
                topology.addTriangleData(vertexIdA, vertexIdD, vertexIdE, edgeAD, edgeDE, edgeAE, faceAED);
                topology.addTriangleData(vertexIdE, vertexIdD, vertexIdB, edgeDE, edgeBD, edgeBE, faceEBD);
            }
            topology.addTriangleData(vertexIdB, vertexIdD, vertexIdC, edgeBD, edgeCD, edgeBC, faceCBD);
        } else {
            topology.addTriangleData(vertexIdC, vertexIdA, vertexIdD, edgeAC, edgeAD, edgeCD, faceACD);
            if (isClosed) {
                topology.addTriangleData(vertexIdA, vertexIdE, vertexIdD, edgeAE, edgeDE, edgeAD, faceAED);
                topology.addTriangleData(vertexIdE, vertexIdB, vertexIdD, edgeBE, edgeBD, edgeDE, faceEBD);
            }
            topology.addTriangleData(vertexIdB, vertexIdC, vertexIdD, edgeBC, edgeCD, edgeBD, faceCBD);
        }

        topology.remove(edge);
        topology.remove(faceTop);
        if (isClosed) {
            topology.remove(faceBottom);
        }
    }

    var newGeometry = topology.convertToGeometry();

    self.viewer.scene.remove(self.viewer.meshs[0]);
    self.viewer.meshs.shift();
    self.viewer.add(newGeometry);
};

module.exports = Refinement;