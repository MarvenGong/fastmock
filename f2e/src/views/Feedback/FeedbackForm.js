/* global http */
import React, { Component } from 'react';
import {
  Form, Icon, Input, Button, message, Alert, Modal
} from 'antd';
import { withRouter, Link } from 'react-router-dom';
import userLogin from '../../utils/UserLogin';
const FormItem = Form.Item;
const { TextArea } = Input;
class FeedbackForm extends Component {
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
        const resp = await http.post('/api/feedback', {
          email: formData.email,
          content: formData.content
        });
        this.setState({
          submitLoading: false
        });
        if (resp.success) {
          Modal.success({
            title: '提示',
            content: '您的建议已经提交成功，对您给予的帮助和支持，深表感谢！'
          });
          this.props.form.resetFields();
        }
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Alert style={{ marginBottom: '15px' }} type="success" showIcon message="对您给予的帮助和支持，深表感谢！我们默认会通过您注册时填写的邮箱地址联系您，若您希望我们通过其他邮箱联系您，请填写邮箱地址。"></Alert>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: false, message: '' }]
          })(
            <Input size="large" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '请输入内容!' }]
          })(
            <TextArea rows={6} placeholder="请输入内容" />
          )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button size="large" icon="check" block loading={this.state.loginLoading} type="primary" htmlType="submit" className="login-form-button">
            提&emsp;交
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const FeedbackFormWidthRouter = withRouter(FeedbackForm);
export default FeedbackFormWidthRouter;
