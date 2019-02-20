(function () {
  $.extend({
    // 输入框错误提示
    error: function (_this, msg, addClass) {
      addClass = !addClass ? true : false;
      errHtml(_this, msg, addClass);
    }
  });

  var errHtml = function (_this, msg, addClass) {
    var _html = '<span class="error_text">' + msg + '</span>';
    // 清空上次操作遗留
    _this.find('.error_text').remove();
    addClass && _this.find('input').addClass('error');
    _this.append(_html);
  };
})();