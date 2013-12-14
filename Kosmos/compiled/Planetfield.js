// Generated by CoffeeScript 1.6.3
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.planetBufferSize = 100;

  root.planetColors = [[[0.9, 0.7, 0.4], [0.6, 0.4, 0.2]], [[0.7, 0.4, 0.0], [0.5, 0.0, 0.0]], [[0.2, 0.6, 0.3], [0.4, 0.3, 0.1]], [[0.562, 0.225, 0.0], [0.375, 0.0, 0.0]], [[1.2, 1.2, 1.5], [0.4, 0.4, 0.7]], [[0.90, 0.95, 1.0], [0.5, 0.5, 0.5]], [[0.0, -50.0, -50.0], [0.0, 10.0, 10.0]], [[0.2, 0.05, 0.2], [0.7, 0.1, 0.7]]];

  root.Planetfield = (function() {
    function Planetfield(_arg) {
      var angle, farMeshRange, generateCallback, i, j, marker, maxOrbitScale, maxPlanetsPerSystem, minOrbitScale, nearMeshRange, planetSize, randAngle, randomStream, spriteRange, starfield, u, v, vi, _i, _j, _ref;
      starfield = _arg.starfield, maxPlanetsPerSystem = _arg.maxPlanetsPerSystem, minOrbitScale = _arg.minOrbitScale, maxOrbitScale = _arg.maxOrbitScale, planetSize = _arg.planetSize, nearMeshRange = _arg.nearMeshRange, farMeshRange = _arg.farMeshRange, spriteRange = _arg.spriteRange;
      this._starfield = starfield;
      this._planetBufferSize = root.planetBufferSize;
      this.nearMeshRange = nearMeshRange;
      this.farMeshRange = farMeshRange;
      this.spriteRange = spriteRange;
      this.spriteNearRange = nearMeshRange * 0.25;
      this.planetSize = planetSize;
      this.maxPlanetsPerSystem = maxPlanetsPerSystem;
      this.minOrbitScale = minOrbitScale;
      this.maxOrbitScale = maxOrbitScale;
      this.closestPlanetDist = null;
      this.closestPlanet = null;
      this.closestStarDist = null;
      this.closestStar = null;
      randomStream = new RandomStream(universeSeed);
      this.shader = xgl.loadProgram("planetfield");
      this.shader.uniforms = xgl.getProgramUniforms(this.shader, ["modelViewMat", "projMat", "spriteSizeAndViewRangeAndBlur"]);
      this.shader.attribs = xgl.getProgramAttribs(this.shader, ["aPos", "aUV"]);
      this.iBuff = this._starfield.iBuff;
      if (this._planetBufferSize * 6 > this.iBuff.numItems) {
        console.log("Warning: planetBufferSize should not be larger than starBufferSize. Setting planetBufferSize = starBufferSize.");
        this._planetBufferSize = this.iBuff.numItems;
      }
      this.buff = new Float32Array(this._planetBufferSize * 4 * 6);
      j = 0;
      for (i = _i = 0, _ref = this._planetBufferSize - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        randAngle = randomStream.range(0, Math.PI * 2);
        for (vi = _j = 0; _j <= 3; vi = ++_j) {
          angle = ((vi - 0.5) / 2.0) * Math.PI + randAngle;
          u = Math.sin(angle) * Math.sqrt(2) * 0.5;
          v = Math.cos(angle) * Math.sqrt(2) * 0.5;
          marker = vi <= 1 ? 1 : -1;
          this.buff[j + 3] = u;
          this.buff[j + 4] = v;
          this.buff[j + 5] = marker;
          j += 6;
        }
      }
      this.vBuff = gl.createBuffer();
      this.vBuff.itemSize = 6;
      this.vBuff.numItems = this._planetBufferSize * 4;
      this.farMesh = new PlanetFarMesh(8);
      this.farMapGen = new FarMapGenerator(256);
      generateCallback = (function(t) {
        return function(seed, partial) {
          return t.farGenerateCallback(seed, partial);
        };
      })(this);
      this.farMapCache = new ContentCache(16, generateCallback);
      this.nearMesh = new PlanetNearMesh(64, 4096);
      this.nearMapGen = new NearMapGenerator(4096);
      generateCallback = (function(t) {
        return function(seed, partial) {
          return t.nearGenerateCallback(seed, partial);
        };
      })(this);
      this.nearMapCache = new ContentCache(4, generateCallback);
      this.detailMapTex = null;
      this.detailMapTime = 5;
      this.progressiveLoadSteps = 128.0;
      this.loadingHurryFactor = 1.0;
    }

    Planetfield.prototype.farGenerateCallback = function(seed, partial) {
      return [true, this.farMapGen.generate(seed)];
    };

    Planetfield.prototype.nearGenerateCallback = function(seed, partial) {
      var face, maps, progress, progressPlusOne;
      if (partial === null) {
        progress = 0.0;
        maps = this.nearMapGen.createMaps();
        face = 0;
        console.log("Loading high res maps for planet " + seed);
      } else {
        progress = partial.progress;
        maps = partial.maps;
        face = partial.face;
      }
      if (progress < 1.0 - 0.0000001) {
        progressPlusOne = progress + (2.0 / this.progressiveLoadSteps) * this.loadingHurryFactor;
        if (progressPlusOne > 1.0) {
          progressPlusOne = 1.0;
        }
        this.nearMapGen.generateSubMap(maps, seed, face, progress, progressPlusOne);
      } else {
        progressPlusOne = progress + 16 * (2.0 / this.progressiveLoadSteps) * this.loadingHurryFactor;
        if (progressPlusOne > 2.0) {
          progressPlusOne = 2.0;
        }
        this.nearMapGen.generateSubFinalMap(maps, seed, face, progress - 1.0, progressPlusOne - 1.0);
      }
      if (progressPlusOne >= 2.0 - 0.0000001) {
        face++;
        progress = 0;
      } else {
        progress = progressPlusOne;
      }
      if (face >= 6) {
        this.nearMapGen.finalizeMaps(maps);
        console.log("Done loading high res maps for planet " + seed + "!");
        return [true, maps];
      } else {
        return [
          false, {
            maps: maps,
            progress: progress,
            face: face
          }
        ];
      }
    };

    Planetfield.prototype.isLoadingComplete = function() {
      return this.nearMapCache.isUpToDate() && this.farMapCache.isUpToDate() && this.detailMapTex !== null;
    };

    Planetfield.prototype.setPlanetSprite = function(index, position) {
      var j, vi, _i, _results;
      j = index * 6 * 4;
      _results = [];
      for (vi = _i = 0; _i <= 3; vi = ++_i) {
        this.buff[j] = position[0];
        this.buff[j + 1] = position[1];
        this.buff[j + 2] = position[2];
        _results.push(j += 6);
      }
      return _results;
    };

    Planetfield.prototype.render = function(camera, originOffset, blur) {
      var detailMapGen, nearestPlanetDist;
      this.starList = this._starfield.queryStars(camera.position, originOffset, this.spriteRange);
      this.starList.sort(function(_arg, _arg1) {
        var aw, ax, ay, az, cw, cx, cy, cz;
        ax = _arg[0], ay = _arg[1], az = _arg[2], aw = _arg[3];
        cx = _arg1[0], cy = _arg1[1], cz = _arg1[2], cw = _arg1[3];
        return (ax * ax + ay * ay + az * az) - (cx * cx + cy * cy + cz * cz);
      });
      this.generatePlanetPositions();
      this.calculateLightSource();
      this.renderSprites(camera, originOffset, blur);
      this.renderFarMeshes(camera, originOffset);
      this.renderNearMeshes(camera, originOffset);
      nearestPlanetDist = this.getDistanceToClosestPlanet();
      this._oldHurry = this.loadingHurryFactor;
      if (nearestPlanetDist < 2.0) {
        this.loadingHurryFactor = 4.0;
      } else if (nearestPlanetDist < 5.0) {
        this.loadingHurryFactor = 2.0;
      } else {
        this.loadingHurryFactor = 1.0;
      }
      this.farMapGen.start();
      this.farMapCache.update(1);
      this.farMapGen.finish();
      this.nearMapGen.start();
      this.nearMapCache.update(1);
      this.nearMapGen.finish();
      if (this.detailMapTex === null) {
        if (this.detailMapTime <= 0) {
          console.log("Generating detail maps");
          detailMapGen = new DetailMapGenerator(512);
          this.detailMapTex = detailMapGen.generate();
          return console.log("Done generating detail maps");
        } else {
          return this.detailMapTime--;
        }
      }
    };

    Planetfield.prototype.getDistanceToClosestPlanet = function() {
      return Math.max(this.closestPlanetDist - 0.985, 0.0) || this._starfield.viewRange;
    };

    Planetfield.prototype.getDistanceToClosestStar = function() {
      return Math.max(this.closestStarDist - 100.0, 100) || this._starfield.viewRange;
    };

    Planetfield.prototype.getDistanceToClosestObject = function() {
      return Math.min(this.getDistanceToClosestPlanet(), this.getDistanceToClosestStar());
    };

    Planetfield.prototype.getClosestStar = function() {
      return this.closestStar;
    };

    Planetfield.prototype.getClosestPlanet = function() {
      return this.closestPlanet;
    };

    Planetfield.prototype.generatePlanetPositions = function() {
      var alpha, angle, dist, dx, dy, dz, i, numMeshPlanets, pw, radius, randomStream, starDist, systemPlanets, w, x, y, z, _i, _j, _len, _ref, _ref1, _ref2;
      randomStream = new RandomStream();
      this.numPlanets = 0;
      this.meshPlanets = [];
      numMeshPlanets = 0;
      this.closestPlanetDist = null;
      this.closestPlanet = null;
      this.closestStarDist = null;
      this.closestStar = null;
      _ref = this.starList;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], dx = _ref1[0], dy = _ref1[1], dz = _ref1[2], w = _ref1[3];
        randomStream.seed = Math.floor(w * 1000000);
        systemPlanets = randomStream.intRange(0, this.maxPlanetsPerSystem);
        if (this.numPlanets + systemPlanets > this._planetBufferSize) {
          break;
        }
        for (i = _j = 1; 1 <= systemPlanets ? _j <= systemPlanets : _j >= systemPlanets; i = 1 <= systemPlanets ? ++_j : --_j) {
          radius = this._starfield.starSize * randomStream.range(this.minOrbitScale, this.maxOrbitScale);
          angle = randomStream.radianAngle();
          _ref2 = [dx + radius * Math.sin(angle), dy + radius * Math.cos(angle), dz + w * Math.sin(angle)], x = _ref2[0], y = _ref2[1], z = _ref2[2];
          dist = Math.sqrt(x * x + y * y + z * z);
          alpha = 2.0 - (dist / this.farMeshRange) * 0.5;
          pw = randomStream.unit();
          if (alpha > 0.001) {
            this.meshPlanets[numMeshPlanets] = [x, y, z, pw, alpha];
            numMeshPlanets++;
          }
          this.setPlanetSprite(this.numPlanets, [x, y, z]);
          this.numPlanets++;
          if (this.closestPlanet === null || dist < this.closestPlanetDist) {
            this.closestPlanet = [x, y, z];
            this.closestPlanetDist = dist;
          }
        }
        starDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (this.closestStar === null || starDist < this.closestStarDist) {
          this.closestStar = [dx, dy, dz];
          this.closestStarDist = starDist;
        }
      }
      if (this.meshPlanets && this.meshPlanets.length > 0) {
        return this.meshPlanets.sort(function(_arg, _arg1) {
          var ak, aw, ax, ay, az, ck, cw, cx, cy, cz;
          ax = _arg[0], ay = _arg[1], az = _arg[2], aw = _arg[3], ak = _arg[4];
          cx = _arg1[0], cy = _arg1[1], cz = _arg1[2], cw = _arg1[3], ck = _arg1[4];
          return (ax * ax + ay * ay + az * az) - (cx * cx + cy * cy + cz * cz);
        });
      }
    };

    Planetfield.prototype.calculateLightSource = function() {
      var i, lightPos, star, _i, _results;
      if (this.starList.length < 1) {
        return;
      }
      this.lightCenter = vec3.fromValues(this.starList[0][0], this.starList[0][1], this.starList[0][2]);
      _results = [];
      for (i = _i = 1; _i <= 2; i = ++_i) {
        star = this.starList[i];
        if (star == null) {
          break;
        }
        lightPos = vec3.fromValues(star[0], star[1], star[2]);
        if (Math.abs(1.0 - (vec3.distance(lightPos, this.lightCenter) / vec3.length(this.lightCenter))) < 0.5) {
          vec3.scale(this.lightCenter, this.lightCenter, 0.75);
          vec3.scale(lightPos, lightPos, 0.25);
          _results.push(vec3.add(this.lightCenter, this.lightCenter, lightPos));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Planetfield.prototype.renderFarMeshes = function(camera, originOffset) {
      var alpha, colorIndex, distSq, globalPos, i, lightVec, localPos, nearDistSq, nearTextureMap, planetColor1, planetColor2, seed, textureMap, visible, w, x, y, z, _i, _ref, _ref1, _ref2, _ref3;
      if (!this.meshPlanets || this.meshPlanets.length === 0 || this.starList.length === 0) {
        return;
      }
      camera.far = this.farMeshRange * 5.0;
      camera.near = this.nearMeshRange * 0.00001;
      camera.update();
      this.farMesh.startRender();
      nearDistSq = this.nearMeshRange * this.nearMeshRange;
      _ref = [vec3.create(), vec3.create(), vec3.create()], localPos = _ref[0], globalPos = _ref[1], lightVec = _ref[2];
      for (i = _i = _ref1 = this.meshPlanets.length - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; i = _ref1 <= 0 ? ++_i : --_i) {
        _ref2 = this.meshPlanets[i], x = _ref2[0], y = _ref2[1], z = _ref2[2], w = _ref2[3], alpha = _ref2[4];
        seed = Math.floor(w * 1000000000);
        distSq = x * x + y * y + z * z;
        visible = (distSq >= nearDistSq) || (i !== 0);
        if (!visible) {
          nearTextureMap = this.nearMapCache.getContent(seed);
          if (!nearTextureMap) {
            visible = true;
          }
        }
        if (visible) {
          localPos = vec3.fromValues(x, y, z);
          vec3.add(globalPos, localPos, camera.position);
          vec3.subtract(lightVec, this.lightCenter, localPos);
          vec3.normalize(lightVec, lightVec);
          textureMap = this.farMapCache.getContent(seed);
          if (textureMap) {
            colorIndex = seed % planetColors.length;
            _ref3 = planetColors[colorIndex], planetColor1 = _ref3[0], planetColor2 = _ref3[1];
            this.farMesh.renderInstance(camera, globalPos, lightVec, alpha, textureMap, planetColor1, planetColor2);
          }
        }
      }
      return this.farMesh.finishRender();
    };

    Planetfield.prototype.renderNearMeshes = function(camera, originOffset) {
      var alpha, colorIndex, dist, distSq, dummy, globalPos, i, lightVec, localPos, minNear, nearDistSq, planetColor1, planetColor2, seed, textureMap, w, x, y, z, _i, _len, _ref, _ref1, _ref2, _ref3;
      if (!this.meshPlanets || this.meshPlanets.length === 0 || this.starList.length === 0) {
        return;
      }
      this.nearMesh.startRender();
      nearDistSq = this.nearMeshRange * this.nearMeshRange;
      _ref = [vec3.create(), vec3.create(), vec3.create()], localPos = _ref[0], globalPos = _ref[1], lightVec = _ref[2];
      _ref1 = [0];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        i = _ref1[_i];
        _ref2 = this.meshPlanets[i], x = _ref2[0], y = _ref2[1], z = _ref2[2], w = _ref2[3], alpha = _ref2[4];
        distSq = x * x + y * y + z * z;
        if (distSq < nearDistSq && i === 0) {
          dist = Math.sqrt(distSq);
          camera.far = dist * 1.733 + 1.0;
          camera.near = dist / 1.733 - 1.0;
          minNear = 0.000001 + Math.max(dist - 1.0, 0.0) * 0.1;
          if (camera.near <= minNear) {
            camera.near = minNear;
          }
          camera.update();
          localPos = vec3.fromValues(x, y, z);
          vec3.add(globalPos, localPos, camera.position);
          vec3.subtract(lightVec, this.lightCenter, localPos);
          vec3.normalize(lightVec, lightVec);
          seed = Math.floor(w * 1000000000);
          textureMap = this.nearMapCache.getContent(seed);
          if (textureMap) {
            colorIndex = seed % planetColors.length;
            _ref3 = planetColors[colorIndex], planetColor1 = _ref3[0], planetColor2 = _ref3[1];
            this.nearMesh.renderInstance(camera, globalPos, lightVec, alpha, textureMap, this.detailMapTex, planetColor1, planetColor2);
          }
          dummy = this.farMapCache.getContent(seed);
        }
      }
      return this.nearMesh.finishRender();
    };

    Planetfield.prototype.renderSprites = function(camera, originOffset, blur) {
      var modelViewMat, seed;
      if (this.numPlanets <= 0) {
        return;
      }
      camera.far = this.spriteRange * 1.1;
      camera.near = this.spriteNearRange * 0.9;
      camera.update();
      this._startRenderSprites();
      gl.bufferData(gl.ARRAY_BUFFER, this.buff, gl.DYNAMIC_DRAW);
      this.vBuff.usedItems = Math.floor(this.vBuff.usedItems);
      if (this.vBuff.usedItems <= 0) {
        return;
      }
      seed = Math.floor(Math.abs(seed));
      modelViewMat = mat4.create();
      mat4.translate(modelViewMat, modelViewMat, camera.position);
      mat4.mul(modelViewMat, camera.viewMat, modelViewMat);
      gl.uniformMatrix4fv(this.shader.uniforms.projMat, false, camera.projMat);
      gl.uniformMatrix4fv(this.shader.uniforms.modelViewMat, false, modelViewMat);
      gl.uniform4f(this.shader.uniforms.spriteSizeAndViewRangeAndBlur, this.planetSize * 10.0, this.spriteNearRange, this.spriteRange, blur);
      gl.drawElements(gl.TRIANGLES, this.numPlanets * 6, gl.UNSIGNED_SHORT, 0);
      return this._finishRenderSprites();
    };

    Planetfield.prototype._startRenderSprites = function() {
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.depthMask(false);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(this.shader);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuff);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuff);
      gl.enableVertexAttribArray(this.shader.attribs.aPos);
      gl.vertexAttribPointer(this.shader.attribs.aPos, 3, gl.FLOAT, false, this.vBuff.itemSize * 4, 0);
      gl.enableVertexAttribArray(this.shader.attribs.aUV);
      return gl.vertexAttribPointer(this.shader.attribs.aUV, 3, gl.FLOAT, false, this.vBuff.itemSize * 4, 4 * 3);
    };

    Planetfield.prototype._finishRenderSprites = function() {
      gl.disableVertexAttribArray(this.shader.attribs.aPos);
      gl.disableVertexAttribArray(this.shader.attribs.aUV);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.useProgram(null);
      gl.disable(gl.BLEND);
      gl.depthMask(true);
      gl.enable(gl.DEPTH_TEST);
      return gl.enable(gl.CULL_FACE);
    };

    return Planetfield;

  })();

}).call(this);

/*
//@ sourceMappingURL=Planetfield.map
*/
