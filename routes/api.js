"use strict";
const mongoose = require("mongoose");
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  status_text: String,
  open: Boolean,
  created_on: String,
  updated_on: String,
  project: String,
});

const issueModel = mongoose.model("issueModel", issueSchema);

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;

      let queryObj = {
        ...((req.query._id == undefined ? false : true) && {
          _id: req.query._id,
        }),
        ...((req.query.issue_title == undefined ? false : true) && {
          issue_title: req.query.issue_title,
        }),
        ...((req.query.issue_text == undefined ? false : true) && {
          issue_text: req.query.issue_text,
        }),
        ...((req.query.created_by == undefined ? false : true) && {
          created_by: req.query.created_by,
        }),
        ...((req.query.assigned_to == undefined ? false : true) && {
          assigned_to: req.query.assigned_to,
        }),
        ...((req.query.status_text == undefined ? false : true) && {
          status_text: req.query.status_text,
        }),
        ...((req.query.created_on == undefined ? false : true) && {
          created_on: req.query.created_on,
        }),
        ...((req.query.updated_on == undefined ? false : true) && {
          updated_on: req.query.updated_on,
        }),
        ...((req.query.open == undefined ? false : true) && {
          open: req.query.open,
        }),
        project: project,
      };
      issueModel.find(queryObj, (err, doc) => {
        if (err) res.send(err);
        res.send(doc);
      });
    })

    .post(function (req, res) {
      let project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;

      issueModel.create(
        {
          issue_title: issue_title,
          issue_text: issue_text,
          created_by: created_by,
          assigned_to: assigned_to,
          status_text: status_text,
          open: true,
          created_on: new Date().toISOString(),
          updated_on: new Date().toISOString(),
          project: project,
        },
        (err, doc) => {
          res.send(doc);
        }
      );
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;
      let updateObjs = {
        ...((issue_title == "" ? false : true) && {
          issue_title: issue_title,
        }),
        ...((issue_text == "" ? false : true) && {
          issue_text: issue_text,
        }),
        ...((created_by == "" ? false : true) && {
          created_by: created_by,
        }),
        ...((assigned_to == "" ? false : true) && {
          assigned_to: assigned_to,
        }),
        ...((status_text == "" ? false : true) && {
          status_text: status_text,
        }),
        ...((open == undefined ? false : true) && { open: false }),
        updated_on: new Date().toISOString(),
      };
      let result = await issueModel.update({ _id: _id }, updateObjs);

      result.n === 1
        ? res.json({ result: "successfully updated", _id: _id })
        : null;
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const { _id } = req.body;
      let result = await issueModel.deleteOne({ _id: _id });
      result.n === 1
        ? res.send({ result: "successfully deleted", _id: _id })
        : null;
    });
};
