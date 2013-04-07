//@ sourceMappingURL=StarfieldShader.map
// Generated by CoffeeScript 1.6.1
(function() {
  var frag, vert;

  frag = "\nprecision mediump float;\n\nvarying vec3 vUVA;\nvarying vec3 vColor;\n\nvoid main(void) {\n	// compute star color based on intensity = 1/dist^2 from center of sprite\n	vec2 dv = vUVA.xy - vec2(0.5, 0.5);\n	float d = dot(dv, dv);\n	float lum = 1.0 / (d*100.0);\n	//float c = 1.0 / (d*10.0);\n	//c = clamp(0.5 - d, 0.0, 1.0) * c;\n\n	vec4 pColor = vec4(clamp(lum*vColor.x, 0.0, 1.0), clamp(lum*vColor.y, 0.0, 1.0), clamp(lum*vColor.z, 0.0, 1.0), 1.0);\n    gl_FragColor = pColor * vUVA.z;\n}\n";

  vert = "\nattribute vec4 aPos;\nattribute vec2 aUV;\n\nuniform mat4 projMat;\nuniform mat4 modelViewMat;\nuniform vec3 starSizeAndViewRangeAndBlur;\n//uniform mat4 modelMat;\n//uniform mat4 viewMat;\n\nvarying vec3 vUVA;\nvarying vec3 vColor;\n\nvoid main(void) {\n	// determine star size\n	float starSize = starSizeAndViewRangeAndBlur.x;\n	//starSize = starSize * (cos(aPos.w*1000.0) * 0.5 + 1.0); // modulate size by simple PRNG\n\n	// compute vertex position so quad is always camera-facing\n	vec4 pos = vec4(aPos.xyz, 1.0);\n	vec2 offset = (aUV - 0.5) * starSize;\n\n	//pos = viewMat * modelMat * pos;\n	pos = modelViewMat * pos;\n	pos.xy += offset;\n\n	// fade out distant stars\n	float dist = length(pos.xyz);\n	float alpha = clamp((1.0 - (dist / starSizeAndViewRangeAndBlur.y)) * 3.0, 0.0, 1.0);\n\n    // the UV coordinates are used to render the actual star radial gradient,\n    // and alpha is used to modulate intensity of distant stars as they fade out\n    vUVA = vec3(aUV, alpha);\n\n    // compute star color parameter\n    // this is just an arbitrary hand-tweaked interpolation between blue/white/red\n    // favoring mostly blue and white with some red\n    vColor = vec3(\n    	1.0 - aPos.w,\n    	aPos.w*2.0*(1.0-aPos.w),\n    	4.0 * aPos.w\n    ) * 0.5 + 0.5;\n\n	// output position, or degenerate triangle if star is beyond view range\n	if (alpha > 0.0) {\n    	gl_Position = projMat * pos;\n\n    	// fix subpixel flickering by adding slight screenspace size\n    	gl_Position.xy += (aUV - 0.5) * max(0.0, gl_Position.z) / 300.0;\n\n    	// motion blur\n    	float blur = (1.0 - aUV.x) * (1.0 - aUV.y) * starSizeAndViewRangeAndBlur.z;\n		gl_Position.w *= 1.0 + blur;\n    }\n    else {\n    	gl_Position = vec4(0, 0, 0, 0);\n    }\n}";

  xgl.addProgram("starfield", vert, frag);

}).call(this);
