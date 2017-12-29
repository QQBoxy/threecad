/**************************************************
 File: index.js
 Name: Example 5
 Explain: Example 5
****************************************By QQBoxy*/
/*jshint node: true, esversion: 6 */
'use strict';
require("./index.scss");
import * as JSBoxy from '../common/common';
const $ = JSBoxy.$;

let list = () => {
    let i = 0;
    let opt = "";
    for(i=1;i<20;i++) {
        opt += `<li><a href="./example${i}">Example ${i}</a></li>`;
    }
    return opt;
};

$("#app").innerHTML = `
    <h1>Example List</h1>
    <ul>${list()}</ul>
`;