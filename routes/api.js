"use strict";
const mongoose = require("mongoose");
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const issueSchema = new mongoose.Schema(
  {
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    status_text: String,
    open: Boolean,
    created_on: String,
    updated_on: String,
    project: { type: String, select: false },
  },
  { version_key: false }
);

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
      issueModel
        .find(queryObj, (err, doc) => {
          if (err) res.send(err);
          res.send(doc);
        })
        .select("-__v -project");
    })

    .post(async function (req, res) {
      let projectName = req.params.project;
      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
      if (
        (issue_title == undefined) |
        (issue_text == undefined) |
        (created_by == undefined)
      )
        return res.send({ error: "required field(s) missing" });

      assigned_to == undefined ? (assigned_to = "") : null;
      status_text == undefined ? (status_text = "") : null;

      const newIssue = new issueModel({
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        open: true,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        project: projectName,
      });
      const doc = await newIssue.save();
      issueModel
        .findById(doc._id, (err, doc) => {
          if (err) console.log(err);
          res.send(doc);
        })
        .select("-__v");
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
      if (_id == undefined) return res.send({ error: "missing _id" });
      if (
        (issue_title == undefined) &
        (issue_text == undefined) &
        (created_by == undefined) &
        (assigned_to == undefined) &
        (status_text == undefined) &
        (open == undefined)
      )
        return res.send({ error: "no update field(s) sent", _id: _id });
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
      let result = await issueModel.updateOne({ _id: _id }, updateObjs);

      result.n === 1
        ? res.json({ result: "successfully updated", _id: _id })
        : res.json({ error: "could not update", _id: _id });
    })

    .delete(async function (req, res) {
      const { _id } = req.body;
      if (_id == undefined) {
        return res.send({ error: "missing _id" });
      } else {
        issueModel.deleteOne({ _id: _id }, (err, n) => {
          if (err) return console.log(err);
          if (n.deletedCount > 0) {
            res.send({ result: "successfully deleted", _id: _id });
          } else {
            res.send({ error: "could not delete", _id: _id });
          }
        });
      }
    });
};
