//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/session',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: res => {
            // console.log(res);
            this.globalData.openId = res.data.openId
            this.globalData.sessionKey = res.data.sessionKey
            this.globalData.hasOpenId = true
            this.globalData.authorized = res.data.authorized
            if (res.data.authorized) {
              this.globalData.employeeId = res.data.employeeId
              this.globalData.employeeName = res.data.employeeName
              wx.request({
                url: this.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/' + this.globalData.employeeId,
                data: {
                  appid: this.globalData.restId,
                  token: this.globalData.restToken
                },
                header: {
                  'content-type': 'application/json'
                },
                method: 'GET',
                success: res => {
                  this.globalData.defaultCompany = res.data.company,
                    this.globalData.defaultCompanyName = res.data.companyName,
                    this.globalData.defaultDeptId = res.data.deptno,
                    this.globalData.defaultDeptName = res.data.deptname
                },
                fail: fail => {
                  console.log(fail)
                }
              })
            }
            if (this.sessionInfoReadyCallback) {
              this.sessionInfoReadyCallback(res.data)
            }
          },
          fail: fail => {
            console.log(fail)
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // 还未授权
          wx.switchTab({
            url: '/pages/profile/profile'
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    hasOpenId: false,
    openId: null,
    sessionKey: null,
    authorized: false,
    employeeId: null,
    employeeName: null,
    defaultCompany: null,
    defaultCompanyName: null,
    defaultDeptId: null,
    defaultDeptName: null,
    restAdd: 'https://i2.hanbell.com.cn',
    restId: '1505912014724',
    restToken: '0ec858293fccfad55575e26b0ce31177',
    restAuth: 'appid=1505912014724&token=0ec858293fccfad55575e26b0ce31177'
  }
})