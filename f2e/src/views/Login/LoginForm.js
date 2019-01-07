/* global http */
import React, { Component } from 'react';
import {
  Form, Icon, Input, Button, message, Divider
} from 'antd';
import { withRouter, Link } from 'react-router-dom';
import userLogin from '../../utils/UserLogin';
import ETools from 'etools';
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
        }
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Divider>登录</Divider>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          <a className="login-form-forgot" href="">忘记密码？</a>
          <Button size="large" loading={this.state.loginLoading} type="primary" htmlType="submit" className="login-form-button">
            登  录
          </Button>
          <Link to="/register">注册!</Link>
        </FormItem>
      </Form>
    );
  }
}
const LoginFormRouter = withRouter(LoginForm);
export default LoginFormRouter;
