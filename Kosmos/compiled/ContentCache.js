// Generated by CoffeeScript 1.6.3
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.ContentCache = (function() {
    function ContentCache(maxItems, loaderCallback) {
      this.loadedItems = {};
      this.loadedCount = 0;
      this.queuedItems = [];
      this.queuedIdSet = {};
      this.maxItems = maxItems;
      this.loaderCallback = loaderCallback;
    }

    ContentCache.prototype.getContent = function(contentId) {
      var item;
      if (this.loadedItems[contentId] !== void 0) {
        item = this.loadedItems[contentId];
        item[1] = (new Date()).getTime();
        return item[0];
      }
      if (!this.queuedIdSet.hasOwnProperty(contentId)) {
        this.queuedItems.push({
          contentId: contentId,
          partialContent: null
        });
        this.queuedIdSet[contentId] = true;
      }
      return null;
    };

    ContentCache.prototype.isUpToDate = function() {
      return this.queuedItems.length === 0;
    };

    ContentCache.prototype.update = function(maxItemsToLoad) {
      var finished, i, len, loadTask, loadedObject, _i, _ref, _ref1, _results;
      if (maxItemsToLoad == null) {
        maxItemsToLoad = 1;
      }
      this._evictOldItems();
      len = Math.min(this.queuedItems.length, maxItemsToLoad);
      if (len <= 0) {
        return;
      }
      _results = [];
      for (i = _i = 0, _ref = len - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        loadTask = this.queuedItems.pop();
        if (loadTask !== void 0 && this.loadedItems[loadTask] === void 0) {
          _ref1 = this.loaderCallback(loadTask.contentId, loadTask.partialContent), finished = _ref1[0], loadedObject = _ref1[1];
          if (finished === true) {
            this.loadedItems[loadTask.contentId] = [loadedObject, (new Date()).getTime()];
            this.loadedCount++;
            _results.push(delete this.queuedIdSet[loadTask.contentId]);
          } else {
            loadTask.partialContent = loadedObject;
            _results.push(this.queuedItems.push(loadTask));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ContentCache.prototype._evictOldItems = function() {
      var contentId, keys, lastUsed, lastUsedSeed, thisLastUsed, _i, _len, _results;
      if (this.loadedCount > this.maxItems) {
        keys = Object.keys(this.loadedItems);
        _results = [];
        while (this.loadedCount > this.maxItems) {
          lastUsedSeed = null;
          lastUsed = null;
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            contentId = keys[_i];
            thisLastUsed = this.loadedItems[contentId][1];
            if (lastUsedSeed === null || thisLastUsed < lastUsed) {
              lastUsed = thisLastUsed;
              lastUsedSeed = contentId;
            }
          }
          console.log("Evicting content: " + lastUsedSeed);
          delete this.loadedItems[lastUsedSeed];
          _results.push(this.loadedCount--);
        }
        return _results;
      }
    };

    return ContentCache;

  })();

}).call(this);

/*
//@ sourceMappingURL=ContentCache.map
*/
