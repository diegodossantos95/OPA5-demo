define('tinymce/inlite/alien/Arr',[],function(){var f=function(a){return a.reduce(function(r,i){return Array.isArray(i)?r.concat(f(i)):r.concat(i);},[]);};return{flatten:f};});
