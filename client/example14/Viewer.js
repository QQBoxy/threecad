/**************************************************
 File: Viewer.js
 Name: Viewer
 Explain: Viewer
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import TOPOLOGY from '../common/topology';
import QixColor from 'color';

var Viewer = function (container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.light = null;
    this.cameraFov = 60;
    this.meshs = [];
    this.controls = null;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.intersects = [];
    this.intersected = null;
    this.mouseDownAction = {};
    this.mouseUpAction = {};
    this.action = () => {};
};

Viewer.prototype.init = function () {
    var self = this;

    //場景設定
    self.scene = new THREE.Scene();
    //相機設定
    self.camera = new THREE.PerspectiveCamera(self.cameraFov, window.innerWidth / window.innerHeight, 0.1, 1000);

    //渲染器設定
    self.renderer = new THREE.WebGLRenderer();
    self.renderer.setSize(window.innerWidth, window.innerHeight);
    self.container.appendChild(self.renderer.domElement);

    //控制設定
    self.control();

    //光源設定
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    self.scene.add(ambientLight); //加入環境光源

    var pointLight = new THREE.PointLight(0xffffff, 0.8, 0);
    pointLight.position.set(50, 50, 50);
    self.camera.add(pointLight); //加入點光源

    self.scene.add(self.camera); //需要將相機加入場景，才能正常顯示掛在相機的光源

    self.camera.position.z = 100;

    //調整視窗大小
    window.addEventListener('resize', self.onResize.bind(self), false);

    //滑鼠設定
    self.container.addEventListener('mousedown', self.onMouseDown.bind(self), false);
    self.container.addEventListener('mouseup', self.onMouseUp.bind(self), false);
    self.container.addEventListener('mousemove', self.onMouseMove.bind(self), false);

    //執行動畫
    self.animate();
};

Viewer.prototype.onResize = function () {
    var self = this;
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize(window.innerWidth, window.innerHeight);
};

Viewer.prototype.animate = function () {
    var self = this;
    //循環動畫
    requestAnimationFrame(self.animate.bind(self));
    self.controls.update();
    self.renderer.render(self.scene, self.camera);
    self.checkHighlight();
    self.action();
};

Viewer.prototype.add = function (bufferGeometry) {
    var self = this;

    //顏色設定
    var baseColor = new THREE.Color(Math.floor(Math.random() * 16777215));
    var highlightColor = new THREE.Color(
        QixColor.rgb(
            baseColor.r * 255, baseColor.g * 255, baseColor.b * 255
        ).negate().rgbNumber()
    );

    var geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
    for (var i = 0; i < geometry.faces.length; i++) {
        geometry.faces[i].color.copy(baseColor);
    }
    geometry.mergeVertices();
    geometry.computeVertexNormals();

    //材質設定
    var material = new THREE.MeshPhongMaterial({
        vertexColors: THREE.FaceColors,
        flatShading: true, //單一法向量渲染
        //wireframe: true //線架構
    });

    //網格物件設定
    var mesh = new THREE.Mesh(geometry, material);

    //加入拓樸資訊
    mesh.topology = new TOPOLOGY.createFromGeometry(geometry);

    //加入顏色資訊
    mesh.baseColor = baseColor;
    mesh.highlightColor = highlightColor;

    self.scene.add(mesh);
    self.meshs.push(mesh);
};

Viewer.prototype.clear = function (geometry) {
    var self = this;
    for (var key in self.meshs) {
        self.scene.remove(self.meshs[key]);
    }
};

Viewer.prototype.control = function () {
    var self = this;
    self.controls = new TrackballControls(
        self.camera,
        self.container
    );
};

Viewer.prototype.checkHighlight = function () {
    var self = this;
    var baseColor = null;
    var highlightColor = null;
    self.raycaster.setFromCamera(self.mouse, self.camera);
    self.intersects = self.raycaster.intersectObjects(self.scene.children);
    if (self.intersects.length > 0) {
        //恢復顏色
        if (self.intersected) {
            baseColor = self.intersected.object.baseColor;
            self.intersected.face.color.copy(baseColor);
            self.intersected.object.geometry.colorsNeedUpdate = true;
        }
        //新上色
        self.intersected = self.intersects[0];
        highlightColor = self.intersected.object.highlightColor;
        self.intersected.face.color.copy(highlightColor);
        self.intersected.object.geometry.colorsNeedUpdate = true;
    } else {
        if (self.intersected) {
            baseColor = self.intersected.object.baseColor;
            self.intersected.face.color.copy(baseColor);
            self.intersected.object.geometry.colorsNeedUpdate = true;
        }
        self.intersected = null;
    }
};

Viewer.prototype.onMouseMove = function (event) {
    var self = this;
    self.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    self.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
};

Viewer.prototype.onMouseDown = function (event) {
    var self = this;

    self.raycaster.setFromCamera(self.mouse, self.camera);

    self.intersects = self.raycaster.intersectObjects(self.scene.children);

    if (self.intersects.length > 0) {
        self.controls.enabled = false;
        console.log(self.intersects[0]);
        self.mouseDownAction(self, event);
    }
};

Viewer.prototype.onMouseUp = function (event) {
    var self = this;
    self.mouseUpAction(self, event);
    self.controls.enabled = true;
};

Viewer.prototype.setEditor = function (editor) {
    var self = this;
    self.mouseDownAction = (self, event) => {
        editor.mouseDown(self, event);
    };
    self.mouseUpAction = (self, event) => {
        editor.mouseUp(self, event);
    };
    self.action = (self, event) => {
        editor.action(self, event);
    };
};

module.exports = Viewer;