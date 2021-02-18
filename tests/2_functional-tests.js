const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Crete an issue", (done) => {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .type("form")
      .send({
        issue_title: "functional test",
        issue_text: "test this function test testing",
        created_by: "author test",
        assigned_to: "someone",
        status_text: "in Development",
      })
      .end((err, res) => {
        assert.equal(res.body.issue_title, "functional test");
        assert.equal(res.body.issue_text, "test this function test testing");
        assert.equal(res.body.created_by, "author test");
        assert.equal(res.body.assigned_to, "someone");
        assert.equal(res.body.status_text, "in Development");
        done();
      });
  });
  test("required fields error", (done) => {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({})
      .end((err, res) => {
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });
  test("Get issue", (done) => {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .query({
        issue_title: "Get Test",
        issue_text: "unique text",
        created_by: "test case",
      })
      .end((err, res) => {
        assert.isOk(res.body);
        done();
      });
  });
  test("(put) missing id", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send()
      .end((err, res) => {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  test("Update Doc", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: "602c173739c34e7cf0839b13",
        issue_title: "updated",
        issue_text: "updated",
        created_by: "test case",
        assigned_to: "tester",
        status_text: "in Development",
        open: false,
      })
      .end((err, res) => {
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "602c173739c34e7cf0839b13");
        done();
      });
  });

  test("(put) no update fields", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: "602c173739c34e7cf0839b13" })
      .end((err, res) => {
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      });
  });
});
