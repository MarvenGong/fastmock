/* global http ace */
import React from 'react';
import PageInfo from '@/views/components/PageInfo';
import { Table, Card, Button, Form, Drawer, Popconfirm, Tag, Icon } from 'antd';
import AceEditor from 'react-ace';
import ApiForm from './ApiForm';
import jsBeautifier from 'js-beautify/js/lib/beautify';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/html';
import 'brace/theme/terminal';
import 'brace/theme/xcode';
import 'brace/theme/twilight';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import './style.scss';
import snippetsJs from './snippets';
require('brace/ext/language_tools');
const snippetManager = ace.acequire('ace/snippets').snippetManager;
const EnhanceApiForm = Form.create()(ApiForm);
const ButtonGroup = Button.Group;
class Api extends React.Component {
  constructor() {
    super();
    this.setEditorOption = this.setEditorOption.bind(this);
  }
  state = {
    projectId: null,
    prjectInfo: {
      name: ''
    },
    pjLoading: false,
    pageSize: 15,
    pageNum: 1,
    total: 0,
    apiList: [],
    addApiVisible: false,
    data: '',
    aceEditorConfigVisible: false,
    fontSizeAry: [12, 14, 16, 18, 20, 24, 26, 28, 30, 32],
    themeAry: ['terminal', 'xcode', 'monokai', 'twilight'],
    aditorLuaAry: ['javascript', 'json', 'html'],
    aditorTabSizeAry: [2, 4],
    aceEditorValue: '{\n  \"code\": \"0000\",\n  \"data\": {},\n  \"desc\": \"成功\"\n}', // eslint-disable-line
    aceEditorOption: {
      fontSize: 14,
      theme: 'twilight',
      lua: 'javascript',
      tabSize: 2
    },
    editApiFormData: {
      name: ''
    },
    apiTestResult: null
  }
  getProject = async(id) => {
    this.setState({ detailLoading: true });
    const resp = await http.get('/api/project/' + id);
    if (resp.success) {
      this.setState({
        prjectInfo: {
          ...resp.data.project,
          ...{ mockBasePath: resp.data.mockBasePath }
        }
      });
    }
    this.setState({ detailLoading: false });
  }
  /**
   * 获取项目下的所有接口
   */
  getApis = async(pageNo = 1) => {
    const pid = this.props.match.params.id;
    this.setState({ pjLoading: true });
    const resp = await http.get('/api/api/list', {
      projectId: pid,
      pageNo,
      pageSize: this.state.pageSize
    });
    this.setState({ pjLoading: false });
    if (resp.success) {
      this.setState({
        pageNum: resp.data.pageNo,
        total: resp.data.totalCount,
        apiList: resp.data.apiList
      });
    }
  }
  jumpPage = (page) => {
    this.getApis(page);
  }
  /**
   * 删除API
   */
  deleteApi = async(id) => {
    this.setState({ pjLoading: true });
    const resp = await http.get('/api/api/delete', {
      id
    });
    this.setState({ pjLoading: false });
    if (resp.success) {
      this.getApis();
    }
  }
  closeShowApi = () => {
    this.setState({ apiTestResult: '', showApiTest: false });
  }
  openAddApi = () => {
    this.setState({
      addApiVisible: true,
      editApiFormData: null,
      aceEditorValue: '{\n  \"code\": \"0000\",\n  \"data\": {},\n  \"desc\": \"成功\"\n}' // eslint-disable-line
    });
  }
  cancelAddApi = () => {
    this.setState({ addApiVisible: false });
  }
  openEditApi = async(id) => {
    const resp = await http.get('/api/api/' + id);
    if (resp.success) {
      this.setState({
        addApiVisible: true,
        editApiFormData: resp.data.apiInfo,
        aceEditorValue: resp.data.apiInfo.mockRule
      });
    }
  }
  gotoProjectUserManage = () => {
    this.props.history.push(`/project/${this.state.projectId}/menber/${this.state.prjectInfo.name}`);
  }
  closeAddModal = () => {
    this.setState({ addApiVisible: false });
  }
  // 获取编辑器的值
  getApiRuleEditorContent = () => {
    return this.refs['aceEditor'].editor.getValue();
  }
  // 打开编辑器配置
  openAceEditorConfig = () => {
    this.setState({ aceEditorConfigVisible: true });
  }
  aceEditorConfigClose = () => {
    this.setState({ aceEditorConfigVisible: false });
  }
  componentDidMount = () => {
    const pid = this.props.match.params.id;
    this.setState({ projectId: pid });
    this.getApis(1);
    this.getProject(pid);
  }
  /**
   * 监听编辑器修改
   * @param {Object} event 事件对象
   */
  setEditorOption(event) {
    const currentEditorValue = this.refs['aceEditor'].editor.getValue();
    event.preventDefault();
    let name = event.target.name;
    let value = name === 'fontSize' || name === 'tabSize' ? event.target.value / 1 : event.target.value;
    let data = Object.assign({}, this.state.aceEditorOption, { [name]: value });
    this.setState({
      aceEditorOption: data,
      aceEditorValue: currentEditorValue
    });
  }
  beautifyCode = () => {
    const currentEditorValue = this.refs['aceEditor'].editor.getValue();
    const res = jsBeautifier.js_beautify(currentEditorValue, { indent_size: 2 });
    this.setState({
      aceEditorValue: res
    });
  }
  preview = () => {
    window.open(this.state.prjectInfo.mockBasePath + this.state.editApiFormData.url);
  }
  previewSingleApi = (url) => {
    window.open(this.state.prjectInfo.mockBasePath + url);
  }
  render() {
    const apiMockRuleChanged = value => {
      // console.log(self.refs['aceEditor'].editor.getValue());
    };
    const columns = [
      { title: '接口名称', dataIndex: 'name' },
      { title: '请求类型',
        render: (text, record) => (
          <Tag color="#339966" style={{ width: 80, textAlign: 'center' }}>{record.method}</Tag>
        )
      },
      { title: '请求状态',
        width: 70,
        align: 'center',
        render: (text, record) => (
          <Tag color={ record.on === 1 ? '#339966' : '#f33'} style={{ width: 60, textAlign: 'center' }}>
            {record.on === 1 ? '开启' : '关闭'}
          </Tag>
        )
      },
      { title: '接口地址',
        render: (text, record) => (
          <Tag style={{ textAlign: 'center' }}>{record.url}</Tag>
        )
      },
      { title: '接口描述', dataIndex: 'description' },
      { title: '创建时间', dataIndex: 'create_time' },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button onClick={() => this.previewSingleApi(record.url)} icon="eye" size="small"></Button>
            <Button onClick={() => this.openEditApi(record.id)} icon="edit" size="small" type="primary"></Button>
            <Popconfirm title="确定删除这个接口吗？" okText="确定" cancelText="取消" onConfirm={() => this.deleteApi(record.id)}>
              <Button icon="delete" size="small" type="danger"></Button>
            </Popconfirm>
          </span>
        )
      }
    ];
    return (
      <section className="api">
        <PageInfo antIcon="appstore" pageName={this.state.prjectInfo.name} pageDesc={this.state.prjectInfo.description}>
          <Button type="success" onClick={this.gotoProjectUserManage} icon="user">成员管理</Button>
          <Button shape="circle" type="primary" className="add-project" onClick={this.openAddApi} icon="plus"></Button>
        </PageInfo>
        <section className="my-container" style={{ padding: '15px 0' }}>
          <Card className="p-info">
            <p><span>接口根地址</span>{this.state.prjectInfo.mockBasePath}</p>
            <p><span>项目ID</span>{this.state.prjectInfo.sign}</p>
          </Card>
          <Card>
            {this.state.apiList.length > 0 &&
            <Table
              bordered
              rowKey="id"
              size="small"
              pagination={{ total: this.state.total, current: this.state.pageNum, pageSize: this.state.pageSize, onChange: this.jumpPage }}
              loading={this.state.pjLoading}
              components={this.components}
              columns={columns}
              dataSource={this.state.apiList}/>
            }
            {this.state.apiList.length <= 0 &&
              <div className="empty-info">
                <p className="content"><Icon type="dropbox"/>
                  <span>这个项目目前还没有任何接口</span>
                </p>
                <p><Button size="large" onClick={this.openAddApi} icon="plus">创建接口</Button></p>
              </div>
            }
          </Card>
        </section>
        {this.state.addApiVisible &&
          <section className="api-cover animated customZoomIn">
            <div className="attach-main">
              <div className="form-btn-bar">
                <ButtonGroup style={{ width: '100%' }}>
                  <Button onClick={this.cancelAddApi} style={{ width: '33.333333%' }} icon="close">关闭</Button>
                  <Button onClick={this.beautifyCode} style={{ width: '33.333333%' }} icon="align-left">格式化</Button>
                  <Button onClick={this.preview} style={{ width: '33.333333%' }} icon="youtube">预览</Button>
                </ButtonGroup>
              </div>
              <div className="form-box">
                <EnhanceApiForm pid={this.state.projectId}
                  getApiRule={this.getApiRuleEditorContent}
                  refreshList={this.getApis}
                  editApiFormData = {this.state.editApiFormData}
                  closeModal={this.closeAddModal}/>
              </div>
            </div>
            <div className="right-editor">
              <AceEditor style={{ width: '100%', height: '100%' }}
                mode={this.state.aceEditorOption.lua}
                ref="aceEditor"
                theme={this.state.aceEditorOption.theme}
                fontSize={this.state.aceEditorOption.fontSize}
                tabSize={this.state.aceEditorOption.tabSize}
                onChange={ apiMockRuleChanged }
                onLoad= {(editor) => {
                  const snippets = snippetManager.parseSnippetFile('');
                  snippetsJs.map(obj => {
                    snippets.push(obj);
                    return obj;
                  });
                  snippetManager.register(snippets, 'javascript');
                }}
                name="UNIQUE_ID_OF_DIV"
                value={this.state.aceEditorValue}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true
                  // fontFamily: 'Arial',
                }}
                editorProps={{
                  $blockScrolling: true
                }}
              />
              {!this.state.aceEditorConfigVisible &&
                <Button onClick={this.openAceEditorConfig}
                  className="ace-editor-toggle"
                  shape="circle" icon="setting"></Button>
              }
            </div>
          </section>
        }
        <Drawer
          title="编辑器样式设置"
          placement="right"
          closable={true}
          mask={false}
          onClose={this.aceEditorConfigClose}
          visible={this.state.aceEditorConfigVisible}>
          <p className="ae-title">字体大小</p>
          <div className="ae-control">
            <select className="ace-config-select" name="fontSize" value={this.state.aceEditorOption.fontSize}
              onChange={this.setEditorOption}
              placeholder="字体大小" style={{ width: '100%' }}>
              {this.state.fontSizeAry.map((item, index) =>
                (<option key={index} value={item}>{item}像素</option>)
              )}
            </select>
          </div>
          <p className="ae-title">主题</p>
          <div className="ae-control">
            <select className="ace-config-select" name="theme" value={this.state.aceEditorOption.theme}
              onChange={this.setEditorOption}
              placeholder="主题" style={{ width: '100%' }}>
              {this.state.themeAry.map((item, index) =>
                (<option key={index} value={item}>{item}</option>)
              )}
            </select>
          </div>
          <p className="ae-title">语言</p>
          <div className="ae-control">
            <select className="ace-config-select" name="lua" value={this.state.aceEditorOption.lua}
              onChange={this.setEditorOption}
              placeholder="语言" style={{ width: '100%' }}>
              {this.state.aditorLuaAry.map((item, index) =>
                (<option key={index} value={item}>{item}</option>)
              )}
            </select>
          </div>
          <p className="ae-title">缩进</p>
          <div className="ae-control">
            <select className="ace-config-select" name="tabSize" value={this.state.aceEditorOption.tabSize}
              onChange={this.setEditorOption}
              placeholder="语言" style={{ width: '100%' }}>
              {this.state.aditorTabSizeAry.map((item, index) =>
                (<option key={index} value={item}>{item} 个空格</option>)
              )}
            </select>
          </div>
        </Drawer>
      </section>
    );
  }
};
export default Api;
