// backend/models/question.js
class Question {
  constructor(question) {
    this.question = question;
  }

  validate() {
    return typeof this.question === 'string' && this.question.trim().length > 0;
  }
}

module.exports = Question;
