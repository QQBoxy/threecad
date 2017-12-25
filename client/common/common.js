/************************************************
Name    ：JSBoxy.js
Version ：1.4.5
Explain ：JavaScript函式庫
**************************************By QQBoxy*/

/************************************************
Name    ：$
Explain ：語法縮短
Examples：
// example 1
$("#myid")

// example 2
$(".myClassName")[0]

// example 3
$("myTagname")[0]
**************************************By QQBoxy*/
const $ = function(id) {
    switch (id.substr(0, 1)) {
        case '#':
            return document.getElementById(id.substr(1));
        case '.':
            var elems = document.body.getElementsByTagName('*');
            var target = id.substr(1);
            var result = [];
            for (i = 0; i < elems.length; i++) {
                if ((elems[i].className).indexOf(target) != -1) result.push(elems[i]);
            }
            return result;
        default:
            return document.getElementsByTagName(id);
    }
};

module.exports.$ = $;