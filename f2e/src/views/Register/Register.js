import React from 'react';
import RegisterForm from './RegisterForm';
import './Register.scss';
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
            <EnhancedForm></EnhancedForm>
          </div>
        </div>
      </div>
    );
  }
};
export default withRouter(Login);
