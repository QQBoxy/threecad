/**************************************************
 File: index.js
 Name: Example 4
 Explain: Example 4
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
require("./index.scss");
import * as JSBoxy from '../common/common';
const $ = JSBoxy.$;
import * as THREE from 'three';
import three_stl_loader from 'three-stl-loader';
var STLLoader = three_stl_loader(THREE);

var draw = function (geometry) {
    $("#view").innerHTML = "";
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("#view").appendChild(renderer.domElement);

    var material = new THREE.MeshPhongMaterial({
        //side: THREE.DoubleSide,
        color: Math.floor(Math.random() * 16777215) //Random color
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var wireframe = new THREE.WireframeGeometry(geometry);
    var line = new THREE.LineSegments(wireframe);
    line.material.color = new THREE.Color(0xffffff);
    scene.add(line);

    var light = new THREE.PointLight(0xffffff, 1.0);
    light.position.set(0, 50, 50);
    scene.add(light);

    camera.position.z = 50;

    var animate = function () {
        requestAnimationFrame(animate);
        mesh.rotation.y += 0.03;
        line.rotation.y += 0.03;
        renderer.render(scene, camera);
    };

    animate();
};

var model = document.createElement("input");
model.setAttribute("type", "file");
model.onchange = function (e) {
    var file = e.target.files[0];
    if (e.target.files.length == 1) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
            var loader = new STLLoader();
            var geometry = loader.parse(e.target.result);
            draw(geometry);
        };
        reader.readAsBinaryString(file);
    }
};
$("#app").appendChild(model);

var view = document.createElement("div");
view.setAttribute("id", "view");
$("#app").appendChild(view);