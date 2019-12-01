<template>
  <div class="page-table">
    <!--    登录注册-->
    <div class="login-user"
         :style="Global.UserStatus==0||Global.UserStatus==2?`transform: rotateY(0deg);`:`transform: rotateY(180deg)`">
      <div class="quit" @click="onQuit">
        <span>退出</span>
      </div>
      <!--      用户-->
      <div class="user" v-if="Global.UserStatus === 1">
        <div class="bg">
          <img :src="Global.MemberInfo.wallpaper" alt="">
        </div>
        <div class="nickname">
          <span class="name">{{Global.MemberInfo.nickname}}</span>
          <span class="introduce">{{Global.MemberInfo.description}}</span>
        </div>
        <div class="description">
          <span>{{Global.MemberInfo.introduction}}</span>
        </div>
        <div class="head-portrait" @click="dialogVisible = true">
          <img :src="Global.MemberInfo.portrait" alt="">
        </div>
      </div>
      <!--      登录-->
      <div class="login" v-else-if="Global.UserStatus === 0">
        <div class="logo">
          <img
            src="/static/image/logo.png">
        </div>
        <div class="login-number">
          <span>账号：</span>
          <input type="text" v-model="UserName" placeholder="请输入账号">
        </div>
        <div class="login-number">
          <span>密码：</span>
          <input type="password" v-model="PassWord" placeholder="请输入密码">
        </div>
        <div class="register">
          <span @click="onLogin">登录</span>
          <span @click="Global.UserStatus = 2;$forceUpdate();">注册</span>
        </div>
