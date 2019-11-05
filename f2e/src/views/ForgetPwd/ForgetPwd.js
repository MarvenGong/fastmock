import React from 'react';
import RegisterForm from './ForgetPwdForm';
import '../Login/Login.scss';
import { Form } from 'antd';
import { withRouter } from 'react-router-dom';
let EnhancedForm = Form.create()(RegisterForm);
class Login extends React.Component {
  componentDidMount() {
    // console.log(this.props.query);
  }
  render() {
    return (
      <div className="login-body">
        <div className="login">
          <div className="inset animated customClipX">
            <div className="login-logo">
              <img src="/assets/images/logo-blue.png" width="396"></img>
            </div>
            <h2 className="login-title">找回密码</h2>
            <EnhancedForm></EnhancedForm>
          </div>
        </div>
      </div>
    );
  }
};
export default withRouter(Login);
