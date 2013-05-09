//@ sourceMappingURL=PlanetNearMesh.map
// Generated by CoffeeScript 1.6.1
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.PlanetNearMesh = (function() {

    function PlanetNearMesh(chunkRes, maxRes) {
      var buff, i, j, n, u, v, v00, v01, v10, v11, wallStart, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _s, _t;
      this.chunkRes = chunkRes;
      this.minRectSize = chunkRes / maxRes;
      this.maxLodError = 0.020;
      this.shader = xgl.loadProgram("planetNearMesh");
      this.shader.uniforms = xgl.getProgramUniforms(this.shader, ["modelViewMat", "projMat", "cubeMat", "lightVec", "sampler", "vertSampler", "detailSampler", "uvRect", "planetColor1", "planetColor2"]);
      this.shader.attribs = xgl.getProgramAttribs(this.shader, ["aUV"]);
      buff = new Float32Array(((this.chunkRes + 1) * (this.chunkRes + 1) + (this.chunkRes + 1) * 4) * 3);
      n = 0;
      for (j = _i = 0, _ref = this.chunkRes; 0 <= _ref ? _i <= _ref : _i >= _ref; j = 0 <= _ref ? ++_i : --_i) {
        for (i = _j = 0, _ref1 = this.chunkRes; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          _ref2 = [i / this.chunkRes, j / this.chunkRes], u = _ref2[0], v = _ref2[1];
          _ref3 = [u, v, 0.0], buff[n] = _ref3[0], buff[n + 1] = _ref3[1], buff[n + 2] = _ref3[2];
          n += 3;
        }
      }
      _ref4 = [0, this.chunkRes];
      for (_k = 0, _len = _ref4.length; _k < _len; _k++) {
        j = _ref4[_k];
        for (i = _l = 0, _ref5 = this.chunkRes; 0 <= _ref5 ? _l <= _ref5 : _l >= _ref5; i = 0 <= _ref5 ? ++_l : --_l) {
          _ref6 = [i / this.chunkRes, j / this.chunkRes], u = _ref6[0], v = _ref6[1];
          _ref7 = [u, v, 1.0], buff[n] = _ref7[0], buff[n + 1] = _ref7[1], buff[n + 2] = _ref7[2];
          n += 3;
        }
      }
      _ref8 = [0, this.chunkRes];
      for (_m = 0, _len1 = _ref8.length; _m < _len1; _m++) {
        i = _ref8[_m];
        for (j = _n = 0, _ref9 = this.chunkRes; 0 <= _ref9 ? _n <= _ref9 : _n >= _ref9; j = 0 <= _ref9 ? ++_n : --_n) {
          _ref10 = [i / this.chunkRes, j / this.chunkRes], u = _ref10[0], v = _ref10[1];
          _ref11 = [u, v, 1.0], buff[n] = _ref11[0], buff[n + 1] = _ref11[1], buff[n + 2] = _ref11[2];
          n += 3;
        }
      }
      this.vBuff = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuff);
      gl.bufferData(gl.ARRAY_BUFFER, buff, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      this.vBuff.itemSize = 3;
      this.vBuff.numItems = buff.length / this.vBuff.itemSize;
      buff = new Uint16Array((this.chunkRes * this.chunkRes + this.chunkRes * 4) * 6);
      n = 0;
      for (j = _o = 0, _ref12 = this.chunkRes - 1; 0 <= _ref12 ? _o <= _ref12 : _o >= _ref12; j = 0 <= _ref12 ? ++_o : --_o) {
        for (i = _p = 0, _ref13 = this.chunkRes - 1; 0 <= _ref13 ? _p <= _ref13 : _p >= _ref13; i = 0 <= _ref13 ? ++_p : --_p) {
          _ref14 = [i + j * (this.chunkRes + 1), i + (j + 1) * (this.chunkRes + 1)], v00 = _ref14[0], v01 = _ref14[1];
          _ref15 = [v00 + 1, v01 + 1], v10 = _ref15[0], v11 = _ref15[1];
          _ref16 = [v00, v10, v11, v00, v11, v01], buff[n] = _ref16[0], buff[n + 1] = _ref16[1], buff[n + 2] = _ref16[2], buff[n + 3] = _ref16[3], buff[n + 4] = _ref16[4], buff[n + 5] = _ref16[5];
          n += 6;
        }
      }
      wallStart = (this.chunkRes + 1) * (this.chunkRes + 1);
      _ref17 = [0, 1];
      for (_q = 0, _len2 = _ref17.length; _q < _len2; _q++) {
        j = _ref17[_q];
        for (i = _r = 0, _ref18 = this.chunkRes - 1; 0 <= _ref18 ? _r <= _ref18 : _r >= _ref18; i = 0 <= _ref18 ? ++_r : --_r) {
          _ref19 = [i + j * this.chunkRes * (this.chunkRes + 1), wallStart + i + j * (this.chunkRes + 1)], v00 = _ref19[0], v01 = _ref19[1];
          _ref20 = [v00 + 1, v01 + 1], v10 = _ref20[0], v11 = _ref20[1];
          if (j === 1) {
            _ref21 = [v00, v10, v11, v00, v11, v01], buff[n] = _ref21[0], buff[n + 1] = _ref21[1], buff[n + 2] = _ref21[2], buff[n + 3] = _ref21[3], buff[n + 4] = _ref21[4], buff[n + 5] = _ref21[5];
          } else {
            _ref22 = [v11, v10, v00, v01, v11, v00], buff[n] = _ref22[0], buff[n + 1] = _ref22[1], buff[n + 2] = _ref22[2], buff[n + 3] = _ref22[3], buff[n + 4] = _ref22[4], buff[n + 5] = _ref22[5];
          }
          n += 6;
        }
      }
      _ref23 = [0, 1];
      for (_s = 0, _len3 = _ref23.length; _s < _len3; _s++) {
        j = _ref23[_s];
        for (i = _t = 0, _ref24 = this.chunkRes - 1; 0 <= _ref24 ? _t <= _ref24 : _t >= _ref24; i = 0 <= _ref24 ? ++_t : --_t) {
          _ref25 = [j * this.chunkRes + i * (this.chunkRes + 1), wallStart + i + (j + 2) * (this.chunkRes + 1)], v00 = _ref25[0], v01 = _ref25[1];
          _ref26 = [v00 + (this.chunkRes + 1), v01 + 1], v10 = _ref26[0], v11 = _ref26[1];
          if (j === 0) {
            _ref27 = [v00, v10, v11, v00, v11, v01], buff[n] = _ref27[0], buff[n + 1] = _ref27[1], buff[n + 2] = _ref27[2], buff[n + 3] = _ref27[3], buff[n + 4] = _ref27[4], buff[n + 5] = _ref27[5];
          } else {
            _ref28 = [v11, v10, v00, v01, v11, v00], buff[n] = _ref28[0], buff[n + 1] = _ref28[1], buff[n + 2] = _ref28[2], buff[n + 3] = _ref28[3], buff[n + 4] = _ref28[4], buff[n + 5] = _ref28[5];
          }
          n += 6;
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

    PlanetNearMesh.prototype.renderInstance = function(camera, planetPos, lightVec, alpha, textureMaps, detailMap, color1, color2) {
      var cubeFace, fullRect, modelViewMat, relCamPos, _i;
      modelViewMat = mat4.create();
      mat4.translate(modelViewMat, modelViewMat, planetPos);
      mat4.mul(modelViewMat, camera.viewMat, modelViewMat);
      gl.uniformMatrix4fv(this.shader.uniforms.projMat, false, camera.projMat);
      gl.uniformMatrix4fv(this.shader.uniforms.modelViewMat, false, modelViewMat);
      gl.uniform3fv(this.shader.uniforms.lightVec, lightVec);
      gl.uniform1f(this.shader.uniforms.alpha, alpha);
      gl.uniform3fv(this.shader.uniforms.planetColor1, color1);
      gl.uniform3fv(this.shader.uniforms.planetColor2, color2);
      relCamPos = vec3.create();
      vec3.sub(relCamPos, planetPos, camera.position);
      gl.uniform3fv(this.shader.uniforms.camPos, relCamPos);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, detailMap);
      gl.uniform1i(this.shader.uniforms.detailSampler, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(this.shader.uniforms.sampler, 0);
      gl.uniform1i(this.shader.uniforms.vertSampler, 0);
      fullRect = new Rect();
      for (cubeFace = _i = 0; _i <= 5; cubeFace = ++_i) {
        gl.bindTexture(gl.TEXTURE_2D, textureMaps[cubeFace]);
        gl.uniformMatrix3fv(this.shader.uniforms.cubeMat, false, cubeFaceMatrix[cubeFace]);
        this.renderChunkRecursive(camera, planetPos, cubeFace, fullRect);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE1);
      return gl.bindTexture(gl.TEXTURE_2D, null);
    };

    PlanetNearMesh.prototype.mapToSphere = function(face, point, height) {
      var pos;
      pos = mapPlaneToCube(point[0], point[1], face);
      vec3.normalize(pos, pos);
      vec3.scale(pos, pos, 0.985 + height * 0.015);
      return pos;
    };

    PlanetNearMesh.prototype.renderChunkRecursive = function(camera, planetPos, face, rect) {
      var a, b, boundingHull, c, center, corner, corners, dist, i, ldiag, mid, p, p0, p1, pdiag, rectSize, screenSpaceError, topPointRadius, v, _i, _j, _k, _l, _len, _ref, _results;
      rectSize = rect.max[0] - rect.min[0];
      corners = rect.getCorners();
      mid = rect.getCenter();
      boundingHull = [];
      center = this.mapToSphere(face, mid, 1.0);
      corner = this.mapToSphere(face, corners[0], 1.0);
      topPointRadius = 1.0 / vec3.dot(center, corner);
      for (i = _i = 0; _i <= 7; i = ++_i) {
        p = this.mapToSphere(face, corners[i % 4], i < 4);
        if (i < 4) {
          vec3.scale(p, p, topPointRadius);
        }
        boundingHull[i] = p;
      }
      for (i = _j = 0; _j <= 3; i = ++_j) {
        _ref = [corners[i % 4], corners[(i + 1) % 4]], a = _ref[0], b = _ref[1];
        c = vec2.create();
        vec2.lerp(c, a, b, 0.5);
        p = this.mapToSphere(face, c, 1);
        vec3.scale(p, p, topPointRadius);
        boundingHull[i + 8] = p;
      }
      p = this.mapToSphere(face, mid, 1.0);
      vec3.scale(p, p, topPointRadius);
      boundingHull[12] = p;
      for (_k = 0, _len = boundingHull.length; _k < _len; _k++) {
        v = boundingHull[_k];
        vec3.add(v, v, planetPos);
      }
      if (!camera.isVisibleVertices(boundingHull)) {
        return;
      }
      vec3.add(center, center, planetPos);
      vec3.sub(center, center, camera.position);
      dist = vec3.length(center);
      dist -= rectSize * 0.5;
      if (dist < 0.0000000001) {
        dist = 0.0000000001;
      }
      p0 = this.mapToSphere(face, corners[0], 1);
      p1 = this.mapToSphere(face, corners[3], 1);
      pdiag = vec3.create();
      vec3.sub(pdiag, p1, p0);
      ldiag = vec3.length(pdiag);
      screenSpaceError = (ldiag / this.chunkRes) / dist;
      if (screenSpaceError < this.maxLodError || rectSize < this.minRectSize * 0.99) {
        return this.renderChunk(face, rect);
      } else {
        _results = [];
        for (i = _l = 0; _l <= 3; i = ++_l) {
          _results.push(this.renderChunkRecursive(camera, planetPos, face, rect.getQuadrant(i)));
        }
        return _results;
      }
    };

    PlanetNearMesh.prototype.renderChunk = function(face, rect) {
      gl.uniform4f(this.shader.uniforms.uvRect, rect.min[0], rect.min[1], rect.max[0] - rect.min[0], rect.max[1] - rect.min[1]);
      return gl.drawElements(gl.TRIANGLES, this.iBuff.numItems, gl.UNSIGNED_SHORT, 0);
    };

    PlanetNearMesh.prototype.startRender = function() {
      gl.useProgram(this.shader);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuff);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuff);
      gl.enableVertexAttribArray(this.shader.attribs.aUV);
      return gl.vertexAttribPointer(this.shader.attribs.aUV, 3, gl.FLOAT, false, this.vBuff.itemSize * 4, 0);
    };

    PlanetNearMesh.prototype.finishRender = function() {
      gl.disableVertexAttribArray(this.shader.attribs.aUV);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      return gl.useProgram(null);
    };

    return PlanetNearMesh;

  })();

}).call(this);
