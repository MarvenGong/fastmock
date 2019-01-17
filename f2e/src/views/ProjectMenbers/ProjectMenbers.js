/* global http */
import React from 'react';
import { PageLayout, PageInfo } from '@/views/components';
import { List, Card, Button, Skeleton, AutoComplete, Select, Input, message, Popconfirm } from 'antd';
import './style.scss';
const Option = Select.Option;
class ProjectMenbers extends React.Component {
  constructor() {
    super();
    this.state = {
      pname: '',
      memberList: [],
      dataSource: [],
      addMemberUserId: null,
      addMemberVisible: false
    };
  }
  getMembers = async(id) => {
    this.setState({ detailLoading: true });
    const resp = await http.get('/api/projectMembers/' + id);
    if (resp.success) {
      this.setState({ memberList: resp.data });
    }
    this.setState({ detailLoading: false });
  }
  componentDidMount = () => {
    const pid = this.props.match.params.id;
    const pname = this.props.match.params.pname;
    this.setState({ projectId: pid, pname });
    this.getMembers(pid);
  }
  onSelect = (value) => {
    this.setState({ addMemberUserId: value });
  }
  handleSearch = async(value) => {
    const resp = await http.get('/api/searchUserExtendProjectExsist', { key: value, projectId: this.props.match.params.id });
    if (resp.success) {
      this.setState({ dataSource: resp.data });
    }
  }
  openAddMember = () => {
    this.setState({
      addMemberVisible: true
    });
  }
  cancelAddMember = () => {
    this.setState({
      addMemberVisible: false
    });
  }
  /**
   * 提交用户
   */
  sureAddMember = async() => {
    if (!this.state.addMemberUserId) {
      message.error('请先选择用户');
      return false;
    }
    const resp = await http.post('/api/project/addmember', {
      projectId: this.props.match.params.id,
      userId: this.state.addMemberUserId
    });
    if (resp.success) {
      message.success('添加成功');
      this.getMembers(this.props.match.params.id);
      this.setState({
        dataSource: [],
        addMemberUserId: null
      });
    }
  }
  removeMember = async(userId) => {
    const resp = await http.post('/api/project/removemember', {
      projectId: this.props.match.params.id,
      userId
    });
    if (resp.success) {
      message.success('操作成功');
      this.getMembers(this.props.match.params.id);
    }
  }
  render() {
    function renderOption(item) {
      return (
        <Option key={item.id} text={item.email} icon="user">{item.nickname + '--' + item.email}</Option>
      );
    }
    return (
      <PageLayout>
        <section className="api pm">
          <PageInfo antIcon="usergroup-add" pageName={'”' + this.state.pname + '“ 成员管理'} pageDesc='项目成员管理，可以将已存在的用户添加到你的项目'>
            <Button shape="circle" type="primary" className="add-project" onClick={this.openAddMember} icon="plus"></Button>
          </PageInfo>
          <section className="my-container" style={{ padding: '15px 0' }}>
            {this.state.addMemberVisible &&
              <Card className="animated customZoomIn">
                <div className="add-member">
                  <AutoComplete
                    className="global-search"
                    allowClear={true}
                    backfill
                    style={{ width: '320px' }}
                    dataSource={this.state.dataSource.map(renderOption)}
                    onSelect={this.onSelect}
                    onSearch={this.handleSearch}
                    placeholder="输入用户昵称或邮箱，支持模糊匹配"
                    optionLabelProp="text">
                    <Input
                      suffix={(
                        <Button onClick={this.sureAddMember} className="search-btn" type="primary">确认添加</Button>
                      )}
                    />
                  </AutoComplete>
                  <Button shape="circle" style={{ marginLeft: 50 }} icon="close"
                    onClick={this.cancelAddMember} className="search-btn" type="danger"></Button>
                </div>
              </Card>
            }
            <Card>
              <List className="pm-list"
                loading={this.state.pjLoading}
                itemLayout="horizontal"
                size="small"
                dataSource={this.state.memberList}
                renderItem={item => (
                  <List.Item actions={[
                    <Popconfirm title="确定删除这个接口吗？" okText="确定" cancelText="取消" onConfirm={() => this.removeMember(item.id)}>
                      <Button icon="delete" size="small" type="danger">移除</Button>
                    </Popconfirm>
                  ]}>
                    <Skeleton loading={item.loading} active>
                      <div className="pm-info"><img alt="" width="50" src="./images/defaultlogo.jpg"></img></div>
                      <div className="pm-info fs16"><b>{item.nickname}</b></div>
                      <div className="pm-info text-333">{item.email}</div>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Card>
          </section>
        </section>
      </PageLayout>
    );
  }
};
export default ProjectMenbers;
