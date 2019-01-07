/* global http */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Switch, Button, Select, message } from 'antd';
import './style.scss';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class ApiForm extends Component {
  state = {
    submitLoading: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err, formData) => {
      if (!err) {
        this.setState({
          submitLoading: true
        });
        const submitForm = { ...formData };
        submitForm.project = this.props.pid;
        submitForm.mockRule = this.props.getApiRule();
        // alert(JSON.stringify(submitForm));
        const resp = await http.post('/api/api/add', submitForm);
        this.setState({
          submitLoading: false
        });
        if (resp.success) {
          message.success('保存成功');
          this.props.refreshList();
          this.props.closeModal();
        }
      }
    });
  }
  componentDidMount() {
    if (this.props.editApiFormData) {
      const data = Object.assign({}, this.props.editApiFormData);
      this.props.form.setFieldsValue({
        id: data.id,
        name: data.name,
        method: data.method,
        url: data.url,
        description: data.description,
        on: data.on / 1 === 1
      });
    } else {
      this.props.form.setFieldsValue({ id: null, on: true });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="modal-form">
        <FormItem label="">
          {getFieldDecorator('id', {
            initialValue: null,
            rules: [{ required: false }]
          })(
            <Input type="hidden" placeholder="接口名" />
          )}
        </FormItem>
        <FormItem label="接口名">
          {getFieldDecorator('name', {
            initialValue: '',
            rules: [{ required: true, message: '请填写接口名' }]
          })(
            <Input placeholder="接口名" />
          )}
        </FormItem>
        <FormItem label="请求类型（method）">
          {getFieldDecorator('method', {
            rules: [{ required: true, message: '请填写项目名称' }]
          })(
            <Select placeholder="项目名称">
              <Option key="get">get</Option>
              <Option key="post">post</Option>
              <Option key="delete">delete</Option>
              <Option key="put">put</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="url">
          {getFieldDecorator('url', {
            rules: [{ required: true, message: '请填写接口url' }]
          })(
            <Input placeholder="接口地址（如：/api/user）" />
          )}
        </FormItem>
        <FormItem label="接口描述">
          {getFieldDecorator('description', {
            rules: [{ required: false, message: '请填写接口描述' }]
          })(
            <TextArea placeholder="项目描述" />
          )}
        </FormItem>
        <FormItem label="Mock状态">
          {getFieldDecorator('on', { valuePropName: 'checked' })(
            <Switch checkedChildren="开" unCheckedChildren="关" />
          )}
        </FormItem>
        <FormItem style={{ marginTop: '15px', textAlign: 'center' }}>
          <Button style={{ width: '120px' }} loading={this.state.submitLoading} type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
};
const ApiFormWithRouter = withRouter(ApiForm);
export default ApiFormWithRouter;
