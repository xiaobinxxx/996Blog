export default {
  // 时间戳转换日期格式
  timeFormat(nS) {
    let date = new Date(parseInt(nS)) // 时间戳为10位需乘1000，为13位则不用

    let Y = date.getFullYear() // 年
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) // 月
    let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + '' // 日

    let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() // 时
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() // 分
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() // 秒

    // 一个函数只能有一个return，以下仅做示例
    // return Y + '-' + M + '-' + D // yyyy-mm-dd
    // return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + 's' // yyyy-mm-dd hh:mm:ss
    //
    // return Y + '/' + M + '/' + D // yyyy/mm/dd
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s // yyyy/mm/dd hh:mm:ss

  },
  /**
   * 和PHP一样的时间戳格式化函数
   * @param {string} format 格式
   * @param {int} timestamp 要格式化的时间 默认为当前时间
   * @return {string}   格式化的时间字符串
   */
  // date(format, timestamp) {
  //   var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
  //   console.log(format);
  //   var pad = function (n, c) {
  //     if ((n = n + "").length < c) {
  //       return new Array(++c - n.length).join("0") + n;
  //     } else {
  //       return n;
  //     }
  //   };
  //   var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  //   var txt_ordin = {1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st"};
  //   var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  //   var f = {
  //     // Day
  //     d: function () {
  //       return pad(f.j(), 2)
  //     },
  //     D: function () {
  //       return f.l().substr(0, 3)
  //     },
  //     j: function () {
  //       return jsdate.getDate()
  //     },
  //     l: function () {
  //       return txt_weekdays[f.w()]
  //     },
  //     N: function () {
  //       return f.w() + 1
  //     },
  //     S: function () {
  //       return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
  //     },
  //     w: function () {
  //       return jsdate.getDay()
  //     },
  //     z: function () {
  //       return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
  //     },
  //
  //     // Week
  //     W: function () {
  //       var a = f.z(), b = 364 + f.L() - a;
  //       var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
  //       if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
  //         return 1;
  //       } else {
  //         if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
  //           nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
  //           return date("W", Math.round(nd2.getTime() / 1000));
  //         } else {
  //           return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
  //         }
  //       }
  //     },
  //
  //     // Month
  //     F: function () {
  //       return txt_months[f.n()]
  //     },
  //     m: function () {
  //       return pad(f.n(), 2)
  //     },
  //     M: function () {
  //       return f.F().substr(0, 3)
  //     },
  //     n: function () {
  //       return jsdate.getMonth() + 1
  //     },
  //     t: function () {
  //       var n;
  //       if ((n = jsdate.getMonth() + 1) == 2) {
  //         return 28 + f.L();
  //       } else {
  //         if (n & 1 && n < 8 || !(n & 1) && n > 7) {
  //           return 31;
  //         } else {
  //           return 30;
  //         }
  //       }
  //     },
  //
  //     // Year
  //     L: function () {
  //       var y = f.Y();
  //       return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
  //     },
  //     //o not supported yet
  //     Y: function () {
  //       return jsdate.getFullYear()
  //     },
  //     y: function () {
  //       return (jsdate.getFullYear() + "").slice(2)
  //     },
  //
  //     // Time
  //     a: function () {
  //       return jsdate.getHours() > 11 ? "pm" : "am"
  //     },
  //     A: function () {
  //       return f.a().toUpperCase()
  //     },
  //     B: function () {
  //       // peter paul koch:
  //       var off = (jsdate.getTimezoneOffset() + 60) * 60;
  //       var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
  //       var beat = Math.floor(theSeconds / 86.4);
  //       if (beat > 1000) beat -= 1000;
  //       if (beat < 0) beat += 1000;
  //       if ((String(beat)).length == 1) beat = "00" + beat;
  //       if ((String(beat)).length == 2) beat = "0" + beat;
  //       return beat;
  //     },
  //     g: function () {
  //       return jsdate.getHours() % 12 || 12
  //     },
  //     G: function () {
  //       return jsdate.getHours()
  //     },
  //     h: function () {
  //       return pad(f.g(), 2)
  //     },
  //     H: function () {
  //       return pad(jsdate.getHours(), 2)
  //     },
  //     i: function () {
  //       return pad(jsdate.getMinutes(), 2)
  //     },
  //     s: function () {
  //       return pad(jsdate.getSeconds(), 2)
  //     },
  //     //u not supported yet
  //
  //     // Timezone
  //     //e not supported yet
  //     //I not supported yet
  //     O: function () {
  //       var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
  //       if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
  //       return t;
  //     },
  //     P: function () {
  //       var O = f.O();
  //       return (O.substr(0, 3) + ":" + O.substr(3, 2))
  //     },
  //     //T not supported yet
  //     //Z not supported yet
  //
  //     // Full Date/Time
  //     c: function () {
  //       return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
  //     },
  //     //r not supported yet
  //     U: function () {
  //       return Math.round(jsdate.getTime() / 1000)
  //     }
  //   };
  //
  //   return format.replace(/[\ ]?([a-zA-Z])/g, function (t, s) {
  //     var ret = '';
  //     if( t!=s ){
  //       // escaped
  //       ret = s;
  //     } else if( f[s] ){
  //       // a date function exists
  //       ret = f[s]();
  //     } else{
  //       // nothing special
  //       ret = s;
  //     }
  //     console.log(f[s]());
  //     return ret;
  //   });
  // }
  /**
   *  2019-09-07T02:02:51.577Z 日期格式化
   */
  resolvingDate(date) {
    //date是传入的时间
    let d = new Date(date);

    let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();

    let times = d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min;

    return times
  }

}

