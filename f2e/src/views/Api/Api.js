/* global http ace */
import React from 'react';
import { PageLayout, PageInfo } from '@/views/components';
import { Table, Card, Button, Form, Popconfirm, Tag, Icon, Tooltip, message, Alert } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AceEditor from 'react-ace';
import ApiForm from './ApiForm';
import SearchForm from './SearchForm';
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
    searchForm: {
      name: '',
      url: ''
    },
    total: 0,
    apiList: [],
    addApiVisible: false,
    apiModalType: 'add',
    data: '',
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
  getApis = async(pageNo = 1, searchForm = {}) => {
    this.setState({
      searchForm
    });
    const pid = this.props.match.params.id;
    this.setState({ pjLoading: true });
    const resp = await http.get('/api/api/list', {
      projectId: pid,
      pageNo,
      pageSize: this.state.pageSize,
      name: typeof searchForm.name === 'undefined' ? this.state.searchForm.name : searchForm.name,
      url: typeof searchForm.url === 'undefined' ? this.state.searchForm.url : searchForm.url
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
  handleSearch = (data) => {
    this.getApis(1, data);
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
      apiModalType: 'add',
      editApiFormData: null,
      aceEditorValue: ''// '{\n  \"code\": \"0000\",\n  \"data\": {},\n  \"desc\": \"成功\"\n}' // eslint-disable-line
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
        apiModalType: 'edit',
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
  /**
   * 编辑器内容更改
   * @param {*} value
   */
  onAceEditorChange(value) {
    this.setState({
      aceEditorValue: value
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
  openRuleDemo = () => {
    window.open('http://fmdocs.fastmock.site/book/ruledemo.html');
  }
  urlCopyed = () => {
    message.success('地址已复制到粘贴板');
  }
  render() {
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
          <Tooltip title="复制接口相对地址">
            <CopyToClipboard onCopy={() => this.urlCopyed()} text={record.url}>
              <Tag style={{ textAlign: 'center' }}>{record.url}</Tag>
            </CopyToClipboard>
          </Tooltip>
        )
      },
      { title: '接口描述', dataIndex: 'description' },
      { title: '创建时间', dataIndex: 'createdAt' },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Tooltip title="预览接口">
              <Button onClick={() => this.previewSingleApi(record.url)} icon="eye" size="small"></Button>
            </Tooltip>
            <Tooltip title="复制完整接口地址">
              <CopyToClipboard onCopy={() => this.urlCopyed()} text={this.state.prjectInfo.mockBasePath + record.url}>
                <Button icon="copy" size="small"></Button>
              </CopyToClipboard>
            </Tooltip>
            <Tooltip title="编辑接口">
              <Button onClick={() => this.openEditApi(record.id)} icon="edit" size="small" type="primary"></Button>
            </Tooltip>
            <Popconfirm title="确定删除这个接口吗？" okText="确定" cancelText="取消" onConfirm={() => this.deleteApi(record.id)}>
              <Button icon="delete" size="small" type="danger"></Button>
            </Popconfirm>
          </span>
        )
      }
    ];
    const WrappedSearchForm = Form.create({ name: 'searchForm' })(SearchForm);
    return (
      <PageLayout>
        <section className="api">
          <PageInfo antIcon="appstore" pageName={this.state.prjectInfo.name} pageDesc={this.state.prjectInfo.description}>
            <Button type="success" onClick={this.gotoProjectUserManage} icon="user">成员管理</Button>
            <Button shape="circle" type="primary" className="add-project" onClick={this.openAddApi} icon="plus"></Button>
          </PageInfo>
          <section className="my-container" style={{ padding: '15px 0' }}>
            <Card className="p-info">
              <p>
                <span>接口根地址</span>
                <Tooltip title="复制接口根地址">
                  <CopyToClipboard onCopy={() => this.urlCopyed()} text={this.state.prjectInfo.mockBasePath}>
                    <span>{this.state.prjectInfo.mockBasePath}</span>
                  </CopyToClipboard>
                </Tooltip>
              </p>
              <p><span>项目ID</span>{this.state.prjectInfo.sign}</p>
            </Card>
            <Card style={{ marginTop: '15px' }}>
              <WrappedSearchForm
                formData={this.state.searchForm}
                onSearch={this.handleSearch}/>
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
                  <p className="content">
                    <p><Icon type="dropbox"/></p>
                    <span>没有找到符合条件的接口信息</span>
                  </p>
                  {this.state.total <= 0 &&
                    <p><Button size="large" onClick={this.openAddApi} icon="plus">创建接口</Button></p>
                  }
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
                  <EnhanceApiForm
                    ref="apiForm" pid={this.state.projectId}
                    getApiRule={this.getApiRuleEditorContent}
                    refreshList={this.getApis}
                    apiModalType={this.state.apiModalType}
                    editApiFormData = {this.state.editApiFormData}
                    closeModal={this.closeAddModal}/>
                </div>
              </div>
              <div className="right-editor">
                <Alert message="输入正确的JSON数据，否则接口解析可能会失败。在编辑器任意位置输入”mj“可弹出mockjs规则代码补全（此信息可点击右边关闭按钮关闭）"
                  type="info" closable banner />
                <div className="top-actions">
                  <Button style={{ borderRadius: 0 }} onClick={this.openRuleDemo} type="primary" icon="question">查看代码示例</Button>
                  <span className="action-name">字体大小:</span>
                  <select className="ace-config-select" name="fontSize" value={this.state.aceEditorOption.fontSize}
                    onChange={this.setEditorOption}
                    style={{ height: '24px' }}
                    placeholder="字体大小">
                    {this.state.fontSizeAry.map((item, index) =>
                      (<option key={index} value={item}>{item}像素</option>)
                    )}
                  </select>
                  <span className="action-name">语言:</span>
                  <select className="ace-config-select" name="lua" value={this.state.aceEditorOption.lua}
                    onChange={this.setEditorOption}
                    size="small" style={{ height: '24px' }}
                    placeholder="语言">
                    {this.state.aditorLuaAry.map((item, index) =>
                      (<option key={index} value={item}>{item}</option>)
                    )}
                  </select>
                  <span className="action-name">tab类型:</span>
                  <select className="ace-config-select" name="tabSize" value={this.state.aceEditorOption.tabSize}
                    onChange={this.setEditorOption}
                    style={{ height: '24px' }}
                    placeholder="tab类型">
                    {this.state.aditorTabSizeAry.map((item, index) =>
                      (<option key={index} value={item}>{item} 个空格</option>)
                    )}
                  </select>
                </div>
                <AceEditor style={{ width: '100%', height: '100%' }}
                  mode={this.state.aceEditorOption.lua}
                  ref="aceEditor"
                  theme={this.state.aceEditorOption.theme}
                  fontSize={this.state.aceEditorOption.fontSize}
                  tabSize={this.state.aceEditorOption.tabSize}
                  onLoad= {(editor) => {
                    const snippets = snippetManager.parseSnippetFile('');
                    snippetsJs.map(obj => {
                      snippets.push(obj);
                      return obj;
                    });
                    snippetManager.register(snippets, 'javascript');
                  }}
                  onChange={(e) => this.onAceEditorChange(e)}
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
              </div>
            </section>
          }
        </section>
      </PageLayout>
    );
  }
};
export default Api;
