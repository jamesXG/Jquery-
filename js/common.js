// 移除错误提示
function removeError(_this, className, textClass) {
  _this.find('input').removeClass(className);
  _this.find('.' + textClass).remove();
}