/**************************************************
 File: index.js
 Name: Example 8
 Explain: Example 8
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
require("./index.scss");
import * as JSBoxy from '../common/common';
const $ = JSBoxy.$;
import * as THREE from 'three';

import three_stl_loader from 'three-stl-loader';
var STLLoader = three_stl_loader(THREE);

import Viewer from './Viewer';

var viewer = new Viewer($("#viewer"));
viewer.init();

$("#openfile").onchange = function (e) {
    var file = e.target.files[0];
    if (e.target.files.length == 1) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
            var loader = new STLLoader();
            var geometry = loader.parse(e.target.result);
            viewer.add(geometry);
            $("#openfile").value = "";
        };
        reader.readAsBinaryString(file);
    }
};

$("#deletefile").onclick = function (e) {
    viewer.clear();
};