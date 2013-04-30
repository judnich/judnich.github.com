//@ sourceMappingURL=PlanetFarMeshShader.map
// Generated by CoffeeScript 1.6.1
(function() {
  var frag, vert;

  frag = "\nprecision mediump float;\n\nvarying vec3 vNormal;\nvarying vec2 vUV;\n\nuniform float alpha;\nuniform vec3 lightVec;\nuniform sampler2D sampler;\n\nvoid main(void) {\n	vec4 tex = texture2D(sampler, vUV);\n	\n	vec3 norm = normalize(tex.xyz * 2.0 - 1.0);\n    float l = (tex.a * 0.5 + 0.4) * dot(norm, lightVec) * 0.9 + 0.1;\n    gl_FragColor.xyz = vec3(l);\n    gl_FragColor.w = alpha;\n\n    //gl_FragColor = vec4(tex.a, tex.a, tex.a, 1.0);\n}\n";

  vert = "\nattribute vec3 aPos;\nattribute vec2 aUV;\n\nuniform mat4 projMat;\nuniform mat4 modelViewMat;\n\nvarying vec3 vNormal;\nvarying vec2 vUV;\n\nvoid main(void) {\n	vNormal = aPos;\n	vUV = aUV;\n\n	vec4 pos = vec4(aPos, 1.0);\n	pos = modelViewMat * pos;\n    gl_Position = projMat * pos;\n}\n";

  xgl.addProgram("planetFarMesh", vert, frag);

}).call(this);
