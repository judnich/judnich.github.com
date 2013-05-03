//@ sourceMappingURL=NearMapGenerator.map
// Generated by CoffeeScript 1.6.1
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.NearMapGenerator = (function() {

    function NearMapGenerator(mapResolution) {
      var binormal, buff, faceIndex, i, pos, posU, posV, tangent, uv, _i, _j, _len, _ref;
      this.heightGenShader = xgl.loadProgram("nearMapGenerator");
      this.heightGenShader.uniforms = xgl.getProgramUniforms(this.heightGenShader, ["verticalViewport"]);
      this.heightGenShader.attribs = xgl.getProgramAttribs(this.heightGenShader, ["aUV", "aPos", "aTangent", "aBinormal"]);
      this.normalGenShader = xgl.loadProgram("normalMapGenerator");
      this.normalGenShader.uniforms = xgl.getProgramUniforms(this.normalGenShader, ["verticalViewport", "sampler"]);
      this.normalGenShader.attribs = xgl.getProgramAttribs(this.normalGenShader, ["aUV", "aPos", "aTangent", "aBinormal"]);
      this.fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
      this.fbo.width = mapResolution;
      this.fbo.height = mapResolution;
      console.log("Initialized high resolution planet map generator FBO at " + this.fbo.width + " x " + this.fbo.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      buff = new Float32Array(6 * 6 * 11);
      i = 0;
      tangent = [0, 0, 0];
      binormal = [0, 0, 0];
      for (faceIndex = _i = 0; _i <= 5; faceIndex = ++_i) {
        _ref = [[0, 0], [1, 0], [0, 1], [1, 0], [1, 1], [0, 1]];
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          uv = _ref[_j];
          pos = mapPlaneToCube(uv[0], uv[1], faceIndex);
          buff[i++] = uv[0];
          buff[i++] = uv[1];
          buff[i++] = pos[0];
          buff[i++] = pos[1];
          buff[i++] = pos[2];
          posU = mapPlaneToCube(uv[0] + 1, uv[1], faceIndex);
          posV = mapPlaneToCube(uv[0], uv[1] + 1, faceIndex);
          binormal = [posU[0] - pos[0], posU[1] - pos[1], posU[2] - pos[2]];
          tangent = [posV[0] - pos[0], posV[1] - pos[1], posV[2] - pos[2]];
          buff[i++] = binormal[0];
          buff[i++] = binormal[1];
          buff[i++] = binormal[2];
          buff[i++] = tangent[0];
          buff[i++] = tangent[1];
          buff[i++] = tangent[2];
        }
      }
      this.quadVerts = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVerts);
      gl.bufferData(gl.ARRAY_BUFFER, buff, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      this.quadVerts.itemSize = 11;
      this.quadVerts.numItems = buff.length / this.quadVerts.itemSize;
    }

    NearMapGenerator.prototype.start = function() {
      gl.disable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
      gl.viewport(0, 0, this.fbo.width, this.fbo.height);
      gl.enableVertexAttribArray(this.normalGenShader.attribs.aUV);
      gl.enableVertexAttribArray(this.normalGenShader.attribs.aPos);
      gl.enableVertexAttribArray(this.normalGenShader.attribs.aBinormal);
      gl.enableVertexAttribArray(this.normalGenShader.attribs.aTangent);
      return gl.enable(gl.SCISSOR_TEST);
    };

    NearMapGenerator.prototype.finish = function() {
      gl.disable(gl.SCISSOR_TEST);
      gl.disableVertexAttribArray(this.normalGenShader.attribs.aUV);
      gl.disableVertexAttribArray(this.normalGenShader.attribs.aPos);
      gl.disableVertexAttribArray(this.normalGenShader.attribs.aBinormal);
      gl.disableVertexAttribArray(this.normalGenShader.attribs.aTangent);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(null);
      gl.depthMask(true);
      return gl.enable(gl.DEPTH_TEST);
    };

    NearMapGenerator.prototype.createMaps = function() {
      var face, maps, _i;
      maps = [];
      for (face = _i = 0; _i <= 6; face = ++_i) {
        maps[face] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, maps[face]);
        if (face < 6) {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.fbo.width, this.fbo.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
      return maps;
    };

    NearMapGenerator.prototype.generateSubFinalMap = function(maps, seed, faceIndex, startFraction, endFraction) {
      var dataMap, indicesPerFace;
      gl.useProgram(this.normalGenShader);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVerts);
      gl.vertexAttribPointer(this.normalGenShader.attribs.aUV, 2, gl.FLOAT, false, this.quadVerts.itemSize * 4, 0);
      gl.vertexAttribPointer(this.normalGenShader.attribs.aPos, 3, gl.FLOAT, false, this.quadVerts.itemSize * 4, 4 * 2);
      gl.vertexAttribPointer(this.normalGenShader.attribs.aBinormal, 3, gl.FLOAT, false, this.quadVerts.itemSize * 4, 4 * 5);
      gl.vertexAttribPointer(this.normalGenShader.attribs.aTangent, 3, gl.FLOAT, false, this.quadVerts.itemSize * 4, 4 * 8);
      dataMap = maps[faceIndex];
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dataMap, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, maps[6]);
      gl.uniform1i(this.normalGenShader.uniforms.sampler, 0);
      gl.viewport(0, this.fbo.height * startFraction, this.fbo.width, this.fbo.height * (endFraction - startFraction));
      gl.scissor(0, this.fbo.height * startFraction, this.fbo.width, this.fbo.height * (endFraction - startFraction));
      gl.uniform2f(this.normalGenShader.uniforms.verticalViewport, startFraction, endFraction - startFraction);
      indicesPerFace = this.quadVerts.numItems / 6;
      return gl.drawArrays(gl.TRIANGLES, indicesPerFace * faceIndex, indicesPerFace);
    };

    NearMapGenerator.prototype.generateSubMap = function(maps, seed, faceIndex, startFraction, endFraction) {
      var dataMap, indicesPerFace;
      gl.useProgram(this.heightGenShader);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVerts);
      gl.vertexAttribPointer(this.heightGenShader.attribs.aUV, 2, gl.FLOAT, false, this.quadVerts.itemSize * 4, 0);
      gl.vertexAttribPointer(this.heightGenShader.attribs.aPos, 3, gl.FLOAT, false, this.quadVerts.itemSize * 4, 4 * 2);
      gl.vertexAttribPointer(this.heightGenShader.attribs.aBinormal, 3, gl.FLOAT, false, this.quadVerts.itemSize * 4, 4 * 5);
      gl.vertexAttribPointer(this.heightGenShader.attribs.aTangent, 3, gl.FLOAT, false, this.quadVerts.itemSize * 4, 4 * 8);
      dataMap = maps[6];
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dataMap, 0);
      gl.viewport(0, this.fbo.height * startFraction, this.fbo.width, this.fbo.height * (endFraction - startFraction));
      gl.scissor(0, this.fbo.height * startFraction, this.fbo.width, this.fbo.height * (endFraction - startFraction));
      gl.uniform2f(this.heightGenShader.uniforms.verticalViewport, startFraction, endFraction - startFraction);
      indicesPerFace = this.quadVerts.numItems / 6;
      return gl.drawArrays(gl.TRIANGLES, indicesPerFace * faceIndex, indicesPerFace);
    };

    NearMapGenerator.prototype.finalizeMaps = function(maps) {
      var i, _i;
      for (i = _i = 0; _i <= 5; i = ++_i) {
        gl.bindTexture(gl.TEXTURE_2D, maps[i]);
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
      return delete maps[6];
    };

    return NearMapGenerator;

  })();

}).call(this);
