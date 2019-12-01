

$(function () {
  // 登录函数
  function login(){
    let username = $('input[name="username"]').val();
    let password = $('input[name="password"]').val();
    if(!username){
      Toast('账号不可为空',2000);
      return;
    }
    if(!password){
      Toast('密码不可为空',2000);
      return;
    }
    // loading 弹出层
    PopupLoading({
      shade: ['0.7','#fff'] //0.7透明度的白色背景;
    });
    $.ajax({
      url: '/admin_login/index/index',
      data:{
        username,
        password,
      },
      type: 'post',
      dataType: 'json',
      success:( res )=>{
        ClosePopup();
        if(res.code != 0){
          Toast(res.message,2000);
        }
        Toast(res.message,1000,function () {
          window.location.href = '/index/index/home';
        })
      }
    });
  }
  $(document).keydown(function(event){
    let keyCode = event.keyCode;
    if(keyCode === 13){
      login();
    }
  });
  $('#login').click(()=>{
    login();
  });
});
