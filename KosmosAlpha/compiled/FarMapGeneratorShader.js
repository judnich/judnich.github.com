//@ sourceMappingURL=FarMapGeneratorShader.map
// Generated by CoffeeScript 1.6.1
(function() {
  var frag, vert;

  frag = "precision highp float;\n\nvarying vec3 vPos;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\n\nfloat heightFunc(vec3 coord)\n{\n        vec3 v;\n\n        float a = 0.0;\n        //float p = 4.0;\n        float p = 8.0;\n\n        //for (int i = 0; i < 5; ++i) {\n        for (int i = 0; i < 7; ++i) {\n                v.x = coord.x * p; v.y = coord.y * p; v.z = coord.z * p;\n\n                float ridged;\n\n                ridged = 1.0 - abs(snoise(v));\n                ridged /= float(i)+1.0;\n\n                v.x = coord.x * p / 2.5; v.y = coord.y * p / 2.5; v.z = coord.z * p / 2.5;\n                float k = (snoise(v)+1.0) / 2.0;\n\n                v.x = coord.x * p / 1.0; v.y = coord.y * p / 1.0; v.z = coord.z * p / 1.0;\n\n                a += ridged * k;\n                \n                if (i >= 3) {\n                        v.x = coord.x * p * 8.0; v.y = coord.y * p * 8.0; v.z = coord.z * p * 8.0;\n                        float rolling = (snoise(v)+1.0) / 2.0;\n                        a += (rolling) * (1.0-k) / float(50);\n                }\n\n                p *= 2.0;\n        }\n\n        a /= 1.6;\n\n        return a;\n}\n\n#define ONE_TEXEL (1.0/128.0)\n\n\nvec4 positionAndHeight(vec3 cubePos)\n{\n        vec3 pos = normalize(cubePos);\n        float h = heightFunc(pos);\n        pos *= 0.997 + h * 0.003;\n        return vec4(pos, h);\n}\n\n\nvoid main(void) {\n	vec4 h00 = positionAndHeight(vPos);\n        vec4 h10 = positionAndHeight(vPos + ONE_TEXEL * vBinormal);\n        vec4 h01 = positionAndHeight(vPos + ONE_TEXEL * vTangent);\n        \n        vec3 right = (h10.xyz - h00.xyz);\n        vec3 forward = (h01.xyz - h00.xyz);\n        vec3 normal = normalize(cross(right, forward));\n\n        float height = h00.a;\n        gl_FragColor = vec4((normal + 1.0) * 0.5, height);\n}\n";

  vert = "attribute vec2 aUV;\nattribute vec3 aPos;\nattribute vec3 aTangent;\nattribute vec3 aBinormal;\nvarying vec3 vPos;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\n\nvoid main(void) {\n	vPos = aPos;\n        vTangent = aTangent;\n        vBinormal = aBinormal;\n	gl_Position = vec4(aUV * 2.0 - 1.0, 0.0, 1.0);\n}\n";

  xgl.addProgram("farMapGenerator", vert, xgl.commonNoiseShaderSource + frag);

}).call(this);
