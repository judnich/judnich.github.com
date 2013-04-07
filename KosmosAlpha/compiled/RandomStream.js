//@ sourceMappingURL=RandomStream.map
// Generated by CoffeeScript 1.6.1
(function() {
  var modulus, multiplier, offset, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  modulus = 4294967291;

  multiplier = 279470273;

  offset = 65537;

  root.RandomStream = (function() {

    function RandomStream(seed) {
      this.rand = seed % modulus;
    }

    RandomStream.prototype.unit = function() {
      this.rand = ((this.rand + offset) * multiplier) % modulus;
      return this.rand / modulus;
    };

    RandomStream.prototype.symmetric = function() {
      return this.unit() * 2.0 - 1.0;
    };

    RandomStream.prototype.range = function(min, max) {
      return (max - min) * this.unit() + min;
    };

    return RandomStream;

  })();

}).call(this);
