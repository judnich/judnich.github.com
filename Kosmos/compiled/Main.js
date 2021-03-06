// Generated by CoffeeScript 1.6.3
(function() {
  var animating, autopilot, camera, cameraAngle, clearLocation, deltaTime, desiredRotation, desiredSpeed, enableRetina, fps, lastFrameTime, lastIdle, lastTime, mouseDown, mouseIsDown, mouseMove, mouseUp, mouseX, mouseY, originOffset, pauseAnimating, planetfield, render, resumeAnimating, root, sleepIfIdle, smoothRotation, smoothSpeed, starfield, tick, timeNow, updateCoordinateSystem, updateMouse, updateTickElapsed;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  enableRetina = true;

  camera = null;

  starfield = null;

  planetfield = null;

  animating = false;

  cameraAngle = 0.0;

  originOffset = [0, 0, 0];

  timeNow = null;

  lastTime = null;

  deltaTime = 0.0;

  lastFrameTime = 0.0;

  fps = 0;

  desiredSpeed = 0.0;

  smoothSpeed = 0.0;

  desiredRotation = quat.create();

  smoothRotation = quat.create();

  autopilot = true;

  mouseIsDown = false;

  mouseX = 0;

  mouseY = 0;

  resumeAnimating = function() {
    if (!animating) {
      console.log("Resumed animation");
      animating = true;
      return tick();
    }
  };

  pauseAnimating = function() {
    if (animating) {
      lastTime = null;
      animating = false;
      return console.log("Paused animation");
    }
  };

  mouseDown = function(event) {
    mouseIsDown = true;
    return mouseMove(event);
  };

  mouseUp = function(event) {
    return mouseIsDown = false;
  };

  mouseMove = function(event) {
    var rightPanel, x, y, _ref;
    _ref = [event.clientX, event.clientY], x = _ref[0], y = _ref[1];
    rightPanel = document.getElementById("rightbar");
    x = (x - rightPanel.offsetLeft - 1) / canvas.clientWidth;
    y = (y - rightPanel.offsetTop - 1) / canvas.clientHeight;
    mouseX = (x - 0.5) * 2;
    mouseY = (y - 0.5) * 2;
    if (mouseIsDown) {
      return resumeAnimating();
    }
  };

  root.kosmosMain = function() {
    console.log("Initializing Kosmos Engine");
    root.canvas = $("#kosmosCanvas")[0];
    $(canvas).mousedown(mouseDown);
    $(canvas).mouseup(mouseUp);
    $(canvas).mousemove(mouseMove);
    kosmosResize();
    root.gl = WebGLUtils.setupWebGL(canvas, {
      antialias: true,
      stencil: false
    }, function() {
      return document.getElementById("glErrorMessage").style.display = "block";
    });
    if (!root.gl) {
      document.getElementById("glErrorMessage").style.display = "block";
      return;
    }
    starfield = new Starfield({
      blockMinStars: 200,
      blockMaxStars: 300,
      blockScale: 100000.0,
      starSize: 50.0,
      viewRange: 300000.0
    });
    planetfield = new Planetfield({
      starfield: starfield,
      maxPlanetsPerSystem: 3,
      minOrbitScale: 15,
      maxOrbitScale: 30,
      planetSize: 1.0,
      nearMeshRange: 40.0,
      farMeshRange: 100.0,
      spriteRange: 30000.0
    });
    camera = new Camera();
    camera.aspect = canvas.width / canvas.height;
    camera.position = vec3.fromValues(0, 0, 0);
    camera.fov = xgl.degToRad(90);
    loadLocation();
    window.onhashchange = function() {
      return loadLocation();
    };
    return resumeAnimating();
  };

  root.kosmosKill = function() {
    return pauseAnimating();
  };

  root.kosmosResize = function() {
    var devicePixelRatio;
    if (!enableRetina) {
      console.log("Note: Device pixel scaling (retina) is disabled.");
    }
    devicePixelRatio = enableRetina ? window.devicePixelRatio || 1 : 1;
    while (canvas.clientWidth * devicePixelRatio < 800 && canvas.clientHeight * devicePixelRatio < 600) {
      devicePixelRatio++;
    }
    if (devicePixelRatio > 2) {
      devicePixelRatio = 2;
    }
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    console.log("Main framebuffer resolution " + canvas.width + " x " + canvas.height, "with device pixel ratio " + devicePixelRatio);
    if (camera) {
      camera.aspect = canvas.width / canvas.height;
      return resumeAnimating();
    }
  };

  root.kosmosSetSpeed = function(speed, reverse) {
    var espeed;
    if (autopilot === true) {
      espeed = Math.pow(3.0, Math.abs(speed) * 8.0 + 0.0);
    } else {
      espeed = Math.pow(3.0, Math.abs(speed) * 22.0 - 12.0);
    }
    if (speed <= 0) {
      espeed = 0;
    }
    if (reverse) {
      espeed *= -1;
    }
    desiredSpeed = espeed;
    return resumeAnimating();
  };

  root.kosmosSetAutopilot = function(enabled) {
    return autopilot = enabled;
  };

  updateTickElapsed = function() {
    var d, elapsed;
    d = new Date();
    timeNow = d.getTime();
    if (lastTime !== null) {
      elapsed = (timeNow - lastTime) / 1000.0;
    } else {
      elapsed = 0.0;
    }
    lastTime = timeNow;
    return deltaTime = elapsed * 0.1 + deltaTime * 0.9;
  };

  updateMouse = function() {
    var pitch, qPitch, qYaw, yaw;
    if (!mouseIsDown) {
      return;
    }
    pitch = mouseY * 45;
    yaw = mouseX * 58;
    qPitch = quat.create();
    quat.setAxisAngle(qPitch, vec3.fromValues(-1, 0, 0), xgl.degToRad(pitch));
    qYaw = quat.create();
    quat.setAxisAngle(qYaw, vec3.fromValues(0, -1, 0), xgl.degToRad(yaw));
    quat.multiply(qYaw, qYaw, qPitch);
    quat.multiply(desiredRotation, smoothRotation, qYaw);
    return quat.normalize(desiredRotation, desiredRotation);
  };

  root.saveLocation = function() {
    var i, url, _i, _j, _k, _l, _m, _n;
    if (typeof Storage !== void 0) {
      for (i = _i = 0; _i <= 2; i = ++_i) {
        localStorage["kosmosOffset" + i] = camera.position[i];
      }
      for (i = _j = 0; _j <= 2; i = ++_j) {
        localStorage["kosmosOrigin" + i] = originOffset[i];
      }
      for (i = _k = 0; _k <= 3; i = ++_k) {
        localStorage["kosmosRotation" + i] = desiredRotation[i];
      }
    }
    if (document.getElementById("shareMessage").style.display === "block") {
      url = "http://judnich.github.io/Kosmos/index.html#go";
      for (i = _l = 0; _l <= 2; i = ++_l) {
        url += ":" + camera.position[i];
      }
      for (i = _m = 0; _m <= 2; i = ++_m) {
        url += ":" + originOffset[i];
      }
      for (i = _n = 0; _n <= 3; i = ++_n) {
        url += ":" + Math.round(desiredRotation[i] * 1000) / 1000;
      }
      return document.getElementById("shareLink").value = url;
    }
  };

  root.loadLocation = function() {
    var i, loadedLocation, x, _i, _j, _k;
    loadedLocation = false;
    if (!window.location.hash) {
      if (typeof Storage !== void 0) {
        loadedLocation = true;
        for (i = _i = 0; _i <= 3; i = ++_i) {
          x = localStorage["kosmosRotation" + i];
          if (x === void 0 || x === NaN || !x) {
            loadedLocation = false;
            break;
          }
          desiredRotation[i] = parseFloat(x);
        }
        quat.copy(smoothRotation, desiredRotation);
        for (i = _j = 0; _j <= 2; i = ++_j) {
          camera.position[i] = parseFloat(localStorage["kosmosOffset" + i]) || 0.0;
        }
        for (i = _k = 0; _k <= 2; i = ++_k) {
          originOffset[i] = parseFloat(localStorage["kosmosOrigin" + i]) || 0.0;
        }
      }
    }
    if (!loadedLocation) {
      if (!parseLocationString(window.location.hash)) {
        parseLocationString("#go:-137.62518310546875:13.487885475158691:-41.893638610839844:6784:-6272:16128:0.551:-0.258:0.194:0.769");
      }
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    desiredSpeed = 0.0;
    return smoothSpeed = 0.0;
  };

  root.parseLocationString = function(hash) {
    var i, words, _i, _j, _k;
    words = hash.split(":");
    if (words[0] === "#go") {
      for (i = _i = 0; _i <= 2; i = ++_i) {
        camera.position[i] = parseFloat(words[i + 1]);
      }
      for (i = _j = 0; _j <= 2; i = ++_j) {
        originOffset[i] = parseFloat(words[i + 4]);
      }
      for (i = _k = 0; _k <= 3; i = ++_k) {
        desiredRotation[i] = parseFloat(words[i + 7]);
      }
      quat.copy(smoothRotation, desiredRotation);
      return true;
    } else {
      return false;
    }
  };

  clearLocation = function() {
    if (typeof Storage !== void 0) {
      return localStorage.clear();
    }
  };

  tick = function() {
    var a, distToPlanet, look, mat, moveVec, planetVec, q, right, speedScale, up, x, y, z;
    updateTickElapsed();
    updateMouse();
    speedScale = (Math.max(planetfield.getDistanceToClosestObject(), 0.01) + 0.01) * 0.01;
    if (speedScale > 1000.0) {
      speedScale = 1000.0;
    }
    if (autopilot === false) {
      speedScale = 1000.0;
    }
    smoothSpeed = smoothSpeed * 0.90 + 0.10 * desiredSpeed * speedScale;
    moveVec = vec3.fromValues(0, 0, -smoothSpeed * deltaTime);
    vec3.transformQuat(moveVec, moveVec, smoothRotation);
    vec3.add(camera.position, camera.position, moveVec);
    distToPlanet = planetfield.getDistanceToClosestPlanet();
    planetVec = planetfield.getClosestPlanet();
    if (distToPlanet < 0.10) {
      a = Math.min((0.10 - distToPlanet) * 10, 1.0);
      a = a * a;
      if (planetVec !== null) {
        x = planetVec[0], y = planetVec[1], z = planetVec[2];
        mat = mat3.create();
        mat3.fromQuat(mat, desiredRotation);
        right = vec3.fromValues(mat[0], mat[3], mat[6]);
        up = vec3.fromValues(mat[1], mat[4], mat[7]);
        look = vec3.fromValues(mat[2], mat[5], mat[8]);
        up = vec3.fromValues(-x, -y, -z);
        vec3.normalize(up, up);
        vec3.cross(right, up, look);
        vec3.normalize(right, right);
        vec3.cross(up, look, right);
        mat[0] = right[0], mat[3] = right[1], mat[6] = right[2];
        mat[1] = up[0], mat[4] = up[1], mat[7] = up[2];
        mat[2] = look[0], mat[5] = look[1], mat[8] = look[2];
        q = quat.create();
        quat.fromMat3(q, mat);
        quat.slerp(desiredRotation, desiredRotation, q, 0.15 * a);
      }
    }
    quat.slerp(smoothRotation, smoothRotation, desiredRotation, 0.05);
    camera.setRotation(smoothRotation);
    render();
    fps++;
    if ((timeNow - lastFrameTime) >= 1000.0) {
      lastFrameTime = timeNow;
      fps = 0;
      saveLocation();
    }
    sleepIfIdle();
    if (animating) {
      return window.requestAnimFrame(tick);
    }
  };

  lastIdle = false;

  sleepIfIdle = function() {
    var d, epsilon, i, idle, potentialSpeed, quatDist, _i;
    idle = true;
    epsilon = 0.0000000001;
    potentialSpeed = Math.max(Math.abs(desiredSpeed), Math.abs(smoothSpeed));
    if (potentialSpeed > epsilon) {
      idle = false;
    }
    quatDist = 0;
    for (i = _i = 0; _i <= 3; i = ++_i) {
      d = desiredRotation[i] - smoothRotation[i];
      quatDist += d * d;
    }
    if (quatDist > epsilon) {
      idle = false;
    }
    if (planetfield.isLoadingComplete() === false) {
      idle = false;
    }
    if (lastIdle === true && idle === true) {
      pauseAnimating();
    }
    return lastIdle = idle;
  };

  render = function() {
    var blur;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    blur = Math.abs(smoothSpeed) / 2000000.0;
    blur -= 0.001;
    if (blur < 0) {
      blur = 0;
    }
    if (blur > 1.0) {
      blur = 1.0;
    }
    if (smoothSpeed < 0) {
      blur = -blur;
    }
    starfield.render(camera, originOffset, blur);
    planetfield.render(camera, originOffset, blur);
    return updateCoordinateSystem();
  };

  updateCoordinateSystem = function() {
    var i, localMax, n, _i, _results;
    localMax = 128;
    _results = [];
    for (i = _i = 0; _i <= 2; i = ++_i) {
      if (camera.position[i] > localMax + 10) {
        n = Math.floor(camera.position[i] / localMax);
        camera.position[i] -= n * localMax;
        originOffset[i] += n * localMax;
      }
      if (camera.position[i] < -localMax - 10) {
        n = Math.ceil(camera.position[i] / localMax);
        camera.position[i] -= n * localMax;
        _results.push(originOffset[i] += n * localMax);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

}).call(this);

/*
//@ sourceMappingURL=Main.map
*/
