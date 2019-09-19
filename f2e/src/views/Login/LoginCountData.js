/* global http */
import React from 'react';
import { Icon } from 'antd';
import CountTo from 'react-count-to';
import './LoginCountData.scss';
export default class LoginCountData extends React.Component {
  countDataTimer = null
  state = {
    dataLoading: false,
    countData: {
      users: 0
    }
  }
  async getCountData() {
    this.setState({ dataLoading: true });
    const resp = await http.get('/api/countData');
    this.setState({ dataLoading: false });
    if (resp.success) {
      this.setState({
        'countData': resp.data
      });
    }
  }
  componentDidMount() {
    this.getCountData();
    this.countDataTimer = setInterval(() => {
      this.getCountData();
    }, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.countDataTimer);
  }
  render() {
    return (
      <>
        <div className="data-grid">
          <p className="icon"><Icon type="user"></Icon></p>
          <p className="number">
            {!this.state.dataLoading &&
              <CountTo to={this.state.countData.users} speed={500} />
            }
          </p>
          <p className="name">当前总用户数</p>
        </div>
        <div className="data-grid" style={{ backgroundColor: '#68befb' }}>
          <p className="icon"><Icon type="appstore"></Icon></p>
          <p className="number">
            {!this.state.dataLoading &&
              <CountTo to={this.state.countData.projects} speed={500} />
            }
          </p>
          <p className="name">当前总项目数</p>
        </div>
        <div className="data-grid" style={{ backgroundColor: '#26818c' }}>
          <p className="icon"><Icon type="cluster" /></p>
          <p className="number">
            {!this.state.dataLoading &&
              <CountTo to={this.state.countData.apis} speed={500} />
            }
          </p>
          <p className="name">当前总接口数</p>
        </div>
        <div className="data-grid">
          <p className="icon"><Icon type="eye"></Icon></p>
          <p className="number">
            {!this.state.dataLoading &&
              <CountTo to={this.state.countData.mocks} speed={500} />
            }
          </p>
          <p className="name">接口访问数</p>
        </div>
      </>
    );
  }
};
