import React from 'react';
import { PageInfo } from '../components';
class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 1
    };
  }
  render() {
    return (
      <section className="Feedback">
        <PageInfo antIcon="question" pageName="问题与建议" pageDesc="提交你在fastmock使用中发现的问题和对fastmock的建议。"></PageInfo>
        <section className="my-container" style={{ padding: '15px 0' }}></section>
      </section>
    );
  }
}
export default Feedback;
