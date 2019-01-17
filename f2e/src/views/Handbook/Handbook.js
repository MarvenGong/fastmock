import React from 'react';
import { PageLayout, PageInfo } from '../components';
class Handbook extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 1
    };
  }
  render() {
    return (
      <PageLayout>
        <section className="handbook">
          <PageInfo antIcon="file-unknown" pageName="使用文档" pageDesc="这里将介绍如何使用FastMock来提高你的生产效率。"></PageInfo>
          <section className="my-container" style={{ padding: '15px 0' }}></section>
        </section>
      </PageLayout>
    );
  }
}
export default Handbook;
