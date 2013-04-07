//@ sourceMappingURL=Camera.map
// Generated by CoffeeScript 1.6.1
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Camera = (function() {

    Camera.prototype.aspect = 1.0;

    Camera.prototype.near = 0.1;

    Camera.prototype.far = 1000.0;

    Camera.prototype.fov = xgl.degToRad(90);

    Camera.prototype.position = vec3.fromValues(0, 0, 0);

    Camera.prototype.target = vec3.fromValues(0, 0, -1);

    Camera.prototype.up = vec3.fromValues(0, 1, 0);

    Camera.prototype.projMat = mat4.create();

    Camera.prototype.viewMat = mat4.create();

    Camera.prototype.viewprojMat = mat4.create();

    function Camera(aspectRatio) {
      this.aspect = aspectRatio;
      this.update();
    }

    Camera.prototype.update = function() {
      mat4.perspective(this.projMat, this.fov, this.aspect, this.near, this.far);
      mat4.lookAt(this.viewMat, this.position, this.target, this.up);
      return mat4.mul(this.viewprojMat, this.projMat, this.viewMat);
    };

    Camera.prototype.isVisibleVertices = function(verts) {
      var behindPlane, i, point, tv, tverts, v, _i, _j, _k, _l, _len, _len1, _len2, _m;
      tverts = [];
      i = 0;
      for (_i = 0, _len = verts.length; _i < _len; _i++) {
        v = verts[_i];
        tv = vec4.fromValues(v[0], v[1], v[2], 1.0);
        vec4.transformMat4(tv, tv, this.viewMat);
        vec4.transformMat4(tv, tv, this.projMat);
        tv[0] /= tv[3];
        tv[1] /= tv[3];
        tv[2] /= tv[3];
        tverts[i] = tv;
        i++;
      }
      for (i = _j = 0; _j <= 2; i = ++_j) {
        behindPlane = true;
        for (_k = 0, _len1 = tverts.length; _k < _len1; _k++) {
          point = tverts[_k];
          if (point[i] >= -1.0) {
            behindPlane = false;
            break;
          }
        }
        if (behindPlane) {
          return false;
        }
      }
      for (i = _l = 0; _l <= 2; i = ++_l) {
        behindPlane = true;
        for (_m = 0, _len2 = tverts.length; _m < _len2; _m++) {
          point = tverts[_m];
          if (point[i] <= 1.0) {
            behindPlane = false;
            break;
          }
        }
        if (behindPlane) {
          return false;
        }
      }
      return true;
    };

    Camera.prototype.isVisibleBox = function(box, translate) {
      var v, verts, _i, _len;
      if (translate == null) {
        translate = null;
      }
      verts = box.getCorners();
      if (translate !== null) {
        for (_i = 0, _len = verts.length; _i < _len; _i++) {
          v = verts[_i];
          vec3.add(v, v, translate);
        }
      }
      return this.isVisibleVertices(verts);
    };

    return Camera;

  })();

}).call(this);
