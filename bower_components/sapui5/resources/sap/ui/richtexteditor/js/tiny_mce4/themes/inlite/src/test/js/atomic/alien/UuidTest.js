test('atomic/alien/UuidTest',['tinymce/inlite/alien/Uuid'],function(U){var t=function(){assert.eq(U.uuid('mce').indexOf('mce'),0);assert.eq(U.uuid('mce')!==U.uuid('mce'),true);};t();});
