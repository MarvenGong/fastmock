/* global http */
import React, { Component } from 'react';
import {
  Form, Icon, Input, Button, message
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
          <div style={{ textAlign: 'center' }}><Link to="/register" className="login-link" >还没有账号？注册账号</Link></div>
        </FormItem>
      </Form>
    );
  }
}
const LoginFormRouter = withRouter(LoginForm);
export default LoginFormRouter;
