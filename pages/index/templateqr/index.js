var wxbarcode = require("../../../utils/index.js");
var Api = require('../../../utils/api.js');
var Req = require('../../../utils/req.js');
Page({
  data: {
    template: {},
    title: "",
    newTemplateList: [],
  },
  onLoad: function () {
    this.getHomeNewTemplate();
  },
  //点击切换方案二维码
  onTapTag: function (e) {
    var index = e.currentTarget.dataset.index;
    var showQr = e.currentTarget.dataset.url;
    var title = e.currentTarget.dataset.title;

    if (showQr) {
      wxbarcode.qrcode('qrcode', showQr, 380, 380);
    }
    var that = this;
    var value = wx.getStorageSync('templateList');

    that.setData({
      template: value[index]
    })
  },
  onPullDownRefresh :function(){
    this.getHomeNewTemplate();
  },
  getHomeNewTemplate: function () {
    var that = this;
    Req.req_post(Api.getHomeNewTemplate({
      token: Api.getToken()
    }), "", function success(res) {
      var lastList = new Array();
      if (res.data.model.commonList) {
        lastList = res.data.model.commonList;
        //显示顶部二维码
        var showQr = lastList[0].weixinUrl;
        if (showQr) {
          wxbarcode.qrcode('qrcode', showQr, 380, 380);
        }
      }
      //最新
      if (res.data.model.newList) {
        Array.prototype.push.apply(lastList, res.data.model.newList);
        wx.setStorageSync('templateList', lastList);
      }
      console.log(res.data.model.commonList[0].author + "/");
      that.setData({
        newTemplateList: lastList,
        template: lastList[0]
      })
      wx.stopPullDownRefresh() //停止下拉刷新
    }, function fail(res) {
    })
  }
})



