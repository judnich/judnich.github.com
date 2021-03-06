// Generated by CoffeeScript 1.6.3
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.PlanetFarMesh = (function() {
    function PlanetFarMesh(geomRes) {
      var buff, face, faceOffset, i, j, n, pixelSize, pos, u, v, v00, v01, v10, v11, _i, _j, _k, _l, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      this.geomRes = geomRes;
      this.shader = xgl.loadProgram("planetFarMesh");
      this.shader.uniforms = xgl.getProgramUniforms(this.shader, ["modelViewMat", "projMat", "lightVec", "sampler", "alpha", "planetColor1", "planetColor2"]);
      this.shader.attribs = xgl.getProgramAttribs(this.shader, ["aPos", "aUV"]);
      buff = new Float32Array(6 * (this.geomRes + 1) * (this.geomRes + 1) * 5);
      n = 0;
      pixelSize = 1.0 / 512.0;
      for (face = _i = 0; _i <= 5; face = ++_i) {
        for (j = _j = 0, _ref = this.geomRes; 0 <= _ref ? _j <= _ref : _j >= _ref; j = 0 <= _ref ? ++_j : --_j) {
          for (i = _k = 0, _ref1 = this.geomRes; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
            _ref2 = [i / this.geomRes, j / this.geomRes], u = _ref2[0], v = _ref2[1];
            pos = mapPlaneToCube(u, v, face);
            vec3.normalize(pos, pos);
            buff[n] = pos[0];
            buff[n + 1] = pos[1];
            buff[n + 2] = pos[2];
            buff[n + 3] = (u * (1 - 2 * pixelSize) + pixelSize + face) / 6;
            buff[n + 4] = v;
            n += 5;
          }
        }
      }
      this.vBuff = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuff);
      gl.bufferData(gl.ARRAY_BUFFER, buff, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      this.vBuff.itemSize = 5;
      this.vBuff.numItems = buff.length / this.vBuff.itemSize;
      buff = new Uint16Array(6 * this.geomRes * this.geomRes * 6);
      n = 0;
      for (face = _l = 0; _l <= 5; face = ++_l) {
        faceOffset = (this.geomRes + 1) * (this.geomRes + 1) * face;
        for (j = _m = 0, _ref3 = this.geomRes - 1; 0 <= _ref3 ? _m <= _ref3 : _m >= _ref3; j = 0 <= _ref3 ? ++_m : --_m) {
          for (i = _n = 0, _ref4 = this.geomRes - 1; 0 <= _ref4 ? _n <= _ref4 : _n >= _ref4; i = 0 <= _ref4 ? ++_n : --_n) {
            _ref5 = [i + j * (this.geomRes + 1) + faceOffset, i + (j + 1) * (this.geomRes + 1) + faceOffset], v00 = _ref5[0], v01 = _ref5[1];
            _ref6 = [v00 + 1, v01 + 1], v10 = _ref6[0], v11 = _ref6[1];
            buff[n] = v00;
            buff[n + 1] = v10;
            buff[n + 2] = v11;
            buff[n + 3] = v00;
            buff[n + 4] = v11;
            buff[n + 5] = v01;
            n += 6;
          }
        }
      }
      this.iBuff = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuff);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, buff, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      this.iBuff.itemSize = 1;
      this.iBuff.numItems = buff.length / this.iBuff.itemSize;
      if (this.iBuff.numItems >= 0xFFFF) {
        xgl.error("Index buffer too large in low res planet geometry");
      }
    }

    PlanetFarMesh.prototype.renderInstance = function(camera, posVec, lightVec, alpha, textureMap, color1, color2) {
      var modelViewMat;
      modelViewMat = mat4.create();
      mat4.translate(modelViewMat, modelViewMat, posVec);
      mat4.mul(modelViewMat, camera.viewMat, modelViewMat);
      gl.uniformMatrix4fv(this.shader.uniforms.projMat, false, camera.projMat);
      gl.uniformMatrix4fv(this.shader.uniforms.modelViewMat, false, modelViewMat);
      gl.uniform3fv(this.shader.uniforms.lightVec, lightVec);
      gl.uniform1f(this.shader.uniforms.alpha, alpha);
      gl.uniform3fv(this.shader.uniforms.planetColor1, color1);
      gl.uniform3fv(this.shader.uniforms.planetColor2, color2);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureMap);
      gl.uniform1i(this.shader.uniforms.sampler, 0);
      gl.drawElements(gl.TRIANGLES, this.iBuff.numItems, gl.UNSIGNED_SHORT, 0);
      return gl.bindTexture(gl.TEXTURE_2D, null);
    };

    PlanetFarMesh.prototype.startRender = function() {
      gl.disable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(this.shader);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuff);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuff);
      gl.enableVertexAttribArray(this.shader.attribs.aPos);
      gl.vertexAttribPointer(this.shader.attribs.aPos, 3, gl.FLOAT, false, this.vBuff.itemSize * 4, 0);
      gl.enableVertexAttribArray(this.shader.attribs.aUV);
      return gl.vertexAttribPointer(this.shader.attribs.aUV, 2, gl.FLOAT, false, this.vBuff.itemSize * 4, 4 * 3);
    };

    PlanetFarMesh.prototype.finishRender = function() {
      gl.disableVertexAttribArray(this.shader.attribs.aPos);
      gl.disableVertexAttribArray(this.shader.attribs.aUV);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.useProgram(null);
      gl.disable(gl.BLEND);
      gl.depthMask(true);
      return gl.enable(gl.DEPTH_TEST);
    };

    return PlanetFarMesh;

  })();

}).call(this);

/*
//@ sourceMappingURL=PlanetFarMesh.map
*/
