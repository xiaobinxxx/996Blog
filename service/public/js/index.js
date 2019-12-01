
$(function () {
  // 记录被点击到哪个标签
  let index = sessionStorage.getItem('RouterIndex')||0;
  let idx = sessionStorage.getItem('RouterIdx')||0;
  $('.two-menu').eq(index).show(500);
  $('.one-menu > .item').eq(index).find('.more').removeClass('more-up');
  $('.one-menu > .item').eq(index).find('.more').addClass('more-down');
  $('.two-menu').eq(index).find('.item').eq(idx).addClass('active');

  /**
   * 一级分菜单点击
   */
  $('.one-menu > .item').click(function (){
    index = $('.one-menu > .item').index(this);
    let TagStyle = $('.two-menu').eq(index).css('display');
    // 存储点击状态
    sessionStorage.setItem('RouterIndex',index);
    sessionStorage.setItem('RouterIndex',index);
    // 判断是否隐藏
    if(TagStyle == 'block'){
      $('.two-menu').eq(index).hide(500);
      $('.one-menu > .item').eq(index).find('.more').removeClass('more-down');
      $('.one-menu > .item').eq(index).find('.more').addClass('more-up');
    }else{
      $('.two-menu').eq(index).show(500);
      $('.one-menu > .item').eq(index).find('.more').removeClass('more-up');
      $('.one-menu > .item').eq(index).find('.more').addClass('more-down');
    }
  });
  /**
   * 二级菜单点击
   */
  $('.two-menu').eq(index).find('.item').click(function () {
    idx = $('.two-menu').eq(index).find('.item').index(this);
    sessionStorage.setItem('RouterIndex',index);
    sessionStorage.setItem('RouterIdx',idx);
  });
  /**
   * 关闭弹窗
   */
  $('.close').click(function () {
    $('.quit-win').hide(300);
  });
  /**
   * 退出登录
   */
  $('.quit').click(function () {
    PopupAlert({
      width: 300,
      height: 160,
      content: '确定退出登录吗？',
      title: '提示'
    },function (res) {
      $.ajax({
        url: '/admin_login/index/quit',
        type: 'post',
        dataType: 'json',
        success: function (res) {
          window.location.replace('/login/index/index');
        }
      });
    },function (err) {
      console.log(err)
    });
  });
  /**
   * 退出
   */
  // $('.quit-btn').click(function () {
  //   $.ajax({
  //     url: '/admin_login/index/quit',
  //     type: 'post',
  //     dataType: 'json',
  //     success: function (res) {
  //       window.location.replace('/login/index/index');
  //     }
  //   });
  // });
});
