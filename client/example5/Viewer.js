/**************************************************
 File: Viewer.js
 Name: Viewer
 Explain: Viewer
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
import * as THREE from 'three';

var Viewer = function (container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.light = null;
    this.cameraFov = 60;
    this.meshs = [];
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

    //光源設定
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    self.scene.add(ambientLight); //加入環境光源
    var pointLight = new THREE.PointLight(0xffffff, 0.8, 0);
    pointLight.position.set(50, 50, 50);
    self.scene.add(pointLight); //加入點光源

    self.camera.position.z = 50;

    //調整視窗大小
    window.addEventListener('resize', self.onResize.bind(self), false);

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
    self.renderer.render(self.scene, self.camera);
};

Viewer.prototype.add = function (geometry) {
    var self = this;

    //材質設定
    var material = new THREE.MeshPhongMaterial({
        color: Math.floor(Math.random() * 16777215) //Random color
    });

    //網格物件設定
    var mesh = new THREE.Mesh(geometry, material);
    self.scene.add(mesh);

    self.meshs.push(mesh);
};

Viewer.prototype.clear = function (geometry) {
    var self = this;

    for (var key in self.meshs) {
        self.scene.remove(self.meshs[key]);
    }
};

module.exports = Viewer;