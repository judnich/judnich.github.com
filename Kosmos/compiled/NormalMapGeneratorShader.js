// Generated by CoffeeScript 1.6.3
(function() {
  var frag, vert;

  frag = "precision highp float;\n\nvarying vec3 vPos;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec2 vUV;\n\nuniform sampler2D sampler;\n\n#define ONE_TEXEL (1.0/4096.0)\n\n\nvec4 positionAndHeight(vec3 cubePos, vec2 uv)\n{\n        vec3 pos = normalize(cubePos);\n        float h = texture2D(sampler, uv).a;\n        pos *= 0.997 + h * 0.003;\n        return vec4(pos, h);\n}\n\n\nvoid main(void) {\n        // ========================== Compute normal vector =======================\n	vec4 hCenter = positionAndHeight(vPos, vUV);\n\n        vec4 hR = positionAndHeight(vPos + ONE_TEXEL * vBinormal, vUV + vec2(ONE_TEXEL, 0));\n        vec4 hF = positionAndHeight(vPos + ONE_TEXEL * vTangent, vUV + vec2(0, ONE_TEXEL));\n        vec4 hL = positionAndHeight(vPos - ONE_TEXEL * vBinormal, vUV - vec2(ONE_TEXEL, 0));\n        vec4 hB = positionAndHeight(vPos - ONE_TEXEL * vTangent, vUV - vec2(0, ONE_TEXEL));\n\n        vec3 right = (hR.xyz - hL.xyz);\n        vec3 forward = (hF.xyz - hB.xyz);\n        vec3 normal = normalize(cross(right, forward));\n\n        // ========================== Compute horizon angle ==========================\n        /*float horizon = 0.0;\n        vec3 vUnitPos = normalize(vPos);\n        for (int i = 1; i < 8; ++i) {\n                float n = float(i);\n\n                float a = n * .0981748;\n                float x, y;\n\n                x = sin(a);\n                y = cos(a);\n                vec3 hR = positionAndHeight(vPos + x * ONE_TEXEL * vBinormal * n + y * ONE_TEXEL * vTangent * n, vUV + vec2(x, y) * ONE_TEXEL * n).xyz - hCenter.xyz;\n\n                x = sin(a + 1.57079632);\n                y = cos(a + 1.57079632);\n                vec3 hF = positionAndHeight(vPos + x * ONE_TEXEL * vBinormal * n + y * ONE_TEXEL * vTangent * n, vUV + vec2(x, y) * ONE_TEXEL * n).xyz - hCenter.xyz;\n\n                x = sin(a + 1.57079632 * 2.0);\n                y = cos(a + 1.57079632 * 2.0);\n                vec3 hL = positionAndHeight(vPos + x * ONE_TEXEL * vBinormal * n + y * ONE_TEXEL * vTangent * n, vUV + vec2(x, y) * ONE_TEXEL * n).xyz - hCenter.xyz;\n\n                x = sin(a + 1.57079632 * 3.0);\n                y = cos(a + 1.57079632 * 3.0);\n                vec3 hB = positionAndHeight(vPos + x * ONE_TEXEL * vBinormal * n + y * ONE_TEXEL * vTangent * n, vUV + vec2(x, y) * ONE_TEXEL * n).xyz - hCenter.xyz;\n\n                float d1 = dot(normalize(hR), vUnitPos);\n                float d2 = dot(normalize(hF), vUnitPos);\n                float d3 = dot(normalize(hL), vUnitPos);\n                float d4 = dot(normalize(hB), vUnitPos);\n\n                float d = max(d1, max(d2, max(d3, d4)));\n                horizon = max(horizon, d);\n        }\n        horizon = clamp(horizon, 0.0, 1.0);*/\n\n\n        // this is a very unique and extremely efficient hack\n        // basically we encode the ambient occlusion map / horizon map as the normal vector length!\n        // not only does this efficiently pack this info, but actually ENHANCES the normal map quality\n        // because wide open areas determined by the horizon map scale down the vector length, resulting\n        // in a \"sharpening\" effect for these areas, and a smoothing effect for curved surfaces. the end\n        // result is sharpened normal maps in general appearing 2x as high resolution! mainly this is because\n        // mountain peaks are sharpened, and thus dont appear as blurry as regular normals do.\n        // Note: The reason scaling down normal vectors sharpens them is when interpolating linearly between\n        // a large vector to a small vector, and renormalizing in the fragment shader, this has the effect of\n        // producing a nonlinear interpolation. Specifically, the smaller the destination vector, the faster\n        // it is approached, thus creating a \"sharpened\" look. \n\n        float ave = (hR.a + hF.a + hL.a + hB.a) * 0.25;\n        float diff = abs(hCenter.a - ave) * 500.0;\n        normal /= (1.0 + diff);\n        //normal *= ((1.0-horizon) * 0.9375 + 0.0625);\n\n\n        float height = hCenter.a;\n        gl_FragColor = vec4((normal + 1.0) * 0.5, height);\n}\n";

  vert = "attribute vec2 aUV;\nattribute vec3 aPos;\nattribute vec3 aTangent;\nattribute vec3 aBinormal;\nvarying vec3 vPos;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec2 vUV;\n\nuniform vec2 verticalViewport;\n\nvoid main(void) {\n        vUV = aUV;\n	vPos = aPos;\n        vTangent = aTangent;\n        vBinormal = aBinormal;\n\n        vec2 pos = aUV;\n        pos.y = (pos.y - verticalViewport.x) / verticalViewport.y;\n        pos = pos * 2.0 - 1.0;\n\n	gl_Position = vec4(pos, 0.0, 1.0);\n}\n";

  xgl.addProgram("normalMapGenerator", vert, frag);

}).call(this);

/*
//@ sourceMappingURL=NormalMapGeneratorShader.map
*/
