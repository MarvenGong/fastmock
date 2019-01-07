import React from 'react';
import LoginForm from './LoginForm';
import './Login.scss';
import { Form } from 'antd';
import { withRouter } from 'react-router-dom';
let EnhancedForm = Form.create()(LoginForm);
class Login extends React.Component {
  componentDidMount() {
    // console.log(this.props.query);
  }
  render() {
    return (
      <div className="login-body">
        <div className="login">
          <div className="inset animated customClipX">
            <EnhancedForm></EnhancedForm>
          </div>
        </div>
      </div>
    );
  }
};
export default withRouter(Login);
