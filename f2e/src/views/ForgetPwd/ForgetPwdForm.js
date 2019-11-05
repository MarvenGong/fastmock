/* global http */
import React, { Component } from 'react';
import {
  Form, Icon, Input, Button, message
} from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { spawn } from 'child_process';
const FormItem = Form.Item;
class LoginForm extends Component {
  state = {
    loginLoading: false,
    searchLoading: false,
    sendCodeLoading: false,
    modifyUser: {},
    emailCodeTimeout: 0
  }
  sendEmailCodeTimer = null;
  handleSearchUser = async() => {
    const form = this.props.form;
    this.setState({ searchLoading: true });
    const resp = await http.get('/api/searchUserExact', {
      key: this.props.form.getFieldValue('username')
    }, false);
    this.setState({ searchLoading: false });
    if (resp.success && resp.data.length > 0) {
      const user = resp.data[0];
      this.setState({ modifyUser: resp.data[0] });
      form.setFieldsValue({
        'email': user.email
      });
    } else {
      message.error('没有找到相关用户，请确认信息后重试！');
      this.setState({
        modifyUser: {}
      });
    }
  }
  // 发送验证码
  handleSendCode = async() => {
    const form = this.props.form;
    this.setState({ sendCodeLoading: true });
    const resp = await http.get('/api/sendForgetPwdCode', {
      email: form.getFieldValue('email')
    }, false);
    if (resp.success) {
      this.setState({ sendCodeLoading: false, emailCodeTimeout: 60 });
      this.sendEmailCodeTimer = setInterval(() => {
        this.setState({ emailCodeTimeout: this.state.emailCodeTimeout - 1 });
      }, 1000);
      if (this.state.emailCodeTimeout === 0 && this.sendEmailCodeTimer) {
        clearInterval(this.sendEmailCodeTimer);
      }
    }
  }
  // 确认重置密码
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err, formData) => {
      if (!err) {
        this.setState({ loginLoading: true });
        const resp = await http.post('/api/sureForgetPwd', formData, false);
        this.setState({ loginLoading: false });
        if (resp.success) {
          message.success('重置密码成功，正在跳转到登录页面...', 2);
          setTimeout(() => {
            this.props.history.push('/');
          }, 2000);
        }
      }
    });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPwd')) {
      callback('两次输入的密码不一致，请重新输入'); // eslint-disable-line
    } else {
      callback();
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: '请输入用户名或邮箱或昵称!' },
              { max: 20, message: '用户名不能超过20个字符!' }
            ]
          })(
            <Input size="large" addonAfter={
              (<Button loading={this.state.searchLoading} onClick={this.handleSearchUser}>查找</Button>)
            } prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </FormItem>
        {this.state.modifyUser.id &&
          <>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '请输入正确格式的邮箱' }]
            })(
              <Input readOnly size="large" addonAfter={
                (<Button loading={this.state.sendCodeLoading}
                  disabled={this.state.emailCodeTimeout !== 0}
                  onClick={this.handleSendCode}>发送验证码
                  {this.state.emailCodeTimeout !== 0 &&
                    <span>({this.state.emailCodeTimeout}s)</span>
                  }
                </Button>)
              } prefix={<Icon type="folder" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱（用于激活账号和找回密码）" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('code', {
              rules: [
                { required: true, message: '请输入验证码!' },
                { max: 20, message: '昵称不能超过4个字符!' }
              ]
            })(
              <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="验证码" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('newPwd', {
              rules: [{ required: true, message: '请输入密码!' }]
            })(
              <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('repeatNewPwd', {
              rules: [{ required: true, message: '请再次输入密码确认!' }, { validator: this.compareToFirstPassword }]
            })(
              <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="重复密码" />
            )}
          </FormItem>
          </>
        }
        <FormItem>
          <Button size="large" loading={this.state.loginLoading} type="primary" htmlType="submit" className="login-form-button">
            提  交
          </Button>
          <div style={{ textAlign: 'center' }}><Link className="login-link" to="/">已经有账号？返回登录</Link></div>
        </FormItem>
      </Form>
    );
  }
}
const LoginFormRouter = withRouter(LoginForm);
export default LoginFormRouter;
