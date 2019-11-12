import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
class SearchForm extends Component {
  handleSubmitSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.props.onSearch(values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form style={{ marginBottom: '10px' }} layout="inline" onSubmit={this.handleSubmitSearch}>
        <Form.Item>
          {getFieldDecorator('name', {
            initialValue: this.props.formData.name,
            rules: [{ required: false, message: '' }]
          })(
            <Input placeholder="接口名称"/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('url', {
            initialValue: this.props.formData.url,
            rules: [{ required: false, message: '' }]
          })(
            <Input type="text" placeholder="接口地址"/>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">搜索</Button>
          <Button style={{ marginLeft: '8px' }}
            onClick={this.props.openAddApi}
            type="primary" icon="plus" htmlType="button">新增接口</Button>
        </Form.Item>
      </Form>
    );
  }
};
export default SearchForm;
