/**************************************************
 File: index.js
 Name: Example 3
 Explain: Example 3
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
require("./index.scss");
import * as JSBoxy from '../common/common';
const $ = JSBoxy.$;
import * as THREE from 'three';
import three_stl_loader from 'three-stl-loader';
var STLLoader = three_stl_loader(THREE);

var model = document.createElement("input");
model.setAttribute("type", "file");
model.onchange = function (e) {
    var file = e.target.files[0];
    if (e.target.files.length == 1) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
            var loader = new STLLoader();
            var geometry = loader.parse(e.target.result);
            console.log(geometry);
        };
        reader.readAsBinaryString(file);
    }
};

$("#app").appendChild(model);