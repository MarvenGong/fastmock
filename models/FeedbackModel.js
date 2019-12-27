const entities = require('../entity');
class FeedbackModel {
  addFeedback(feedback) {
    return entities.Feedback.create(feedback);
  }
  findAll(pageNo, pageSize) {
    return entities.Feedback.findAndCountAll({
      offset: (pageNo - 1) * pageSize,
      limit: pageSize,
      order: [
        ['create_time', 'DESC']
      ]
    });
  }
  findById(id) {
    return entities.Feedback.findById(id);
  }
  save(feedback) {
    return entities.Feedback.update(feedback, {
      where: { id: feedback.id }
    });
  }
}
export default FeedbackModel;