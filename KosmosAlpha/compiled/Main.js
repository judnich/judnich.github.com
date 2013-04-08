//@ sourceMappingURL=Main.map
// Generated by CoffeeScript 1.6.1
(function() {
  var animating, camera, cameraAngle, deltaTime, desiredRotation, desiredSpeed, enableRetina, fps, gridOffset, lastFrameTime, lastTime, mouseDown, mouseIsDown, mouseMove, mouseUp, mouseX, mouseY, pauseAnimating, render, resumeAnimating, root, sleepIfIdle, smoothRotation, smoothSpeed, starfield, tick, timeNow, updateCoordinateSystem, updateMouse, updateTickElapsed;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  enableRetina = true;

  camera = null;

  starfield = null;

  animating = false;

  cameraAngle = 0.0;

  gridOffset = [0, 0, 0];

  timeNow = null;

  lastTime = null;

  deltaTime = 0.0;

  lastFrameTime = 0.0;

  fps = 0;

  desiredSpeed = 0.0;

  smoothSpeed = 0.0;

  desiredRotation = quat.create();

  smoothRotation = quat.create();

  mouseIsDown = false;

  mouseX = 0;

  mouseY = 0;

  resumeAnimating = function() {
    if (!animating) {
      animating = true;
      tick();
      return console.log("Resumed animation");
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
    _ref = [event.x, event.y], x = _ref[0], y = _ref[1];
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
    root.canvas = document.getElementById("kosmosCanvas");
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    kosmosResize();
    root.gl = WebGLUtils.setupWebGL(canvas, void 0, function() {
      return document.getElementById("glErrorMessage").style.display = "block";
    });
    if (!root.gl) {
      return;
    }
    starfield = new Starfield(200, 300, 1000.0, 5.0, 3000.0);
    camera = new Camera();
    camera.aspect = canvas.width / canvas.height;
    camera.position = vec3.fromValues(0, 0, 0);
    camera.target = vec3.fromValues(0, 0, -1);
    camera.near = 0.001;
    camera.far = 4000.0;
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
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    console.log("Main framebuffer resolution " + canvas.width + " x " + canvas.height, "with device pixel ratio " + devicePixelRatio);
    if (camera) {
      camera.aspect = canvas.width / canvas.height;
      return resumeAnimating();
    }
  };

  root.kosmosSetSpeed = function(speed) {
    desiredSpeed = speed;
    return resumeAnimating();
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
    pitch = mouseY * 40;
    yaw = mouseX * 52;
    qPitch = quat.create();
    quat.setAxisAngle(qPitch, vec3.fromValues(-1, 0, 0), xgl.degToRad(pitch));
    qYaw = quat.create();
    quat.setAxisAngle(qYaw, vec3.fromValues(0, -1, 0), xgl.degToRad(yaw));
    quat.multiply(qYaw, qYaw, qPitch);
    quat.multiply(desiredRotation, smoothRotation, qYaw);
    return quat.normalize(desiredRotation, desiredRotation);
  };

  tick = function() {
    var moveVec;
    updateTickElapsed();
    updateMouse();
    smoothSpeed = smoothSpeed * 0.90 + 0.10 * desiredSpeed;
    moveVec = vec3.fromValues(0, 0, -smoothSpeed * deltaTime);
    vec3.transformQuat(moveVec, moveVec, smoothRotation);
    vec3.add(camera.position, camera.position, moveVec);
    quat.slerp(smoothRotation, smoothRotation, desiredRotation, 0.05);
    camera.setRotation(smoothRotation);
    camera.update();
    render();
    fps++;
    if ((timeNow - lastFrameTime) >= 1000.0) {
      console.log("FPS: " + fps);
      lastFrameTime = timeNow;
      fps = 0;
    }
    sleepIfIdle();
    if (animating) {
      return window.requestAnimFrame(tick);
    }
  };

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
    if (idle) {
      return pauseAnimating();
    }
  };

  render = function() {
    var blur;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    blur = Math.abs(smoothSpeed) / 15000.0;
    blur -= 0.001;
    if (blur < 0) {
      blur = 0;
    }
    if (blur > 1.5) {
      blur = 1.5;
    }
    starfield.render(camera, gridOffset, blur);
    return updateCoordinateSystem();
  };

  updateCoordinateSystem = function() {
    var blockScale, i, _i, _results;
    blockScale = starfield.blockScale;
    _results = [];
    for (i = _i = 0; _i <= 2; i = ++_i) {
      if (camera.position[i] > blockScale + 10) {
        camera.position[i] -= blockScale * 2;
        gridOffset[i] += 2;
      }
      if (camera.position[i] < -blockScale - 10) {
        camera.position[i] += blockScale * 2;
        gridOffset[i] -= 2;
      }
      if (camera.position[i] > blockScale + 10) {
        camera.position[i] = -blockScale;
        gridOffset[i] += 2;
      }
      if (camera.position[i] < -blockScale - 10) {
        camera.position[i] = blockScale;
        _results.push(gridOffset[i] -= 2);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

}).call(this);
