/* global http */
import React from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { withRouter } from 'react-router-dom';
class ModifyPwd extends React.Component {
  state = {
    submitLoading: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err, formData) => {
      if (!err) {
        this.setState({ submitLoading: true });
        const resp = await http.post('/api/modifyPwd', formData);
        this.setState({ submitLoading: false });
        if (resp.success) {
          this.props.onSuccess();
        }
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item label="原密码">
          {getFieldDecorator('oldPwd', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input type="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="原密码"
            />
          )}
        </Form.Item>
        <Form.Item label="新密码">
          {getFieldDecorator('newPwd', {
            rules: [{ required: true, message: '请输入新密码!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="新密码"
            />
          )}
        </Form.Item>
        <Form.Item label="确认新密码">
          {getFieldDecorator('repeatNewPwd', {
            rules: [{ required: true, message: '请确认新密码!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="新密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button style={{ width: '100%' }} loading={this.state.submitLoading} type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
      </>
    );
  }
};
export default Form.create()(withRouter(ModifyPwd));
