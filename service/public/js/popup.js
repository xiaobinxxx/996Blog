/**
 * 询问弹出层
 * @param params
 * @param callback
 * @param Catch
 * @constructor
 */
function PopupAlert(params,callback,Catch){
  let width = params.width||'auto';
  let height = params.height||'auto';
  let content = params.content||'';
  let title = params.title||'提示';
  let InputClass = params.InputClass||[];
  let InputValue = [];
  let BtnName = params.BtnName||['确定','取消'];
  let pop = $("<div class='Popups'>"+
    "<div class='Popup'>" +
    "<div class='title'>" +
    "<span>"+ title +"</span>" +
    "<span class='cha cancel'></span>" +
    "</div>" +
    "<div class='content'>" + content + "</div>" +
    "<div class='btn'>" +
    "<span class='affirm'>"+ BtnName[0] +"</span>" +
    "<span class='cancel'>"+ BtnName[1] +"</span>" +
    "</div>" +
    "</div></div>");
  $('body').append(pop);
  $('.Popups .Popup').css({
    'width': width,
    'height': 'auto',
  });
  for (let i = 0; i < InputClass.length;i++){
    $(InputClass[i]).on("change",function(){
      InputValue.push(this.value);
    });
  }
  drag();
  // 事件区
  $('.affirm').on('click',function () {
    $('.Popups .Popup').fadeOut(300,function () {
      if (typeof callback === "function") {
        callback(InputValue);
        $(".Popups").remove();
      }
    });
  });
  $('.cancel').on('click',function () {
    $('.Popups .Popup').fadeOut(300,function () {
      $(".Popups").remove();
      if (typeof Catch === "function") {
        Catch(false);
      }
    });
  })
}

/**
 * 页面弹出层
 * @param params
 * @param callback
 * @param Catch
 * @constructor
 */
function PopupHtml(params,callback,Catch) {
  let width = params.width||'auto';
  let height = params.height||'auto';
  let content = params.content||'';
  let title = params.title||'提示';
  let InputClass = params.InputClass||[];
  let InputValue = [];
  let BtnName = params.BtnName||['确定','取消'];
  let pop = $("<div class='Popups'>"+
    "<div class='Popup'>" +
    "<div class='title'>" +
    "<span>"+ title +"</span>" +
    "<span class='cha cancel'></span>" +
    "</div>" +
    "<div class='content'>" + content + "</div>" +
    "<div class='btn'>" +
    "<span class='affirm'>"+ BtnName[0] +"</span>" +
    "<span class='cancel'>"+ BtnName[1] +"</span>" +
    "</div>" +
    "</div></div>");
  $('body').append(pop);
  $('.Popups .Popup').css({
    'width': width,
    'height': height,
  });
  for (let i = 0; i < InputClass.length;i++){
    $(InputClass[i]).on("change",function(){
      InputValue.push(this.value);
    });
  }
  drag();
  // 事件区
  $('.affirm').on('click',function () {
    $('.Popups .Popup').fadeOut(300,function () {
      if (typeof callback === "function") {
        callback(InputValue);
        $(".Popups").remove();
      }
    });
  });
  // 事件区
  $('.cancel').on('click',function () {
    $('.Popups .Popup').fadeOut(300,function () {
      $(".Popups").remove();
      if (typeof Catch === "function") {
        Catch(false);
      }
    });
  })
}

/**
 * iframe 弹出层
 * @param params
 * @param callback
 * @param Catch
 * @constructor
 */
function PopupIframe(params,callback,Catch) {
  let width = params.width||'auto';
  let height = params.height||'auto';
  let content = params.content||'';
  let title = params.title||'提示';
  let heightIframe = params.heightIframe||500;
  let pop = $("<div class='Popups'>"+
    "<div class='Popup'>" +
    "<div class='title'>" +
    "<span>"+ title +"</span>" +
    "<span class='cha cancel'></span>" +
    "</div>" +
    "<div class='content'><iframe class='Iframe-popup' src="+ content +"></iframe></div>" +
    "</div></div>");
  $('body').append(pop);
  $('.Popups .Popup').css({
    'width': width,
    'height': height,
  });
  $('.Iframe-popup').css({
    'width': '100%',
    'height': heightIframe,
  });
  drag();
  // 事件区
  $('.cancel').on('click',function () {
    $('.Popups .Popup').fadeOut(300,function () {
      $(".Popups").remove();
      if (typeof Catch === "function") {
        Catch(false);
      }
    });
  })
}

/**
 * 提示框
 * @param msg
 * @param duration
 * @constructor
 */
function Toast(msg,duration,callback){
  duration=isNaN(duration)?3000:duration;
  var m = document.createElement('div');
  m.innerHTML = msg;
  m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.5);font-size: 16px;";
  document.body.appendChild(m);
  setTimeout(function() {
    var d = 0.5;
    m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
    m.style.opacity = '0';
    setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    if (typeof callback === "function") {
      callback(true);
    }
  }, duration);
}
function PopupLoading(params,callback,Catch) {
  let shade = params.shade||[0.1,'#fff']; //0.1透明度的白色背景;
  let pop = $('<div class="Popups">' +
    '<div class="loadEffect">\n' +
    '  <span></span>\n' +
    '  <span></span>\n' +
    '  <span></span>\n' +
    '  <span></span>\n' +
    '  <span></span>\n' +
    '  <span></span>\n' +
    '  <span></span>\n' +
    '  <span></span>\n' +
    '</div>' +
    '</div>');
  $('body').append(pop);
  $('.Popups').css({
    'opacity': shade[0],
    'background': shade[1],
  });
}

/**
 * 关闭弹窗
 * @constructor
 */
function ClosePopup(){
  $('.Popups').fadeOut(300,function () {
    $(".Popups").remove();
  });
}


// 拖拽函数
function drag() {
  // 获取浏览器窗口
  var windowScreen = document.documentElement;
  // 获取main的div元素
  var main_div = $('.Popups .Popup');
  // 通过窗口宽高和div宽高计算位置
  var main_left = (windowScreen.clientWidth - main_div.width())/2 + "px";
  var main_top = (windowScreen.clientHeight - main_div.height())/2 + "px";
  // 位置赋值
  main_div.css({
    'left': main_left,
    'top': main_top,
  });
  // 拖拽
  $('.Popup .title').on('mousedown',function(e) {
    var positionDiv = $(this).offset();
    var distenceX = e.pageX - positionDiv.left;
    var distenceY = e.pageY - positionDiv.top;

    $(document).on('mousemove',function(e) {
      var x = e.pageX - distenceX;
      var y = e.pageY - distenceY;
      if (x < 0) {
        x = 0;
      } else if (x > $(document).width() - $('.Popups .Popup').outerWidth(true)) {
        x = $(document).width() - $('.Popups .Popup').outerWidth(true);
      }

      if (y < 0) {
        y = 0;
      } else if (y > $(document).height() - $('.Popups .Popup').outerHeight(true)) {
        y = $(document).height() - $('.Popups .Popup').outerHeight(true);
      }

      $('.Popups .Popup').css({
        'left': x + 'px',
        'top': y + 'px'
      });
    });

    $(document).mouseup(function() {
      $(document).off('mousemove');
    });
  });
}
