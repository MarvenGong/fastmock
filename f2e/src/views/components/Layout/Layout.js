/* global http */
import React, { Component } from 'react';
import { Layout, Icon, Modal, Dropdown, Menu, message } from 'antd';
import userLogin from '../../../utils/UserLogin';
import { NavLink } from 'react-router-dom';
import { createHashHistory } from 'history';
import './Layout.scss';
import ModifyPwd from './ModifyPwd';
const { Header, Content, Footer } = Layout;
const history = createHashHistory();
class PageLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      modifyPwdVisible: false,
      userInfo: {
        role: 0,
        username: ''
      },
      selectedStyle: {
        color: '#fff'
      }
    };
  }
  logout = () => {
    // e.preventDefault();
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
  handleModifyPwdOk = () => {
  }
  handleModifyPwdCancel = () => {
    this.setState({ modifyPwdVisible: false });
  }
  onModifyPwdSuccess = () => {
    this.setState({ modifyPwdVisible: false });
    message.success('修改成功，请重新登录');
    userLogin.removeLoginInfo();
    setTimeout(() => {
      history.push('/');
    }, 2000);
  }
  onUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.logout();
    } else {
      this.setState({ modifyPwdVisible: true });
    }
  }
  render() {
    const userMenu = (
      <Menu onClick={ this.onUserMenuClick }>
        <Menu.Item key="logout"><Icon type="logout"></Icon> 退出登录</Menu.Item>
        <Menu.Item key="modifyPwd"><Icon type="setting"></Icon> 修改密码</Menu.Item>
      </Menu>
    );
    return (
      <section className="root-layout">
        <Layout className="layout">
          <Header className="header" style={{ height: '60px' }}>
            <div className="my-container">
              <div className="logo">
                <img height="26" style={{ marginTop: '-5px' }} src="/assets/images/fastmock-logo.jpg" alt=""/>
              </div>
              <ul className="header-nav">
                {/* <li><NavLink to='/home' activeStyle ={this.state.selectedStyle}><Icon type="home" /> 首页</NavLink></li> */}
                <li><NavLink to='/projects' activeStyle ={this.state.selectedStyle}><Icon type="appstore" /> 我的项目</NavLink></li>
                <li><a rel="noopener noreferrer" target="_blank" href="//fmdocs.fastmock.site">
                  <Icon type="book" /> 使用文档</a>
                </li>
                <li><a rel="noopener noreferrer" target="_blank" href="https://github.com/MarvenGong/fastmock">
                  <Icon type="github" /> Github</a>
                </li>
                <li><a rel="noopener noreferrer" class="animated animated-2s customBreath" target="_blank" href="https://fmdocs.fastmock.site/book/support.html">
                  <Icon theme="filled" type="heart" /> 支持fastmock</a>
                </li>
                <li><NavLink to='/feedback' activeStyle ={this.state.selectedStyle}><Icon type="question" /> 问题与建议</NavLink></li>
                {this.state.userInfo.role / 1 === 1 &&
                  <li><a rel="noopener noreferrer" target="_blank" href='/admin/users'><Icon type="windows" /> 后台管理</a></li>
                }
              </ul>
              <div className="right-user">
                <Dropdown
                  overlay={userMenu}
                  trigger={['click']}>
                  <a><Icon type="user"></Icon> {this.state.userInfo.username} <Icon type="down" /></a>
                </Dropdown>
                {/* <a href="javascript:;" onClick={this.logout}><Icon type="logout"></Icon> 退出登录</a> */}
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
          <Footer className="p-footer">
            <p>&copy; All rights reserved FastMock在线Mock平台</p>
            <p className="beian">渝ICP备19000613号-2</p>
          </Footer>
        </Layout>
        <Modal
          footer={null}
          title="修改登录密码"
          visible={this.state.modifyPwdVisible}
          onOk={this.handleModifyPwdOk}
          onCancel={this.handleModifyPwdCancel}
        >
          <ModifyPwd
            onSuccess={this.onModifyPwdSuccess}/>
        </Modal>
      </section>
    );
  }
};
export default PageLayout;
