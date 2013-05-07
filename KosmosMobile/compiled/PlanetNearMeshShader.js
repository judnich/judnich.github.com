//@ sourceMappingURL=PlanetNearMeshShader.map
// Generated by CoffeeScript 1.6.1
(function() {
  var frag, vert;

  frag = "\nprecision mediump float;\n\nvarying vec3 vNormal;\nvarying vec2 vUV;\nvarying float camDist;\n\nuniform float alpha;\nuniform vec3 lightVec;\nuniform sampler2D sampler;\n\nuniform vec4 uvRect;\n\nconst float uvScalar = 4097.0 / 4096.0;\n#define ONE_TEXEL (1.0/4096.0)\n\nvec3 computeLighting(vec3 N, vec3 color)\n{\n	float diffuse = clamp(dot(lightVec, N), 0.0, 1.0);\n	float globalDot = clamp(0.5 - dot(lightVec, vNormal) * 4.0, 0.0, 1.0);\n\n 	float ambient = clamp(1.0 - 2.0 * acos(dot(N, normalize(vNormal))), 0.0, 1.0);\n 	ambient *= ambient;\n\n 	float nightLight = clamp(0.2 / sqrt(camDist) - 0.001, 0.0, 1.0);\n 	float ambientNight = globalDot * (ambient * 0.14 + 0.02) * nightLight;\n\n 	float grayColor = (color.r + color.g + color.b) / 3.0;\n 	vec3 nightColor = vec3(grayColor * 0.4, grayColor * 0.1, grayColor * 1.0);\n\n 	return color * diffuse + nightColor * ambientNight;\n}\n\nvoid main(void) {\n	vec4 tex = texture2D(sampler, vUV * uvScalar, -0.5);\n\n	float ao = (tex.a * 0.5 + 0.5);\n	\n	// extract normal and horizon values\n	vec3 norm = normalize(tex.xyz * 2.0 - 1.0);\n\n	gl_FragColor.xyz = computeLighting(norm, vec3(ao, ao, ao));\n\n    gl_FragColor.w = 1.0; //alpha;\n}\n";

  vert = "\nprecision mediump float;\n\nattribute vec3 aUV;\n\nuniform mat4 projMat;\nuniform mat4 modelViewMat;\nuniform mat3 cubeMat;\n\nvarying vec3 vNormal;\nvarying vec2 vUV;\nvarying float camDist;\n\nuniform vec4 uvRect;\nuniform sampler2D vertSampler;\n\nconst float uvScalar = 4097.0 / 4096.0;\n\nvoid main(void) {\n	vec2 uv = aUV.xy * uvRect.zw + uvRect.xy;\n\n	vec3 aPos = vec3(uv * 2.0 - 1.0, 1.0);\n	aPos = normalize(aPos * cubeMat);\n\n	float height = texture2D(vertSampler, uv * uvScalar).a;\n	aPos *= 0.99 + (height - (uvRect.z * 3.0) * aUV.z) * 0.01;\n\n	vNormal = aPos;\n	vUV = uv.xy;\n\n	vec4 pos = vec4(aPos, 1.0);\n	pos = modelViewMat * pos;\n    gl_Position = projMat * pos;\n\n    camDist = length(pos.xyz);\n}\n";

  xgl.addProgram("planetNearMesh", vert, frag);

}).call(this);
