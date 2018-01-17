/**************************************************
 File: index.js
 Name: Example 23
 Explain: Example 23
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
require("./index.scss");
import * as JSBoxy from '../common/common';
const $ = JSBoxy.$;
import * as THREE from 'three';

import three_stl_loader from 'three-stl-loader';
var STLLoader = three_stl_loader(THREE);

import Editor from './Editor';
import CSGBoolean from './CSGBoolean';
import Viewer from './Viewer';

var editor = new Editor();
var csgboolean = new CSGBoolean();
var viewer = new Viewer($("#viewer"));
viewer.init();
viewer.setEditor(editor);
csgboolean.setViewer(viewer);
csgboolean.setEditor(editor);

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

//聯集
$("#union").onclick = function (e) {
    csgboolean.union();
};
//差集
$("#subtract").onclick = function (e) {
    csgboolean.subtract();
};
//交集
$("#intersect").onclick = function (e) {
    csgboolean.intersect();
};
