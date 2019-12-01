$(function () {
  $('.editAdv').click(function () {
    let adv_id = $(this).val();
    window.location.href = `/Advertising/adertisngAdd?adv_id=${adv_id}&Adv_type=1`;
  });
  $('.delAdv').click(function () {
    let adv_id = $(this).val();
    $.ajax({
      url: '/admin_advertising/index/AdvDel',
      type: 'post',
      data:{
        adv_id: adv_id,
      },
      dataType: 'json',
      success:function (res) {
        if(res.code != 0){
          Toast(res.message);
          return;
        }
        Toast(res.message,1000,function () {
          location.reload();
        });
      }
    })
  });
});
