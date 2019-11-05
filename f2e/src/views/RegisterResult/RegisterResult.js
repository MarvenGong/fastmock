/* global http */
import React from 'react';
import './style.scss';
import { message } from 'antd';
export default class RegisterResult extends React.Component {
  state = {
    isActive: false,
    userId: 0,
    resendLoading: false
  }
  componentDidMount() {
    this.setState({ userId: this.props.match.params.userId });
  }
  handleResend = async() => {
    this.setState({ resendLoading: true });
    const resp = await http.get('/api/resendCode', {
      userId: this.state.userId
    }, false);
    this.setState({ resendLoading: false });
    if (resp.success) {
      message.success('发送成功，请登录邮箱注册', 2);
    }
  }
  render() {
    return (
      <section className="rr">
        <div className="title">最后一步，激活账号</div>
        <h2 className="text-success">登录邮箱完成注册！</h2>
        <p>激活邮件已发送至您的邮箱，请在30分钟内点击邮件中的链接完成注册</p>
        <p>没有收到？<a href="javascript:;" onClick={this.handleResend}>重新发送</a></p>
        <p>如您还是未收到邮件，请确认邮件是否在邮箱的回收站中或垃圾邮件中</p>
      </section>
    );
  }
};
