import React from 'react';
import LoginForm from './LoginForm';
import LoginCountData from './LoginCountData';
import './Login.scss';
import { Form, Popover, Icon, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import toastr from 'toastr';
import userLogin from '../../utils/UserLogin';
let EnhancedForm = Form.create()(LoginForm);
class Login extends React.Component {
  state = {
    showGuide: false
  }
  hideGuide = () => {
    this.setState({ showGuide: false });
    localStorage.setItem('fastmockHomeGuide', 'yes');
  }
  componentWillMount() {
    // 如果用户已经登录过了，直接跳转到项目首页
    if (userLogin.isLogin()) {
      this.props.history.push('/projects');
    }
  }
  componentDidMount() {
    toastr.remove();
    if (!localStorage.getItem('fastmockHomeGuide')) {
      this.setState({ 'showGuide': true });
    }
  }
  render() {
    const qqGroupImg = (
      <img width="150" src="/assets/images/qq-group.jpeg"/>
    );
    return (
      <div className="login-body">
        <div className="nav">
          <a rel="noopener noreferrer" target="_blank" href="//fmdocs.fastmock.site">
            <Icon type="book" /> 使用文档</a>
          <a rel="noopener noreferrer" target="_blank" href="https://github.com/MarvenGong/fastmock">
            <Icon type="github" /> Github</a>
          <Popover content={qqGroupImg} title="扫码进群">
            <span><Icon type="qq"></Icon>QQ交流群</span>
          </Popover>
        </div>
        <div className="login-main">
          <div className="login-left-data">
            <LoginCountData/>
          </div>
          <div className="login">
            <div className="inset animated customClipX">
              <div className="login-logo">
                <img src="/assets/images/logo-blue.png" width="396"></img>
              </div>
              <h2 className="login-title">用户登录</h2>
              <EnhancedForm></EnhancedForm>
              <h4>关于fastmock</h4>
              <div>
              fastmock可以让你在没有后端程序的情况下能真实地在线模拟ajax请求，
              你可以用fastmock实现项目初期纯前端的效果演示，也可以用fastmock实现开发中的数据模拟从而实现前后端分离
              </div>
            </div>
          </div>
        </div>
        <div className="login-footer">
          <p>&copy; All rights reserved FastMock在线Mock平台</p>
          <p className="beian">渝ICP备19000613号-2</p>
        </div>
        {this.state.showGuide &&
          <div className="home-guide animated customFadeIn">
            <div className="guide-box">
              <p>您没有进错网站，fastmock UI改版了</p>
              <p>扫码加入我们的QQ交流群</p>
              <p>方便我们快速处理您遇到的问题</p>
              <p style={{ marginBottom: '10px' }}>也可以与其他人一起交流</p>
              <Button onClick={this.hideGuide} size="small" type="primary">我知道了</Button>
            </div>
          </div>
        }
      </div>
    );
  }
};
export default withRouter(Login);
