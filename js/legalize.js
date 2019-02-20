// 判断个人认证、企业认证
var oRadio = {}, type = 'mine';
Object.defineProperty(oRadio, 'type', {
  get: function () {
    return oRadio;
  },
  set: function (newVal) {
    removeError($(".item_input-main"), 'error', 'error_text');
    if (newVal === 'mine') {
      $('.tpl_mine').fadeIn('fast');
      $('.tpl_company').fadeOut('fast');
    } else if (newVal === 'company') {
      $('.tpl_company').fadeIn('fast');
      $('.tpl_mine').fadeOut('fast');
    }
  }
});
$(document).on('change', "input[type='radio']", function () {
  var value = $(this).data('id').toString();
  oRadio.type = value;
  type = value;
});
// 提交认证信息
$(document).on('click', "button[type='submit']", function (event) {
  event.preventDefault();
  var _form = $(this).closest('form');
  var formData = _form.find('input').serializeArray();
  var data = [];
  for (var i = 0; i < formData.length; i++) {
    var item = formData[i];
    if (item.name.includes(type)) {
      data.push(item);
    }
  }
  for (var j = 0; j < data.length; j++) {
    var jtem = data[j];
    if (jtem.value.length === 0) {
      $.error(_form.find("input[name='" + jtem.name + "']").closest('.item_input-main'), '此项不能为空');
      return false;
    }
  }
  /**
   * TODO 认证提交跳转
   * 选择企业认证跳转到认证失败页，个人认证跳转到认证成功页
   * @type {string}
   */
  var href = type === 'mine' ? './review-success.html' : './review-err.html';
  location.href = href;
});

$(".item_input-main input[type='text']").on('change', function () {
  var currentName = $(this).attr('name');
  var reg = '', title = '';
  var _parent = $(this).closest('.item_input-main');
  switch (currentName) {
    case 'mine_card_ID':
      reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      title = '身份证';
      return false;
    case 'company_code':
      reg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g;
      title = '信用代码';
      return false;
  }
  if (reg !== '') {
    if (!reg.test(currentName)) {
      $.error(_parent, title + '格式错误');
      return false;
    } else {
      removeError(_parent, 'error', 'error_text');
    }
  }
});

// 文件上传
$("input[type='file']").on('change', function (event) {
  var $_file = $(this);
  var fileSuffix = $_file.val().split('.')[1];
  if (!['jpg', 'png', 'jpeg'].includes(fileSuffix)) {
    $.error($(this).closest('.item_input-main'), '请上传正确的图片！', false);
    return false;
  }
  var fileObj = $_file[0];
  var windowURL = window.URL || window.webkitURL;
  var $_img = $(this).closest('.legalize_item').next().find('.upload_img');
  if (fileObj && fileObj.files && fileObj.files[0]) {
    var dataURL = windowURL.createObjectURL(fileObj.files[0]);
    $_img.attr('src', dataURL);
  } else {
    $_img.src = $file.val();
  }
});
