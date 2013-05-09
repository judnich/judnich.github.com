//@ sourceMappingURL=DetailMapGeneratorShader.map
// Generated by CoffeeScript 1.6.1
(function() {
  var frag, vert;

  frag = "precision highp float;\n\nvarying vec2 vUV;\n\n#define ONE_TEXEL (1.0/1024.0)\n\n\nfloat rnoise(vec2 uv) {\n        return 1.0 - abs(snoise(uv));\n}\nfloat hnoise(vec2 uv) {\n        return snoise(uv) * 0.5 + 0.5;\n}\n\nfloat hfunc(vec2 v) {\n        float a = 0.0;\n\n        a += rnoise(v * 8.0) / 4.0;\n        v += 0.1;\n        a += rnoise(v * 16.0) / 4.0;\n        v += 0.1;\n        a += rnoise(v * 32.0) / 4.0;\n        v += 0.1;\n        a += rnoise(v * 64.0) / 4.0;\n        v += 0.1;\n\n        v = (v - 12.345) * -2.345;\n\n        a += rnoise(v * 128.0) / 8.0;\n        v += 0.1;\n        a += rnoise(v * 256.0) / 8.0;\n        v += 0.1;\n        a += rnoise(v * 512.0) / 8.0;\n        v += 0.1;\n        a += rnoise(v * 1024.0) / 8.0;\n        v += 0.1;\n\n        v = (v - 12.345) * -2.345;\n\n        a += hnoise(v * 8.0) / 8.0;\n        v += 0.1;\n        a += hnoise(v * 16.0) / 8.0;\n        v += 0.1;\n        a += hnoise(v * 32.0) / 8.0;\n        v += 0.1;\n        a += hnoise(v * 64.0) / 8.0;\n        v += 0.1;\n\n        a /= 2.0;\n\n        return a;\n}\n\n\nvoid main(void) {\n        float f = hfunc(vUV) * 0.5 + hfunc(vec2(1,0) - vUV) * 0.25 + hfunc(vec2(0,1) - vUV) * 0.25;\n        gl_FragColor = vec4(f, f, f, 1.0);\n}\n";

  vert = "attribute vec2 aUV;\nvarying vec2 vUV;\n\nvoid main(void) {\n	vUV = aUV;\n	gl_Position = vec4(aUV * 2.0 - 1.0, 0.0, 1.0);\n}\n";

  xgl.addProgram("detailMapGenerator", vert, xgl.commonNoiseShaderSource + frag);

}).call(this);