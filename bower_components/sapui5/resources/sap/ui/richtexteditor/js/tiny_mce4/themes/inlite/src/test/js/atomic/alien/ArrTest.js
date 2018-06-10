test('atomic/alien/ArrTest',['tinymce/inlite/alien/Arr'],function(A){var t=function(){assert.eq(A.flatten([1,2,[3,4,[5,6]],[7,8],9]),[1,2,3,4,5,6,7,8,9]);};t();});
