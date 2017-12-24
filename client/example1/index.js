/**************************************************
 File: index.js
 Name: Example 1
 Explain: Example 1
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
require("./index.scss");
require("../common/common.js");

import * as THREE from 'three';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

var geometry = new THREE.BufferGeometry();
geometry.addAttribute('position', new THREE.Float32BufferAttribute([
    -0.5, 0, 0,
     0.5, 0, 0,
     0, 0.86, 0
], 3));

geometry.addAttribute('normal', new THREE.Float32BufferAttribute([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
], 3));

var material = new THREE.MeshPhongMaterial({
    //side: THREE.DoubleSide,
    color: 0xff0000
});

var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

var wireframe = new THREE.WireframeGeometry(geometry);
var line = new THREE.LineSegments(wireframe);
line.material.color = new THREE.Color(0xffffff);
scene.add(line);

var light = new THREE.PointLight(0xffffff, 1.0);
light.position.set(0, 1, 1);
scene.add(light);

camera.position.z = 5;

var animate = function () {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.03;
    line.rotation.y += 0.03;
    renderer.render(scene, camera);
};

animate();