<!--        <div class="tripartite">-->
<!--          <img src="https://www.mbjkysg.com/static/img/icon31.png" alt="">-->
<!--        </div>-->
      </div>
      <!--      注册-->
      <div class="enroll" v-if="Global.UserStatus === 2">
        <div class="login-number">
          <span>账号：</span>
          <input type="text" v-model="UserName" placeholder="请输入账号">
        </div>
        <div class="login-number">
          <span>密码：</span>
          <input type="password" v-model="PassWord" placeholder="请输入密码">
        </div>
        <div class="login-number">
          <span>确认：</span>
          <input type="password" v-model="RegPassWord" placeholder="请确认密码">
        </div>
        <div class="login-number">
          <span>昵称：</span>
          <input type="text" v-model="nickname" placeholder="请输入您的昵称">
        </div>
        <div class="register">
          <span @click="onRegIster">注册</span>
          <span @click="Global.UserStatus = 0;$forceUpdate();">登录</span>
        </div>
      </div>
    </div>
    <!--    热门文章-->
    <div class="hot-article" v-if="ClickBanner.length!=0">
      <div class="Blogs-title">
        <span>热门文章</span>
      </div>
      <div class="banner">
        <el-carousel height="140px">
          <el-carousel-item v-for="(item,index) in ClickBanner"
                            :key="index">
            <img :src="item.ad_cover" @click="onAdSkip(item)">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="article-list">

        <div class="list" v-for="(item,index) in HotArticleLists"
             :key="index">
          <router-link tag="a" target="_blank" :to="{name:'ArticleDetails',query:{article_id: item.article_id}}">
            <span>{{item.title}}</span>
          </router-link>
        </div>

      </div>
    </div>
    <!--    点击排行 -->
    <div class="Click-list" v-if="ArticleClickLists.length!=0">
      <div class="Blogs-title">
        <span>点击排行</span>
      </div>
      <div class="list" v-for="(item,index) in ArticleClickLists"
           @click="$router.push({name:'ArticleDetails',query:{article_id: item.article_id}})"
           :key="index">
        <div class="tumb">
          <img :src="item.article_cover" alt="">
        </div>
        <div class="item">
          <div class="title">
            <span>{{item.title}}</span>
          </div>
          <div class="description">
            <span>{{item.description}}</span>
          </div>
        </div>
      </div>
    </div>
    <!--    友情链接-->
    <div class="blogroll">
      <div class="Blogs-title">
        <span>友情链接</span>
      </div>
      <div class="label">
        <a v-for="(item,index) in BlogrollLists" target="_blank" :href="item.link_url" :key="index">
          <span>{{item.link_name}}</span>
        </a>
      </div>
    </div>
    <!--    广告-->
    <div class="advertising">
      <a href="https://github.com/xiaobinxxx">
        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEsAwgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKac/hQApOKAcjNeMeM/jovhrxLc6VaaYl0tudryedj5u4xik0r9ojRLjamo2FxbMepj+cD+VAHtNFc/oPjXw/4jQHTdShlb/nnuAYfhW+CD0oAWijPNGecUAFFFFABRRRQAUUUUAFFFFABRSEgUZFAADQTxVS+1Oy023ae+uooIlGSztivO9b+OfhLSnMUEst9IO8K/L+dAHp+eKAc18/zftIN9pxb6EPKz1afnH5V7X4c1qHxFoNnqtuMR3EYbGc4PcfgaANaiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKpavfLp2k3d4/3YImkOfYVdri/itdGz+HGrupILwmPj3GKAPj/VLyTUNUubuUkvNIzsT6k1UoPJooAlt7me1mWWCV45FOQynBFeo+D/AI469obJb6mTqNoOPnPzqPr3rymigD7X8LePNC8XW4k067HnfxQOcOprpwc18GafqV5pV2l1Y3EkE6HKvGxBFemx/H3xSmlx22y3M6jBuCMk/hQB9TMcDOcCq0l/aw8y3UKDvukAr471P4n+MNUz52t3KBuqwuYx/wCO4rmrjVtRuyTcX1xKT18yUt/OgD7Zm8W+H7fiXV7Rf+2gNVG+IXhNDhtdtAfqf8K+JixJySTSZPrQB9tL8QfCbnC67aE/U/4Vbh8WaBc4EOr2jZ/6aAV8NZPrShiDnJoA+9Y761mA8q5hf/dcGrAIIyK+DrbWNSszm2v7mE9vLlZf5V02l/FHxhpRTydbuJFX+GdvMH60AfYGo6jZ6ZavdX1zHBCgyXc4ArxLxp8fooGe08Mw+aw4N1KOAfYd68e8UeO9f8XSA6peu8YxiJflQe+0cZrmqANfWvE2r+Iblp9TvprhycgOxIX6DtWRnNFFACgZOK+nP2fNZN54TudNdiWtJjtH+yef5mvmKva/2dL0p4m1G0z8sltu/HIoA+lKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArz/wCMys/w01IDttNegVzHxB0/+1PAusWqDMhtnKgdyAcUAfE9FKy7WKnqDikoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr139nlWbxxdEdFtST+deRV71+zjph+1arqZT5QghDe+QaAPoWik3UtABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUU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KaO+8F3mnEjckhBHoGBryLxHos+ha3c2U8ZXY52E917H8qurD3IyRjhasnXqU5ProbvwnvY9P+I2mTy/dyy/iVIH86+s49ctWO1iVPuK+ILS5ks7uK5hOJImDKfcc19J+EvFtj4m0uOSOVVu1UCWEnkEenrRQhTnpLcnH169C06ex6xFe2833JVP41YU5FcEOOmRirUOo3UPCynHoa2lgv5WctPOF/y8idrmjI9a5+28QDgXC49xWxDcxXCh4nDD2rlnSnD4kenQxdKsvcZYyPWimkc8U4dKzOkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEPSoLi5S3jZ5GwBViuV1y4Z7ryc/KnataNP2k+U5Mbifq9JzW/QhvtUmu2IDFY+y1Qoor14QUFZHylSpKrLmm7sM1Hc+attKYdom2N5ZPTOOKkpHUSIUboRg1VuhN9bnzlrHh/xXqWqTPdwTzuXOGZwR17c1c0r4Va5qEimcwWqHqXfJ/IV7Nd2D2/zKdyfyqoGKnIJB9qmOW0p+8pNnrf2pVatFJDfCXgbTPCqGWP8Af3hGGuHHQe3pXmvxY8Vw6xqEel2b77a1J3OP4n/zmvVjeSzafcWrPhpEKq3pmvIE+F+oyXR8+8iVCxO7kk1lXwtVL2dOOgYKpTdV1q8tVscFBbvczLDDGzyOcKqjJJr6J+HXhP8A4RjQt1wo+23PzSf7I7CovB/g/QtCcSRx+de4/wBbLzj6Cu171nRwrpu89xY/MFWXs6e35nPeMvDUfifw/JZYAuE+eFunzen4182X2nz6deSWt1C8U0ZwysK+tO9cv4r8MaFr8R+3xbbkDAljOHH+P406+GdR3juRl+O9h7k9vyPIPht4pj8Oa9tuTi0uRskP909jXs/iTwppPi+zX7QAJNuYriLqB2+oryW7+Fl4s5+yXkTx543ZzivT9M8/TtCtNOM25oYwrOO9Xh8LV/h1Foa46pTc1WoS948t1n4U6tp8rm0ngu4x02thsfSsa08MeKLC7SS2tJ4ZQeHRwP5GvbfcnJrRtNOaYB5GIX0rWWW0ormcmJZpWjG0kmWtG+2/2Laf2iQ155Y80juavUiqFUL6dPal+tUlbQ8qTu2wqSCeS3bdExU1HRSaT3Em07o6jTNVS6xG52yAf99Vrc4rg0kMTq6E5U5FdpazefbJJ6ivMxND2butmfSZbjHWjyT3RZopAc0tcp6gUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVyetwGO+MmDteusqpd2sd3CY2GAeh9K1o1PZzucmNwzxFLlW5xdFW7zT5rNjuUsnZh3qpXsRkpK6PlJwlB2krBRRRTIEZQ6lWGQa527iMNy6Y4zxXRjrWFqf/H630rowzalYqO5U9+9WruAIkUq/dcfrVXtWtcoDpMZ7gCuipK0olydrGQCyvuBIPYit+xuPPgUH7y8H3rBq/pMhW5K9mFTXjeF+wT2NC9ufs0JI+8eBWAxaQ7nJJPrV/VmLXQXsorPOccUUIJRuEFYsWsG+OSVuVQcCoK1YI9mjue7c1lVdNttjRYsovPukU9AcmugwBwOBWJpX/H6PpW3XNiG3KxnJ3YUUUVzkhRQD7Zp8cbyuFRSx9BQ3bca1dkIiGRwqjk9K7Oyh8m0jj7gc1naZpPkYmm5fsPStoCvLxVfnfKuh9FlmElSTqT3YAYpaKK5T1gooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApNoJpaKAI3jV1KsoYHsRWRd6DFKd0LFG9O1bdIV4q4TlB3iY1aFOsrTVzjp9KuoCcx7l9VqmVKnBBH1Fd5tz1qKWzt5vvxKfwrrjjX9pHlVcnT1pyOIHXpWDqf/H630r0WXQLR2JUMn0NYeoeDHuJjJFcgcdGFdmHxtJSvJ2OJ5ZiIva5xfatif/kDr9BU8vg7VIz8nlOPZj/hVq50PUF0wR+RuYAcA12VMTRk42kjKeFrK14s5arul/8AH4Poac2iamvWzk/DFWNO029jvFL20gHTJFbVKtNwdmTKlO2xT1MZvWOaqVqahp1694xW1kK+oWoBo+ot0tJPypwqwUFqhRpztazLcf8AyBj9DWPXTQ6NqD6Z5QtmDEdCRVWLwlqzjLRon1NY08RSi3eSKhhqzv7rKGlf8fo+lbfA61Y0/wAIXUEwklnjHHQZNbUfh+AH55GauPEYylzaO5qsuxMn8JztTxWdxN/q4nb8K6qHSbOE5EQJ9TzVtY1UYUYHtXJPGr7KOqlk8nrUl9xzlvoEjYad9o9B1rbtrGC1AEaAH171Z2j3pcCuSdac9z1KGDo0fhQAYpaKKyOsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACmleadRQA3bRtNOooATHHvSbfpTqKAG7fpRtNOooAbtpQoHalooAaVo206igAAxRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/2Q==" alt="">
      </a>
    </div>

    <!--    修改个人信息-->
    <el-dialog
      title="修改个人信息"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <el-form ref="form" :model="UserForm" label-width="80px">
        <el-form-item label="头像上传">
          <el-upload
            class="avatar-uploader"
            action="/upload/index/images"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="!headUrl && UserForm.headUrl" :src="UserForm.headUrl" class="avatar">
            <img v-else :src="headUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="照片墙">
          <el-upload
            class="avatar-uploader"
            action="/upload/index/images"
            :show-file-list="false"
            :on-success="photoAvatarSuccess"
            :before-upload="photoAvatarUpload">

            <img v-if="!photoUrl && UserForm.photoUrl"
                 :src="UserForm.photoUrl"
                 style="width: 200px;"
                 class="avatar">
            <img v-else :src="photoUrl"
                 style="width: 200px;"
                 class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="UserForm.nickname" maxlength="15" clearable></el-input>
        </el-form-item>
        <el-form-item label="签名">
          <el-input v-model="UserForm.signature" maxlength="25" clearable></el-input>
        </el-form-item>
        <el-form-item label="自我介绍">
          <el-input type="textarea" maxlength="50" v-model="UserForm.introduce" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirmUser">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
  import {Register, MenberLogin, HotClickArticleList,UpdateUser,BlogrollList} from "../../axios/api";

  export default {
    name: "BlogsRight",
    data() {
      return {
        // 账号
        UserName: '',
        // 密码
        PassWord: '',
        // 确认密码
        RegPassWord: '',
        // 用户状态 0 未登录 1 已登录 2 在注册
        UserStatus: 0,
        // 用户信息
        MemberInfo: {},
        // 热门文章列表
        HotArticleLists: [],
        // 点击排行列表
        ArticleClickLists: [],
        // 热门banner
        ClickBanner: [],
        // 昵称
        nickname:'',
        dialogVisible: false,
        // 用户表单提交数据
        UserForm: {
          photoUrl: '',
          headUrl: '',
          nickname: '',
          signature: '',
          introduce: '',
        },
        headUrl: '',
        photoUrl: '',
        // 友情链接
        BlogrollLists: [],
      }
    },
    created() {
      this.UserForm.headUrl = this.Global.MemberInfo.portrait;
      this.UserForm.photoUrl = this.Global.MemberInfo.wallpaper;
      this.UserForm.nickname = this.Global.MemberInfo.nickname;
      this.UserForm.signature = this.Global.MemberInfo.description;
      this.UserForm.introduce = this.Global.MemberInfo.introduction;


      if (this.Global.member_id != '') {
        this.Global.UserStatus = 1;
      }
    },
    mounted() {
      this.getData();
      this.BlogroData();
    },
    methods: {
      /**
       * 热门文章
       */
      getData() {
        HotClickArticleList({}).then(res => {
          this.HotArticleLists = res.data.HotArticleList;
          this.ArticleClickLists = res.data.ArticleClickList;
          this.ClickBanner = res.data.ClickBanner;
        })
      },
      /**
       * 友情链接数据
       */
      BlogroData(){
        BlogrollList().then(res =>{
          this.BlogrollLists = res.data;
        })
      },
      /**
       * 注册
       */
      onRegIster() {
        let reg = /^\w+$/;
        if (this.UserName === '') {
          this.$message('请输入用户名');
          return;
        }
        if (!reg.test(this.UserName)) {
          this.$message('账号只能为字母和数字的组合');
          return;
        }
        if(this.PassWord.length < 6 || this.PassWord.length >= 20 ){
          this.$message('密码必须大于6位或小于等于20位');
          return;
        }
        if (this.PassWord === '') {
          this.$message('请输入密码');
          return;
        }
        if (this.RegPassWord === '') {
          this.$message('请输入确认密码');
          return;
        }
        if (!reg.test(this.PassWord)) {
          this.$message('密码只能为字母和数字的组合');
          return;
        }
        if (this.PassWord != this.RegPassWord) {
          this.$message('两次密码不一致');
          return;
        }
        if (!this.nickname) {
          this.$message('请输入昵称');
          return;
        }
        // 注册
        Register({
          username: this.UserName,
          password: this.PassWord,
          reg_password: this.RegPassWord,
          nickname: this.nickname,
        }).then(res => {
          this.Global.UserStatus = 0;
          this.$message(res.message);
          this.$forceUpdate();
        })
      },
      /**
       * 登录
       */
      onLogin() {
        let reg = /^\w+$/;
        if (this.UserName === '') {
          this.$message('请输入用户名');
          return;
        }
        if (!reg.test(this.UserName)) {
          this.$message('账号只能为字母和数字的组合');
          return;
        }
        if (this.PassWord === '') {
          this.$message('请输入密码');
          return;
        }
        if (!reg.test(this.PassWord)) {
          this.$message('密码只能为字母和数字的组合');
          return;
        }
        MenberLogin({
          username: this.UserName,
          password: this.PassWord,
        }).then(res => {
          this.Global.MemberInfo = res.data;
          this.Global.member_id = res.data.member_id;
          this.Global.username = res.data.username;
          this.UserForm.headUrl = this.Global.MemberInfo.portrait;
          this.UserForm.photoUrl = this.Global.MemberInfo.wallpaper;
          this.UserForm.nickname = this.Global.MemberInfo.nickname;
          this.UserForm.signature = this.Global.MemberInfo.description;
          this.UserForm.introduce = this.Global.MemberInfo.introduction;
          localStorage.setItem('MemberInfo', JSON.stringify(this.Global.MemberInfo));
          this.Global.UserStatus = 1;
          this.$forceUpdate();
          this.$message({
            message: res.message,
            type: 'success'
          });
        })
      },
      /**
       * 退出登录
       */
      onQuit() {
        localStorage.removeItem('MemberInfo');
        this.Global.MemberInfo = {};
        this.Global.member_id = '';
        this.Global.UserStatus = 0;
        this.$forceUpdate();
      },
      handleClose(){
        this.dialogVisible = false;
      },
      /**
       * 头像上传
       */
      handleAvatarSuccess(res, file) {
        this.headUrl = URL.createObjectURL(file.raw);
        this.UserForm.headUrl = res.data.url;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          return
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return
        }
        return isJPG && isLt2M;
      },
      /**
       * 照片墙上传
       */
      photoAvatarSuccess(res, file) {
        this.photoUrl = URL.createObjectURL(file.raw);
        this.UserForm.photoUrl = res.data.url;
      },
      photoAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          return
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return
        }
        return isJPG && isLt2M;
      },
      /**
       * 用户更新点击
       */
      onConfirmUser(){
        UpdateUser({
          photoUrl: this.UserForm.photoUrl,
          headUrl: this.UserForm.headUrl,
          nickname: this.UserForm.nickname,
          signature: this.UserForm.signature,
          introduce: this.UserForm.introduce,
        }).then(res =>{
          this.dialogVisible = false;
          this.Global.MemberInfo = res.data;
          this.Global.member_id = res.data.member_id;
          this.Global.username = res.data.username;
          this.UserForm.headUrl = this.Global.MemberInfo.portrait;
          this.UserForm.photoUrl = this.Global.MemberInfo.wallpaper;
          this.UserForm.nickname = this.Global.MemberInfo.nickname;
          this.UserForm.signature = this.Global.MemberInfo.description;
          this.UserForm.introduce = this.Global.MemberInfo.introduction;
          localStorage.setItem('MemberInfo', JSON.stringify(this.Global.MemberInfo));
          this.$message({
            message: res.message,
            type: 'success'
          });
        })
      },
      /**
       * 广告跳转点击
       */
      onAdSkip(item){
        console.log(item);
        switch (item.ad_skip) {
          case 0:
            this.$router.push({name:'ArticleDetails',query:{article_id: item.article_id}});
            break;
          case 1:
            window.location.href = item.skip_link;
            break;
        }
      }
    },
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
<style scoped lang="scss">
  @import "../../../static/css/style";
  @import "BlogsRight.scss";
</style>
