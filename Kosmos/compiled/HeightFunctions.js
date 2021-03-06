// Generated by CoffeeScript 1.6.3
(function() {
  var hfunctions, root;

  hfunctions = [];

  hfunctions[0] = "precision highp float;\n\nfloat heightFunc(vec3 coord, vec3 rndSeed)\n{\n        vec3 v;\n\n        float a = 0.0;\n        float p = 6.0 + rndSeed.x * 2.0;\n\n        for (int i = 0; i < 6; ++i) {\n                v = coord * p + rndSeed.xyz * 1001.0;\n\n                float ridged = 1.0 - abs(snoise(v));\n                ridged /= float(i)+1.0;\n\n                v = coord * p / (2.5 + 2.5 * rndSeed.y) + rndSeed.xyz * 1001.0;\n                float k = (snoise(v)+1.0) / 2.0;\n\n                v = coord * p + rndSeed.xyz * 1001.0;\n\n                a += ridged * k;\n                \n                if (i >= 3) {\n                        v = coord * p * 8.0 + rndSeed.xyz * 1001.0;\n                        float rolling = (snoise(v)+1.0) / 2.0;\n                        a += (rolling) * (1.0-k) / float(50);\n                }\n\n                p *= 2.25 - 0.25 * rndSeed.x - rndSeed.z * 0.5;\n        }\n\n        a /= 1.6;\n\n        return a;\n}\n";

  hfunctions[1] = "precision highp float;\n\nfloat heightFunc(vec3 coord, vec3 rndSeed)\n{\n        vec3 v;\n\n        float a = 0.0;\n        float p = 6.0 + rndSeed.x * 2.0;\n\n        float rolly = clamp((snoise(coord * 3.0) + snoise(coord * 6.0) + rndSeed.y) / 2.0, 0.0, 1.0);\n\n        for (int i = 0; i < 6; ++i) {\n                v = coord * p + rndSeed.xyz * 1001.0;\n\n                float ridged = 1.0 - abs(snoise(v)); // rolling\n                ridged = ridged * (1.0 - rolly) + rolly * ((snoise(v)+1.0) / 2.0);\n\n                ridged /= float(i)+1.0;\n\n                v = coord * p / (2.5 + 2.5 * rndSeed.y) + rndSeed.xyz * 1001.0;\n                float k = (snoise(v)+1.0) / 2.0;\n\n                v = coord * p + rndSeed.xyz * 1001.0;\n\n                a += ridged * k;\n                \n                if (i >= 2) {\n                        v = coord * p * 8.0 + rndSeed.xyz * 1001.0;\n                        float ridged = 1.0 - abs(snoise(v));\n                        a += (ridged) * (1.0-k) / float(50);\n                }\n\n                p *= 2.25 - 0.25 * rndSeed.x - rndSeed.z * 0.5;\n        }\n\n        a /= 1.6;\n\n        return a;\n}\n";

  hfunctions[2] = "precision highp float;\n\nfloat heightFunc(vec3 coord, vec3 rndSeed)\n{\n        vec3 v;\n\n        float a = 0.0;\n        float p = 6.0 + rndSeed.x * 2.0;\n\n        for (int i = 0; i < 6; ++i) {\n                v = coord * p + rndSeed.xyz * 1001.0;\n\n                float rolly = clamp((snoise(v) + 1.0) / 2.0, 0.0, 1.0);\n\n                float ridged = 1.0 - abs(snoise(v)); // rolling\n                ridged = ridged * (1.0 - rolly) + rolly * ((snoise(v)+1.0) / 2.0);\n\n                ridged /= float(i)+1.0;\n\n                v = coord * p / (2.5 + 2.5 * rndSeed.y) + rndSeed.xyz * 1001.0;\n                float k = (1.0 - abs(snoise(v))); //(snoise(v)+1.0) / 2.0;\n\n                v = coord * p + rndSeed.xyz * 1001.0;\n\n                a += ridged * k;\n                \n                if (i >= 2) {\n                        v = coord * p * 8.0 + rndSeed.xyz * 1001.0;\n                        float ridged = 1.0 - abs(snoise(v));\n                        a += (ridged) * (1.0-k) / float(50);\n                }\n\n                p *= 2.25 - 0.25 * rndSeed.x - rndSeed.z * 0.5;\n        }\n\n        a /= 1.6;\n\n        return a;\n}\n";

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.kosmosShaderHeightFunctions = hfunctions;

}).call(this);

/*
//@ sourceMappingURL=HeightFunctions.map
*/
