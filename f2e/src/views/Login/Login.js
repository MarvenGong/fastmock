import React from 'react';
import LoginForm from './LoginForm';
import './Login.scss';
import { Form } from 'antd';
import { withRouter } from 'react-router-dom';
import toastr from 'toastr';
let EnhancedForm = Form.create()(LoginForm);
class Login extends React.Component {
  componentDidMount() {
    toastr.remove();
  }
  render() {
    return (
      <div className="login-body">
        <div className="login">
          <div className="inset animated customClipX">
            <EnhancedForm></EnhancedForm>
          </div>
        </div>
        <div className="login-footer">
          <p>&copy; All rights reserved FastMock在线Mock平台</p>
          <p className="beian">渝ICP备19000613号-2</p>
        </div>
      </div>
    );
  }
};
export default withRouter(Login);
