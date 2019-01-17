/* global http */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FixedLoading } from '@/components';
import { PageLayout } from '@/views/components';
import PageInfo from '@/views/components/PageInfo';
import { message, Form, Row, Col, Card, Icon, Spin, Button, Modal, Radio, Alert, Input } from 'antd';
import ProjectForm from './ProjectForm';
import userLogin from '@/utils/UserLogin';
import './style.scss';
let EnhancedProjectForm = Form.create()(ProjectForm);
class Projects extends Component {
  state = {
    pjLoading: true,
    pjList: [],
    modifyVisible: false,
    source: 'all',
    sureDeleteProjectName: '',
    deleteLoading: false
  }
  /**
   * 获取项目列表
   */
  getProjects = async(source = 'all') => {
    this.setState({ pjLoading: true, source });
    const resp = await http.get('/api/project/list', { source });
    this.setState({ pjLoading: false });
    if (resp.success) {
      const projects = resp.data.projectList.map(item => {
        item.showDeleteCard = false;
        return item;
      });
      this.setState({ pjList: projects });
    }
  }
  cancelAdd = () => {
    this.setState({ modifyVisible: false });
  }
  openModifyModal = () => {
    this.setState({ modifyVisible: true });
  }
  /**
   * 切换删除的弹出层，index，要切换的行的索引， isShow 显示还是隐藏，如果hideAll为true，隐藏所有
   */
  toggleDeleteProject = (index, isShow, hideAll = false) => {
    const projectList = this.state.pjList.map(p => {
      if (isShow || hideAll) {
        p.showDeleteCard = false;
      }
      return p;
    });
    if (!hideAll) {
      projectList[index].showDeleteCard = isShow;
    }
    this.setState({ pjList: projectList });
  }
  /**
   * 确认删除项目的输入框的内容更改
   */
  sureDeleteProjectNameChanged = (e) => {
    e.persist();
    this.setState({ sureDeleteProjectName: e.currentTarget.value });
  }
  /**
   * 确认删除的输入框禁止复制粘贴
   */
  disableDeletePaste = (e) => {
    // message.error('不能粘贴，请手动输入', 2);
    Modal.error({
      title: '提示',
      content: '确认删除项目时，项目名不能粘贴，必须手动输入',
      okText: '确认',
      cancelText: '取消'
    });
    e.preventDefault();
    this.setState({ sureDeleteProjectName: '' });
  }
  /**
   * 确认删除项目
   */
  sureDeleteProject = (pid, pname) => {
    if (this.state.sureDeleteProjectName !== pname) {
      message.error('输入的项目名不正确，请重新输入', 2);
    } else {
      Modal.confirm({
        title: '提示',
        content: '确定要删除当前项目及其下面的所有接口吗？',
        okText: '确认',
        cancelText: '取消',
        width: 400,
        onOk: async() => {
          this.setState({ deleteLoading: true });
          const resp = await http.post('/api/project/delete', { projectId: pid });
          this.setState({ deleteLoading: false });
          if (resp.success) {
            message.success('删除成功', 2);
            this.setState({ sureDeleteProjectName: '' });
            this.toggleDeleteProject(0, false, true);
            this.getProjects(this.state.source);
          }
        }
      });
    }
  }
  sourceChanged = (e) => {
    const source = e.target.value;
    this.getProjects(source);
    this.setState({ source });
  }
  // 跳转到项目的接口页面
  getProjectApis = (id) => {
    this.props.history.push('/project/' + id);
  }
  componentDidMount() {
    this.getProjects('all');
    this.setState({ 'userId': userLogin.getLoginInfo().id });
  }
  render() {
    return (
      <PageLayout>
        <div className="projects">
          <PageInfo antIcon="user" pageName="我的项目" pageDesc="将正在进行的项目添加到工作台中以提高工作效率。">
            <Radio.Group defaultValue="all" value={this.state.source}
              buttonStyle="solid" onChange={this.sourceChanged}>
              <Radio.Button value="all">所有</Radio.Button>
              <Radio.Button value="create">由我创建</Radio.Button>
              <Radio.Button value="join">我加入的</Radio.Button>
            </Radio.Group>
            <Button shape="circle" type="primary" className="add-project" onClick={this.openModifyModal} icon="plus"></Button>
          </PageInfo>
          <section className="my-container" style={{ padding: '15px 0' }}>
            {this.state.pjLoading ? <Spin tip="Loading..."></Spin> : ''}
            {this.state.pjList.length > 0 &&
              <Row gutter={16}>
                {this.state.pjList.map((p, i) =>
                  <Col key={i} span={6} style={{ marginBottom: '10px' }}>
                    <Card className="project-card"
                      actions={this.state.userId === p.create_user ? [
                        <Link to={'/project/' + p.id}><Icon type="eye" /></Link>,
                        <span style={{ display: 'inline-block', width: '100%' }} onClick={() => this.toggleDeleteProject(i, true)}><Icon style={{ color: '#f33' }} type="delete" /></span>
                      ] : [
                        <Link to={'/project/' + p.id}><Icon type="eye" /></Link>
                      ]}
                      headStyle={{ borderBottom: 'none' }}
                      title={p.name} bordered={false}>
                      <p className="purl">{p.baseurl}</p>
                      <p className="pdesc">{p.description}</p>
                      {this.state.userId === p.create_user && p.showDeleteCard &&
                        <div className="p-card animated customZoomIn">
                          <Alert
                            message="删除项目将会移除其下面所有的接口且不可恢复" showIcon
                            type="error"
                          />
                          <div className="p">若你任想删除，请完整输入当前项目名以确认删除</div>
                          <div className="p"><Input value={this.state.sureDeleteProjectName}
                            onChange={this.sureDeleteProjectNameChanged}
                            onPaste={this.disableDeletePaste} placeholder="项目名" /></div>
                          <div className="p">
                            <Row gutter={16}>
                              <Col span={12}><Button onClick={() => this.toggleDeleteProject(i, false)} type="primary" block>取消</Button></Col>
                              <Col span={12}><Button onClick={() => this.sureDeleteProject(p.id, p.name)} type="danger" block>确定</Button></Col>
                            </Row>
                          </div>
                          {this.state.deleteLoading &&
                            <FixedLoading tip="删除中..."></FixedLoading>
                          }
                        </div>
                      }
                    </Card>
                  </Col>
                )}
              </Row>
            }
            {this.state.pjList.length <= 0 &&
              <div className="empty-info">
                <p className="content"><Icon type="dropbox"/>
                  {this.state.source === 'join' &&
                    <span>暂时还未加入任何项目</span>
                  }
                  {this.state.source === 'create' &&
                    <span>暂时还未创建任何项目</span>
                  }
                  {this.state.source === 'all' &&
                    <span>暂时还未创建或加入任何项目</span>
                  }
                </p>
                <p>
                  {this.state.source !== 'join' &&
                    <Button size="large" onClick={this.openModifyModal} icon="plus">创建项目</Button>
                  }
                </p>
              </div>
            }
          </section>
          <Modal
            title="添加项目"
            footer={null}
            visible={this.state.modifyVisible}
            onOk={this.submitProject}
            onCancel={this.cancelAdd}>
            <EnhancedProjectForm
              refreshList={this.getProjects}
              closeModal={this.cancelAdd}></EnhancedProjectForm>
          </Modal>
        </div>
      </PageLayout>
    );
  }
};
export default Projects;
