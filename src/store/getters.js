const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name:state => state.user.userInfo.username,
  userId:state => state.user.userInfo.userId,
  staffPhoto:state => state.user.userInfo.staffPhoto,
  // userInfo不能定义为null，如果定义为null，null.companyId会报错
  companyId:state => state.user.userInfo.companyId,
  
}
export default getters
