// pages/profile/profile.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wechatUser: {
      employeeId: '',
      employeeName: '',
      mobile: ''
    },
    checkCode: '',
    btnSendDisplay: '获取验证码',
    canSendCode: true,
    canSubmit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (app.globalData.userInfo) {
      _this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
    wx.request({
      url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser',
      data: {
        openId: app.globalData.openId,
        nickName: app.globalData.userInfo.nickName
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {},
      fail: function (fail) {
        console.log(fail);
      }
    });
  },

  bindEmployeeIdChange(e) {
    let employeeId = 'wechatUser.employeeId';
    this.setData({
      [employeeId]: e.detail
    })
  },
  bindEmployeeNameChange(e) {
    let employeeName = 'wechatUser.employeeName';
    this.setData({
      [employeeName]: e.detail
    })
  },
  bindMobileChange(e) {
    let mobile = 'wechatUser.mobile';
    this.setData({
      [mobile]: e.detail
    })
  },
  bindCheckCodeChange(e) {
    this.setData({
      checkCode: e.detail
    })
  },
  bindSendCodeTap(e) {
    let canSend = true
    let errmsg = ''
    // let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (!this.data.wechatUser.mobile || this.data.wechatUser.mobile == '' || this.data.wechatUser.mobile.length != 11) {
      canSend = false;
      errmsg += '手机号码长度错误\r\n'
    }
    // if (!reg.test(this.data.wechatUser.mobile)) {
    //   canSend = false
    //   errmsg += '手机号码格式错误\r\n'
    // }
    if (canSend) {
      let waits = 60;
      let fn = setInterval(() => {
        waits--
        let v = '等待(' + waits + ')秒'
        this.setData({
          btnSendDisplay: v
        })
      }, 1000, waits)
      setTimeout(() => {
        this.setData({
          btnSendDisplay: '获取验证码',
          canSendCode: true
        })
        clearInterval(fn)
      }, 60000)
      // 获取校验码
      wx.request({
        url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/checkcode',
        data: {
          openid: app.globalData.openId,
          sessionkey: app.globalData.sessionKey,
          mobile: this.data.wechatUser.mobile
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: res => {
          // console.log(res.data)
          this.setData({
            canSubmit: true,
            canSendCode: false
          })
        },
        fail: fail => {
          console.log(fail.errMsg)
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      })
    }
  },
})