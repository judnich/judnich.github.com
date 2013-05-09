//@ sourceMappingURL=PlanetNearMeshShader.map
// Generated by CoffeeScript 1.6.1
(function() {
  var frag, vert;

  frag = "\nprecision highp float;\n\nvarying vec3 vNormal;\nvarying vec2 vUV;\nvarying float camDist;\n\nuniform float alpha;\nuniform vec3 lightVec;\nuniform sampler2D sampler;\nuniform sampler2D detailSampler;\n\nuniform vec4 uvRect;\n\nuniform vec3 planetColor1;\nuniform vec3 planetColor2;\n\nconst float uvScalar = 4097.0 / 4096.0;\n#define ONE_TEXEL (1.0/4096.0)\n\n\nvec3 computeLighting(float globalDot, float diffuse, float ambient, vec3 color)\n{\n	float nightBlend = clamp(0.5 - globalDot * 4.0, 0.0, 1.0);\n 	float nightLight = clamp(0.2 / sqrt(camDist) - 0.001, 0.0, 1.0);\n 	float ambientNight = nightBlend * (ambient * ambient * 0.14 + 0.02) * nightLight;\n\n 	vec3 nightColor = normalize(color) * 0.4 + vec3(0.4, 0.1, 1.0) * 0.4;\n\n 	return color * diffuse + nightColor * ambientNight;\n}\n\nvec3 computeColor(float height, float ambient)\n{\n	float selfShadowing = 1.01 - dot(planetColor1, vec3(1,1,1)/3.0);\n\n	vec3 color = vec3(1,1,1);\n	float edge = mix(1.0, ambient, selfShadowing);\n	color *= mix(planetColor2, vec3(1,1,1) * edge, clamp(abs(height - 0.0) / 1.5, 0.0, 1.0));\n	color *= mix(planetColor1, vec3(1,1,1) * edge, clamp(abs(height - 0.5) / 2.5, 0.0, 1.0));\n\n	color *= height * 0.25 + 1.00;\n\n	return color;\n}\n\nvoid main(void) {\n	// extract terrain info\n	vec4 tex = texture2D(sampler, vUV * uvScalar, -0.5);\n	vec3 norm = normalize(tex.xyz * 2.0 - 1.0);\n\n	// compute terrain shape features values\n	float globalDot = dot(lightVec, vNormal);\n	float diffuse = clamp(dot(lightVec, norm), 0.0, 1.0);\n 	float ambient = clamp(1.0 - 2.0 * acos(dot(norm, normalize(vNormal))), 0.0, 1.0);\n	float height = tex.a;\n\n	// compute color based on terrain features\n 	vec3 color = computeColor(height, ambient);\n 	vec4 detailColor = texture2D(detailSampler, vUV * 256.0, -0.5) * 2.0 - 1.0;\n  	float detailPower = clamp(1.0 / (camDist * 25.0), 0.0, 1.0) * (1.20 - clamp(globalDot, 0.0, 1.0));\n	color *= 1.0 + detailColor.xyz * detailPower;\n\n	gl_FragColor.xyz = computeLighting(globalDot, diffuse, ambient, color);\n	//gl_FragColor.xyz = detailColor.xyz;\n\n    gl_FragColor.w = 1.0; //alpha;\n}\n";

  vert = "\nprecision highp float;\nprecision highp vec3;\nprecision highp vec4;\nprecision highp mat3;\nprecision highp mat4;\n\nattribute vec3 aUV;\n\nuniform mat4 projMat;\nuniform mat4 modelViewMat;\nuniform mat3 cubeMat;\n\nvarying vec3 vNormal;\nvarying vec2 vUV;\nvarying float camDist;\n\nuniform vec4 uvRect;\nuniform sampler2D vertSampler;\n\nconst float uvScalar = 4097.0 / 4096.0;\n\nvoid main(void) {\n	vec2 uv = aUV.xy * uvRect.zw + uvRect.xy;\n\n	vec3 aPos = vec3(uv * 2.0 - 1.0, 1.0);\n	aPos = normalize(aPos * cubeMat);\n\n	float height = texture2D(vertSampler, uv * uvScalar).a;\n	aPos *= 0.985 + (height - (uvRect.z * 3.0) * aUV.z) * 0.015;\n\n	vNormal = aPos;\n	vUV = uv.xy;\n\n	vec4 pos = vec4(aPos, 1.0);\n	pos = modelViewMat * pos;\n    gl_Position = projMat * pos;\n\n    camDist = length(pos.xyz);\n}\n";

  xgl.addProgram("planetNearMesh", vert, frag);

}).call(this);
