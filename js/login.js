$(function ($) {
// 失焦触发
  $("input[type='text'], input[type='password']").on('blur', function () {
    // console.log('输入');
    var _parent = $(this).closest('.input_main');
    var name = $(this).attr('name');
    var currentValue = $(this).val();
    // console.log(name);
    if (name.indexOf('account') !== -1) {
      var telReg = /^1[3|4|5|7|8][0-9]{9}$/,
          emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (currentValue.indexOf('@') !== -1) {
        if (!emailReg.test(currentValue)) {
          $.error(_parent, '账号格式错误');
          return false;
        } else {
          removeError(_parent, 'error', 'error_text');
        }
      } else {
        if (!telReg.test(currentValue)) {
          $.error(_parent, '账号格式错误');
          return false;
        } else {
          removeError(_parent, 'error', 'error_text');
        }
      }
    } else if (name.indexOf('password') !== -1) {
      if (currentValue.length === 0) {
        $.error(_parent, '密码不能为空！');
        return false;
      } else {
        removeError(_parent, 'error', 'error_text');
      }
    } else {
      removeError(_parent, 'error', 'error_text');
    }
  });

//  点击阅读注册协议触发
  $("#pact_checkbox").on('click', function (event) {
    var isChecked = $(this).get(0).checked;
    // console.log(isChecked);
  });

// 滑块拖动
  var isPullOut = false; // 是否拉取到尽头
  $(".slider").on('mousedown', function (event) {
    event.preventDefault();
    var _parent = $(this);
    var sliderX = event.clientX;
    var maxWidth = $(this).closest('.input_slider').css('width').substr(0, 3) - 46;
    if (_parent.parent().get(0).className.indexOf('input_slider') !== -1) {
      removeError(_parent.parent(), 'error', 'error_text');
      $('.input_slider').on('mousemove', function (event) {
        var pageX = event.clientX - sliderX;
        var _slider = $(this);
        if (pageX >= 0 && pageX < maxWidth) {
          _parent.css('left', pageX);
          _slider.find(".active_slider").css({'width': pageX});
          _slider.find('.slider_text').text('请按住滑块，拖到最右边');
        } else if (pageX + 46 >= maxWidth) {
          // 拉取完成
          isPullOut = true;
          _slider.find('.slider_text').text('加载中……');
          _slider.off('mousemove');
          // 定时器
          var sliderTimeOut = setTimeout(function () {
            _parent.addClass('slider_complete');
            _parent.find('.iconfont').addClass('icon-wancheng-copy');
            _slider.find('.slider_text').text('验证完成');
            _slider.find(".slider_text").addClass('active_text');
            clearTimeout(sliderTimeOut);
          }, 1000);
        }
      });
    }
  });
  // 滑块验证-清除事件
  $(".slider").on('mouseup, mouseleave, mouseout', function () {
    console.log('松开了')
    if (!isPullOut) {
      $(".active_slider").animate({
        width: 0
      }, 'normal');
      $(this).animate({
        left: 0
      }, 'normal');
      $(this).closest('.input_slider').find('.slider_text').text('请按住滑块，拖到最右边');
      $(this).off('mousedown', arguments.callee);
      $(".input_slider").off('mousemove');
    }
  });
// 点击获取验证码
  $(".get_code").on('click', function (event) {
    event.preventDefault();
    var maxSeconds = 60, _this = $(this);
    _this.addClass('active_code');
    _this.attr('disabled', 'disabled');
    _this.text(maxSeconds + '秒');
    var codeIntval = setInterval(function () {
      if (maxSeconds > 1) {
        maxSeconds--;
        _this.text(maxSeconds + '秒');
      } else {
        // 恢复原状
        _this.removeClass('active_code');
        _this.text('获取验证码');
        _this.removeAttr('disabled');
        clearInterval(codeIntval);
      }
    }, 1000);
  });
// 找回密码步骤
  var oFindPwd = {}, step = 1;
  Object.defineProperty(oFindPwd, 'step', {
    get: function () {
      return oFindPwd;
    },
    set: function (newVal) {
      if (newVal === 2) {
        $(".pwd_2").show();
        $(".pwd_1").hide();
      } else if (newVal === 3) {
        $(".pwd_2").hide();
        $(".pwd_3").show();
      }
    }
  });
// 找回密码点击按钮触发-特殊
  $('#find_pwd button[type="submit"], #find_pwd_2 button[type="submit"]').on('click', function (event) {
    event.preventDefault();
    var oForm = $(this).closest('form');
    var formData = oForm.serializeArray();
    if (oForm.hasClass('find_pwd_form')) {
      // console.log('找回密码')
      var isComplate = checkSliderComplate(oForm.find('.input_slider'));
      for (var i = 0; i < formData.length; i++) {
        var item = formData[i];
        var _this = oForm.find('input[name="' + item.name + '"]').closest('.input_main,.code_main');
        removeError(_this, 'error', 'error_text');
        if (item.name.indexOf("pwd" + step) !== -1 && item.value.length === 0) {
          $.error(_this, '此项为必填项');
          return false;
        }
      }
      // 验证滑块是否验证完成
      if (!isComplate) {
        return false;
      }
      step++;
      oFindPwd.step = step;
      var prev = step - 1, next = step;
      $(".steps_item:nth-of-type(" + prev + ")").find(".step_line").addClass("step_active");
      $(".steps_item:nth-of-type(" + next + ")").find(".step_dot").addClass("step_dot-active");
    }
  });
  // 点击注册触发
  $("#register button[type='submit']").on('click', function (event) {
    event.preventDefault();
    var oForm = $(this).closest('form');
    var formData = oForm.serializeArray();
    removeError(oForm, 'error', 'error_text');
    return checkFormInputComplate(formData, oForm) && checkSliderComplate(oForm.find('.input_slider'));
  });
  // 点击登陆触发
  $("#login button[type='submit']").on('click', function (event) {
    event.preventDefault();
    var oForm = $(this).closest('form');
    var formData = oForm.serializeArray();
    removeError(oForm, 'error', 'error_text');
    return checkFormInputComplate(formData, oForm);
  });
  // 绑定第三方账号
  $("#bind button[type='submit']").on('click', function (event) {
    event.preventDefault();
    var oForm = $(this).closest('form');
    var formData = oForm.serializeArray();
    removeError(oForm, 'error', 'error_text');
    return checkFormInputComplate(formData, oForm);
  });

  // 检查表单是否填写完整
  function checkFormInputComplate(formData, oForm) {
    for (var i = 0; i < formData.length; i++) {
      var item = formData[i];
      var _this = oForm.find('input[name="' + item.name + '"]').closest('.input_main, .code_main');
      removeError(_this, 'error', 'error_text');
      if (item.value.length === 0) {
        $.error(_this, '此项为必填项');
        return false;
      }
    }
    return true;
  }

  // 判断滑块验证是否完成
  function checkSliderComplate(_this) {
    if (!isPullOut) {
      $.error(_this, '请向右拖动滑块完成验证');
      return false;
    }
    return true;
  }
});
