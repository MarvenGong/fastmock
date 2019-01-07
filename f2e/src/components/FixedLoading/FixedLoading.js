import { Spin } from 'antd';
import React from 'react';
import './style.scss';
class FixedLaoding extends React.Component {
  constructor() {
    super();
    this.state = {
      tip: '加载中',
      bgColor: '#fff'
    };
  }
  render() {
    return (
      <div className="overlay" style={{ backgroundColor: this.state.bgColor || this.props.bgColor }}>
        <Spin tip={this.props.tip || this.state.tip} spinning={true}></Spin>
      </div>
    );
  }
};
export default FixedLaoding;
