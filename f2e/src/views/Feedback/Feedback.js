import React from 'react';
import FeedbackForm from './FeedbackForm';
import { Form, Card } from 'antd';
import { PageLayout, PageInfo } from '../components';
const EnhanceedFeedbackForm = Form.create()(FeedbackForm);
class Feedback extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 1
    };
  }
  render() {
    return (
      <PageLayout>
        <section className="Feedback">
          <PageInfo antIcon="question" pageName="问题与建议" pageDesc="提交你在fastmock使用中发现的问题和对fastmock的建议。"></PageInfo>
          <section className="my-container" style={{ padding: '15px 0' }}>
            <Card className="animated customfadeIn" style={{ padding: '20px 200px' }}>
              <EnhanceedFeedbackForm></EnhanceedFeedbackForm>
            </Card>
          </section>
        </section>
      </PageLayout>
    );
  }
}
export default Feedback;
