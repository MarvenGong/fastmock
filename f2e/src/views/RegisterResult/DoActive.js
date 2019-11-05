/* global http */
import React from 'react';
import './style.scss';
export default class DoActive extends React.Component {
  state = {
    activeDone: false,
    activeInfo: '',
    activeSuccess: false
  }
  doActive = async(code) => {
    const resp = await http.post('/api/active', {
      activeCode: code
    }, false);
    this.setState({ activeDone: true });
    if (resp.success) {
      this.setState({ activeSuccess: true });
      // 激活成功，跳转登录页面
      setTimeout(() => {
        this.props.history.push('/');
      }, 2000);
    } else {
      this.setState({ activeSuccess: false, activeInfo: resp.desc });
    }
  }
  handleResend = () => {
    alert('重新发送');
  }
  componentDidMount() {
    const { code } = this.props.match.params;
    this.doActive(code);
  }
  render() {
    return (
      <section className="rr">
        <div className="title">激活账号</div>
        <h2>等待激活</h2>
        {!this.state.activeDone &&
          <p>激活中...</p>
        }
        {this.state.activeSuccess &&
          <p>激活成功，即将跳转到登录页面...</p>
        }
        {!this.state.activeSuccess &&
          <p>{this.state.activeInfo} <a href="javascript:;" onClick={this.handleResend}>重新发送</a></p>
        }
      </section>
    );
  }
};
