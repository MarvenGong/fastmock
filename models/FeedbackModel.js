const entities = require('../entity');
class FeedbackModel {
  addFeedback(feedback) {
    return entities.Feedback.create(feedback);
  }
  findAll(pageNo, pageSize) {
    return entities.Feedback.findAndCountAll({
      offset: (pageNo - 1) * pageSize,
      limit: pageSize
    });
  }
}
export default FeedbackModel;