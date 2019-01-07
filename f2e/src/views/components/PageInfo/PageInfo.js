import React from 'react';
import { Icon, Row, Col } from 'antd';
class PageInfo extends React.Component {
  render() {
    return (
      <div className="page-info-action">
        <div className="my-container">
          <Row gutter={16}>
            <Col className="gutter-row" span={1}>
              <div className="page-logo">
                <Icon type={this.props.antIcon}/>
              </div>
            </Col>
            <Col className="gutter-row" span={16}>
              <div className="page-description">
                <span><h2>{this.props.pageName}</h2><p>{this.props.pageDesc}</p></span>
              </div>
            </Col>
            <Col className="gutter-row" span={7}>
              <div className="page-act">
                {this.props.children}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
};
export default PageInfo;
