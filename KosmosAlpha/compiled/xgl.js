//@ sourceMappingURL=xgl.map
// Generated by CoffeeScript 1.6.1
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.xgl = {};

  xgl.programs = {};

  xgl.degToRad = function(angle) {
    return Math.PI * angle / 180.0;
  };

  xgl.radToDeg = function(angle) {
    return 180.0 * angle / Math.PI;
  };

  xgl.error = function(msg) {
    return console.log(msg);
  };

  xgl.addProgram = function(name, vSrc, fSrc) {
    var shaderSrc;
    shaderSrc = {
      "vertex": vSrc,
      "fragment": fSrc
    };
    return xgl.programs[name] = shaderSrc;
  };

  xgl.loadShader = function(source, isVertex) {
    var shader;
    if (isVertex) {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      xgl.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };

  xgl.createProgram = function(vertexShader, fragmentShader) {
    var shaderProgram;
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      return null;
    }
    return shaderProgram;
  };

  xgl.loadProgram = function(programName) {
    var fragmentShader, prog, shaderSrc, vertexShader;
    shaderSrc = xgl.programs[programName];
    vertexShader = xgl.loadShader(shaderSrc.vertex, true);
    if (vertexShader === null) {
      xgl.error("Error finding vertex shader for \"" + programName + "\"");
      return null;
    }
    fragmentShader = xgl.loadShader(shaderSrc.fragment, false);
    if (fragmentShader === null) {
      xgl.error("Error finding fragment shader for \"" + programName + "\"");
      return null;
    }
    prog = xgl.createProgram(vertexShader, fragmentShader);
    if (prog === null) {
      xgl.error("Error linking program \"" + programName + "\"");
    }
    return prog;
  };

  xgl.getProgramAttribs = function(programObject, attribNameList) {
    var attrib, attribs, index, _i, _len;
    attribs = {};
    for (_i = 0, _len = attribNameList.length; _i < _len; _i++) {
      attrib = attribNameList[_i];
      index = gl.getAttribLocation(programObject, attrib);
      if (index === -1) {
        xgl.error("Could not find attribute \"" + attrib + "\"");
      } else {
        attribs[attrib] = index;
      }
    }
    return attribs;
  };

  xgl.getProgramUniforms = function(programObject, uniformNameList) {
    var ptr, uniform, uniforms, _i, _len;
    uniforms = {};
    for (_i = 0, _len = uniformNameList.length; _i < _len; _i++) {
      uniform = uniformNameList[_i];
      ptr = gl.getUniformLocation(programObject, uniform);
      if (ptr === null) {
        xgl.error("Could not find uniform \"" + uniform + "\"");
      } else {
        uniforms[uniform] = ptr;
      }
    }
    return uniforms;
  };

}).call(this);
