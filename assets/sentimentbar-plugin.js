(function($) {
  $.fn.sentimentBar = function(options) {
    var currentProgressRatio = 0;
    var config = {
      width : '70px',
      height: '4px',
      progressColor: '#999',
      backgrounColor: '#ccc'
    };

    $.extend(config, options);

    this.css( {
      "border-radius":"2px",
      "width" : config.width,
      "background-color": config.backgrounColor,
      "position": "relative",
      "top": "25px",
      "left": "1000px"
    });

    var progressDiv = $("<div/>").css({
      "width": 0,
      "height": config.height,
      "background-color": config.progressColor
    });

    this.append(progressDiv);
    function setProgress(progressCount, totalCount) {
      currentProgressRatio = progressCount/totalCount;
      var progressDivWidth = (progressCount/totalCount) *  parseInt(config.width);
      progressDiv.css({"width" : progressDivWidth + "px"});
    }

    function getProgress() {
      return currentProgressRatio;
    }

    return {
      setProgress : setProgress,
      getProgress : getProgress
    }
  };
})(window.jQuery);
