//@ sourceMappingURL=StarfieldShader.map
// Generated by CoffeeScript 1.6.1
(function() {
  var frag, vert;

  frag = "\nprecision mediump float;\n\nvarying vec3 vUVA;\nvarying vec3 vColor;\n\nvoid main(void) {\n	// compute star color based on intensity = 1/dist^2 from center of sprite\n	vec2 dv = vUVA.xy;\n	float d = dot(dv, dv);\n	float lum = 1.0 / (d*100.0);\n\n	// fall off at a max radius, since 1/dist^2 goes on infinitely\n	d = clamp(d * 4.0, 0.0, 1.0);\n	lum *= 1.0 - d*d;\n\n    gl_FragColor.xyz = clamp(vColor*lum, 0.0, 1.0) * vUVA.z;\n}\n";

  vert = "\nattribute vec4 aPos;\nattribute vec3 aUV; // third component marks one vertex for blur extrusion\n\nuniform mat4 projMat;\nuniform mat4 modelViewMat;\nuniform vec3 starSizeAndViewRangeAndBlur;\n//uniform mat4 modelMat;\n//uniform mat4 viewMat;\n\nvarying vec3 vUVA;\nvarying vec3 vColor;\n\nvoid main(void) {\n	// determine star size\n	float starSize = starSizeAndViewRangeAndBlur.x;\n	//starSize = starSize * (cos(aPos.w*1000.0) * 0.5 + 1.0); // modulate size by simple PRNG\n\n	// compute vertex position so quad is always camera-facing\n	vec4 pos = vec4(aPos.xyz, 1.0);\n	vec2 offset = aUV.xy * starSize;\n\n	//pos = viewMat * modelMat * pos;\n	pos = modelViewMat * pos;\n	pos.xy += offset;\n\n   	// motion blur\n   	float blur = aUV.z * starSizeAndViewRangeAndBlur.z;\n	pos.z *= 1.0 + blur;\n\n	// fade out distant stars\n	float dist = length(pos.xyz);\n	float alpha = clamp((1.0 - (dist / starSizeAndViewRangeAndBlur.y)) * 3.0, 0.0, 1.0);\n\n    // the UV coordinates are used to render the actual star radial gradient,\n    // and alpha is used to modulate intensity of distant stars as they fade out\n    vUVA = vec3(aUV.xy, alpha);\n\n    // compute star color parameter\n    // this is just an arbitrary hand-tweaked interpolation between blue/white/red\n    // favoring mostly blue and white with some red\n    vColor = vec3(\n    	1.0 - aPos.w,\n    	aPos.w*2.0*(1.0-aPos.w),\n    	4.0 * aPos.w\n    ) * 0.5 + 0.5;\n\n	// output position, or degenerate triangle if star is beyond view range\n	if (alpha > 0.0) {\n    	gl_Position = projMat * pos;\n\n    	// fix subpixel flickering by adding slight screenspace size\n    	gl_Position.xy += aUV.xy * max(0.0, gl_Position.z) / 300.0;\n    }\n    else {\n    	gl_Position = vec4(0, 0, 0, 0);\n    }\n}";

  xgl.addProgram("starfield", vert, frag);

}).call(this);
