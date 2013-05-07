//@ sourceMappingURL=Starfield.map
// Generated by CoffeeScript 1.6.1
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.universeSeed = 31415;

  root.starBufferSize = 10000;

  root.Starfield = (function() {

    function Starfield(_arg) {
      var angle, blockMaxStars, blockMinStars, blockScale, buff, i, j, k, marker, pos, randAngle, randomStream, starPositions, starSize, u, v, vi, viewRange, w, x, y, z, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3, _ref4;
      blockMinStars = _arg.blockMinStars, blockMaxStars = _arg.blockMaxStars, blockScale = _arg.blockScale, starSize = _arg.starSize, viewRange = _arg.viewRange;
      this._starBufferSize = root.starBufferSize;
      this.blockMinStars = blockMinStars;
      this.blockMaxStars = blockMaxStars;
      this.blockScale = blockScale;
      this.viewRange = viewRange;
      this.starSize = starSize;
      randomStream = new RandomStream(universeSeed);
      console.log("Generating star data...");
      this.shader = xgl.loadProgram("starfield");
      this.shader.uniforms = xgl.getProgramUniforms(this.shader, ["modelViewMat", "projMat", "starSizeAndViewRangeAndBlur"]);
      this.shader.attribs = xgl.getProgramAttribs(this.shader, ["aPos", "aUV"]);
      starPositions = [];
      for (i = _i = 0, _ref = this._starBufferSize - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        pos = [randomStream.unit(), randomStream.unit(), randomStream.unit(), randomStream.unit()];
        starPositions[i] = pos;
      }
      buff = new Float32Array(this._starBufferSize * 4 * 7);
      j = 0;
      for (i = _j = 0, _ref1 = this._starBufferSize - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        _ref2 = starPositions[i], x = _ref2[0], y = _ref2[1], z = _ref2[2], w = _ref2[3];
        randAngle = randomStream.range(0, Math.PI * 2);
        for (vi = _k = 0; _k <= 3; vi = ++_k) {
          angle = ((vi - 0.5) / 2.0) * Math.PI + randAngle;
          u = Math.sin(angle) * Math.sqrt(2) * 0.5;
          v = Math.cos(angle) * Math.sqrt(2) * 0.5;
          marker = vi <= 1 ? 1 : -1;
          buff[j] = x;
          buff[j + 1] = y;
          buff[j + 2] = z;
          buff[j + 3] = w;
          buff[j + 4] = u;
          buff[j + 5] = v;
          buff[j + 6] = marker;
          j += 7;
        }
      }
      this.vBuff = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuff);
      gl.bufferData(gl.ARRAY_BUFFER, buff, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      this.vBuff.itemSize = 7;
      this.vBuff.numItems = this._starBufferSize * 4;
      buff = new Uint16Array(this._starBufferSize * 6);
      for (i = _l = 0, _ref3 = this._starBufferSize - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
        _ref4 = [i * 6, i * 4], j = _ref4[0], k = _ref4[1];
        buff[j] = k + 0;
        buff[j + 1] = k + 1;
        buff[j + 2] = k + 2;
        buff[j + 3] = k + 0;
        buff[j + 4] = k + 2;
        buff[j + 5] = k + 3;
      }
      this.iBuff = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuff);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, buff, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      this.iBuff.itemSize = 1;
      this.iBuff.numItems = this._starBufferSize * 6;
      if (this.iBuff.numItems >= 0xFFFF) {
        xgl.error("Index buffer too large for StarField");
      }
      this._catalogStars(starPositions);
      console.log("Generated.");
    }

    Starfield.prototype._catalogStars = function(starPositions) {
      var i, index, j, k, list, w, x, y, z, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3, _ref4, _results;
      this.starPosTableSize = 5;
      this.starPosTable = [];
      for (i = _i = 0, _ref = this.starPosTableSize - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.starPosTable[i] = [];
        for (j = _j = 0, _ref1 = this.starPosTableSize - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          this.starPosTable[i][j] = [];
          for (k = _k = 0, _ref2 = this.starPosTableSize - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; k = 0 <= _ref2 ? ++_k : --_k) {
            this.starPosTable[i][j][k] = [];
          }
        }
      }
      _results = [];
      for (index = _l = 0, _ref3 = this._starBufferSize - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; index = 0 <= _ref3 ? ++_l : --_l) {
        _ref4 = starPositions[index], x = _ref4[0], y = _ref4[1], z = _ref4[2], w = _ref4[3];
        i = Math.floor(x * this.starPosTableSize);
        j = Math.floor(y * this.starPosTableSize);
        k = Math.floor(z * this.starPosTableSize);
        list = this.starPosTable[i][j][k];
        _results.push(list[list.length] = [index, x, y, z, w]);
      }
      return _results;
    };

    Starfield.prototype.queryStars = function(position, originOffset, radius) {
      var bpos, ci, cj, ck, i, j, k, li, lj, lk, minDist, partialQuery, queryResult, r, randStream, seed, ti, tj, tk, x, y, z, _i, _j, _k, _ref, _ref1, _ref2, _ref3;
      queryResult = [];
      _ref = [originOffset[0] / this.blockScale + position[0] / this.blockScale, originOffset[1] / this.blockScale + position[1] / this.blockScale, originOffset[2] / this.blockScale + position[2] / this.blockScale], ti = _ref[0], tj = _ref[1], tk = _ref[2];
      _ref1 = [Math.floor(ti), Math.floor(tj), Math.floor(tk)], ci = _ref1[0], cj = _ref1[1], ck = _ref1[2];
      _ref2 = [ci - ti, cj - tj, ck - tk], li = _ref2[0], lj = _ref2[1], lk = _ref2[2];
      randStream = new root.RandomStream();
      r = Math.ceil(radius / this.blockScale);
      for (i = _i = -r; -r <= +r ? _i <= +r : _i >= +r; i = -r <= +r ? ++_i : --_i) {
        for (j = _j = -r; -r <= +r ? _j <= +r : _j >= +r; j = -r <= +r ? ++_j : --_j) {
          for (k = _k = -r; -r <= +r ? _k <= +r : _k >= +r; k = -r <= +r ? ++_k : --_k) {
            _ref3 = [i + li, j + lj, k + lk], x = _ref3[0], y = _ref3[1], z = _ref3[2];
            bpos = vec3.fromValues((x + 0.5) * this.blockScale, (y + 0.5) * this.blockScale, (z + 0.5) * this.blockScale);
            minDist = vec3.distance(position, bpos) - this.blockScale * 0.8660254;
            if (minDist <= radius) {
              seed = randomIntFromSeed(randomIntFromSeed(randomIntFromSeed(i + ci) + (j + cj)) + (k + ck));
              randStream.seed = seed;
              partialQuery = this._queryBlock(seed, randStream.intRange(this.blockMinStars, this.blockMaxStars), [x, y, z], radius / this.blockScale);
              queryResult = queryResult.concat(partialQuery);
            }
          }
        }
      }
      return queryResult;
    };

    Starfield.prototype._queryBlock = function(seed, starCount, blockOffset, blockRadius) {
      var beginI, blockSize, bpos, distSq, dx, dy, dz, endI, i, index, j, k, minDist, offset, queryResult, radiusSq, starList, w, x, y, z, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      queryResult = [];
      blockSize = 1.0 / this.starPosTableSize;
      _ref = this._getStarBufferOffsetAndCount(seed, starCount), offset = _ref[0], starCount = _ref[1];
      _ref1 = [offset, offset + starCount - 1], beginI = _ref1[0], endI = _ref1[1];
      radiusSq = blockRadius * blockRadius;
      for (i = _i = 0, _ref2 = this.starPosTableSize - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        for (j = _j = 0, _ref3 = this.starPosTableSize - 1; 0 <= _ref3 ? _j <= _ref3 : _j >= _ref3; j = 0 <= _ref3 ? ++_j : --_j) {
          for (k = _k = 0, _ref4 = this.starPosTableSize - 1; 0 <= _ref4 ? _k <= _ref4 : _k >= _ref4; k = 0 <= _ref4 ? ++_k : --_k) {
            bpos = [(i + 0.5) * blockSize + blockOffset[0], (j + 0.5) * blockSize + blockOffset[1], (k + 0.5) * blockSize + blockOffset[2]];
            minDist = vec3.length(bpos) - blockSize * 0.8660254;
            if (minDist <= blockRadius) {
              starList = this.starPosTable[i][j][k];
              for (_l = 0, _len = starList.length; _l < _len; _l++) {
                _ref5 = starList[_l], index = _ref5[0], x = _ref5[1], y = _ref5[2], z = _ref5[3], w = _ref5[4];
                if (index >= beginI && index <= endI) {
                  dx = x + blockOffset[0];
                  dy = y + blockOffset[1];
                  dz = z + blockOffset[2];
                  distSq = dx * dx + dy * dy + dz * dz;
                  if (distSq <= radiusSq) {
                    queryResult[queryResult.length] = [dx * this.blockScale, dy * this.blockScale, dz * this.blockScale, w];
                  }
                }
              }
            }
          }
        }
      }
      return queryResult;
    };

    Starfield.prototype.render = function(camera, originOffset, blur) {
      var bpos, ci, cj, ck, i, j, k, li, lj, lk, minDist, r, randStream, seed, x, y, z, _i, _j, _k, _ref, _ref1, _ref2;
      camera.far = this.viewRange * 1.1;
      camera.near = this.viewRange / 50000.0;
      camera.update();
      this._startRender();
      this.blur = blur;
      _ref = [Math.floor(camera.position[0] / this.blockScale + originOffset[0] / this.blockScale), Math.floor(camera.position[1] / this.blockScale + originOffset[1] / this.blockScale), Math.floor(camera.position[2] / this.blockScale + originOffset[2] / this.blockScale)], ci = _ref[0], cj = _ref[1], ck = _ref[2];
      _ref1 = [ci - originOffset[0] / this.blockScale, cj - originOffset[1] / this.blockScale, ck - originOffset[2] / this.blockScale], li = _ref1[0], lj = _ref1[1], lk = _ref1[2];
      randStream = new root.RandomStream();
      r = Math.ceil(this.viewRange / this.blockScale);
      for (i = _i = -r; -r <= +r ? _i <= +r : _i >= +r; i = -r <= +r ? ++_i : --_i) {
        for (j = _j = -r; -r <= +r ? _j <= +r : _j >= +r; j = -r <= +r ? ++_j : --_j) {
          for (k = _k = -r; -r <= +r ? _k <= +r : _k >= +r; k = -r <= +r ? ++_k : --_k) {
            _ref2 = [i + li, j + lj, k + lk], x = _ref2[0], y = _ref2[1], z = _ref2[2];
            bpos = vec3.fromValues((x + 0.5) * this.blockScale, (y + 0.5) * this.blockScale, (z + 0.5) * this.blockScale);
            minDist = vec3.distance(camera.position, bpos) - this.blockScale * 0.8660254;
            if (minDist <= this.viewRange) {
              seed = randomIntFromSeed(randomIntFromSeed(randomIntFromSeed(i + ci) + (j + cj)) + (k + ck));
              randStream.seed = seed;
              this._renderBlock(camera, seed, randStream.intRange(this.blockMinStars, this.blockMaxStars), x, y, z);
            }
          }
        }
      }
      return this._finishRender();
    };

    Starfield.prototype._startRender = function() {
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.depthMask(false);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(this.shader);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuff);
      gl.enableVertexAttribArray(this.shader.attribs.aPos);
      gl.vertexAttribPointer(this.shader.attribs.aPos, 4, gl.FLOAT, false, this.vBuff.itemSize * 4, 0);
      gl.enableVertexAttribArray(this.shader.attribs.aUV);
      gl.vertexAttribPointer(this.shader.attribs.aUV, 3, gl.FLOAT, false, this.vBuff.itemSize * 4, 4 * 4);
      return gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuff);
    };

    Starfield.prototype._finishRender = function() {
      gl.disableVertexAttribArray(this.shader.attribs.aPos);
      gl.disableVertexAttribArray(this.shader.attribs.aUV);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.useProgram(null);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      return gl.disable(gl.BLEND);
    };

    Starfield.prototype._getStarBufferOffsetAndCount = function(seed, starCount) {
      var offset;
      starCount = Math.floor(starCount);
      if (starCount <= 0) {
        return;
      }
      seed = Math.floor(Math.abs(seed));
      if (starCount * 6 > this.iBuff.numItems) {
        starCount = this.iBuff.numItems / 6;
        console.log("Warning: Too many stars requested of starfield block render operation");
      }
      if (this._starBufferSize > starCount) {
        offset = ((seed + 127) * 65537) % (1 + this._starBufferSize - starCount);
      } else {
        offset = 0;
      }
      return [offset, starCount];
    };

    Starfield.prototype._renderBlock = function(camera, seed, starCount, i, j, k) {
      var box, modelViewMat, offset, _ref;
      box = new Box();
      box.min = vec3.fromValues(i * this.blockScale, j * this.blockScale, k * this.blockScale);
      box.max = vec3.fromValues((i + 1) * this.blockScale, (j + 1) * this.blockScale, (k + 1) * this.blockScale);
      if (!camera.isVisibleBox(box)) {
        return;
      }
      _ref = this._getStarBufferOffsetAndCount(seed, starCount), offset = _ref[0], starCount = _ref[1];
      modelViewMat = mat4.create();
      mat4.scale(modelViewMat, modelViewMat, vec3.fromValues(this.blockScale, this.blockScale, this.blockScale));
      mat4.translate(modelViewMat, modelViewMat, vec3.fromValues(i, j, k));
      mat4.mul(modelViewMat, camera.viewMat, modelViewMat);
      gl.uniformMatrix4fv(this.shader.uniforms.projMat, false, camera.projMat);
      gl.uniformMatrix4fv(this.shader.uniforms.modelViewMat, false, modelViewMat);
      gl.uniform3f(this.shader.uniforms.starSizeAndViewRangeAndBlur, this.starSize * 10.0, this.viewRange, this.blur);
      return gl.drawElements(gl.TRIANGLES, starCount * 6, gl.UNSIGNED_SHORT, 2 * 6 * offset);
    };

    return Starfield;

  })();

}).call(this);
