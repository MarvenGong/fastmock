/* global http */
import React, { Component } from 'react';
import {
  Form, Icon, Input, Button, message, Modal, Spin
} from 'antd';
import { withRouter, Link } from 'react-router-dom';
import userLogin from '../../utils/UserLogin';
import ETools from 'etools';
const FormItem = Form.Item;
class LoginForm extends Component {
  state = {
    loginLoading: false,
    userNeedActive: false,
    sendCodeLoading: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err, formData) => {
      if (!err) {
        this.setState({
          loginLoading: true
        });
        const resp = await http.post('/api/login', {
          username: formData.username,
          password: formData.password
        }, false);
        this.setState({
          loginLoading: false
        });
        if (resp.success) {
          userLogin.setLoginInfo(resp.data.userInfo);
          message.success('登录成功，正在跳转...', 1);
          await ETools.async.wait(1000);
          this.props.history.push('/projects');
        } else if (resp.code === '0005') {
          this.setState({
            userNeedActive: true,
            user: resp.data.user
          });
        }
      }
    });
  }
  handleSendCode = async() => {
    this.setState({ sendCodeLoading: true });
    const resp = await http.get('/api/resendCode', {
      userId: this.state.user.id
    }, false);
    this.setState({ sendCodeLoading: false });
    if (resp.success) {
      message.success('发送成功，请登录邮箱注册', 2);
      Modal.success({
        title: '提示',
        content: `发送成功，请登录邮箱${this.state.user.email}激活账号`
      });
      this.setState({
        userNeedActive: false
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }]
          })(
            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }]
          })(
            <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          <Button size="large" loading={this.state.loginLoading} type="primary" htmlType="submit" className="login-form-button">
            登  录
          </Button>
          <div style={{ height: '38px' }}>
            <Link to="/register" style={{ float: 'left' }} className="login-link" >还没有账号？注册账号</Link>
            <Link to="/forgetpwd" style={{ float: 'right' }} className="login-link" >忘记密码</Link>
          </div>
          {this.state.userNeedActive &&
            <div>
              {this.state.sendCodeLoading &&
                <a href="javascript:;" style={{ color: '#f33' }} className="login-link" ><Spin /> 发送中...</a>
              }
              {!this.state.sendCodeLoading &&
                <a href="javascript:;" style={{ color: '#f33', display: 'block' }} onClick={this.handleSendCode} className="login-link" >
                  <span style={{ whiteSpace: 'nowrap' }}>{'发送激活链接到' + this.state.user.email}</span>
                </a>
              }
            </div>
          }
        </FormItem>
      </Form>
    );
  }
}
const LoginFormRouter = withRouter(LoginForm);
export default LoginFormRouter;
