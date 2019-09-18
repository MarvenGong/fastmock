/* global http */
import React, { Component } from 'react';
import {
  Form, Icon, Input, Button, message
} from 'antd';
import { withRouter, Link } from 'react-router-dom';
const FormItem = Form.Item;
class LoginForm extends Component {
  state = {
    loginLoading: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err, formData) => {
      if (!err) {
        this.setState({
          loginLoading: true
        });
        const resp = await http.post('/api/register', formData, false);
        this.setState({
          loginLoading: false
        });
        if (resp.success) {
          message.success('注册成功，正在跳转到登录页面...', 1);
          this.props.history.push('/');
        }
      }
    });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
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
              { required: true, message: '请输入登录账号!' },
              { max: 20, message: '用户名不能超过20个字符!' }
            ]
          })(
            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入正确格式的邮箱' }]
          })(
            <Input size="large" prefix={<Icon type="folder" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱（用于找回密码）" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('nickname', {
            rules: [
              { required: true, message: '请输入昵称!' },
              { max: 20, message: '昵称不能超过20个字符!' }
            ]
          })(
            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="昵称（在本站的称呼）" />
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
          {getFieldDecorator('repassword', {
            rules: [{ required: true, message: '请再次输入密码确认!' }, { validator: this.compareToFirstPassword }]
          })(
            <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="重复密码" />
          )}
        </FormItem>
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
