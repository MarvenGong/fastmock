/* global http */
import React, { Component } from 'react';
import { Layout, Icon, Modal } from 'antd';
import userLogin from '../../../utils/UserLogin';
import { NavLink } from 'react-router-dom';
import { createHashHistory } from 'history';
import './Layout.scss';
const { Header, Content, Footer } = Layout;
const history = createHashHistory();
class PageLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      userInfo: {
        role: 0,
        username: ''
      },
      selectedStyle: {
        color: '#fff'
      }
    };
  }
  logout = (e) => {
    e.preventDefault();
    Modal.confirm({
      title: '提示',
      content: '确定要退出吗？',
      okText: '确认',
      async onOk() {
        let resp = await http.get('/api/logout', {});
        if (resp.success) {
          userLogin.removeLoginInfo();
          history.push('/');
        }
      },
      cancelText: '取消'
    });
  }
  componentWillMount() {
    this.setState({
      userInfo: userLogin.getLoginInfo()
    });
  }
  render() {
    return (
      <section className="root-layout">
        <Layout className="layout">
          <Header className="header" style={{ height: '60px' }}>
            <div className="my-container">
              <div className="logo">
                <img height="26" style={{ marginTop: '-5px' }} src="./assets/images/fastmock-logo.jpg" alt=""/>
              </div>
              <ul className="header-nav">
                {/* <li><NavLink to='/home' activeStyle ={this.state.selectedStyle}><Icon type="home" /> 首页</NavLink></li> */}
                <li><NavLink to='/projects' activeStyle ={this.state.selectedStyle}><Icon type="appstore" /> 我的项目</NavLink></li>
                <li><a rel="noopener noreferrer" target="_blank" href="https://marvengong.github.io/fastmock-docs/book/">
                  <Icon type="book" /> 使用文档</a>
                </li>
                <li><NavLink to='/feedback' activeStyle ={this.state.selectedStyle}><Icon type="question" /> 问题与建议</NavLink></li>
                {this.state.userInfo.role / 1 === 1 &&
                  <li><a rel="noopener noreferrer" target="_blank" href='/admin/users'><Icon type="windows" /> 后台管理</a></li>
                }
              </ul>
              <div className="right-user">
                <a><Icon type="user"></Icon> {this.state.userInfo.username}</a>
                <a href="javascript:;" onClick={this.logout}><Icon type="logout"></Icon> 退出登录</a>
              </div>
            </div>
          </Header>
          <Content style={{ backgroundColor: '#f5f5f5' }}>
            <div style={{ minHeight: 280 }}>
              {/* {this.props.children || 'Welcome to your Inbox'} */}
              {/* <Redirect path="/" to={{ pathname: '/projects' }}></Redirect>
              <Route path="/home" component={Home}></Route>
              <Route path="/projects" component={Projects}></Route>
              <Route path="/handbook" component={Handbook}></Route>
              <Route exact path="/project/:id" component={Api}></Route>
              <Route path="/project/:id/menber/:pname" component={ProjectMenbers}></Route>
              <Route path="/feedback" component={Feedback}></Route> */}
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            FastMock在线Mock平台
          </Footer>
        </Layout>
      </section>
    );
  }
};
export default PageLayout;
