const router = require("express").Router({ mergeParams: true });
const User = require("../models/user");
const Post = require("../models/assignment");
const { isLoggedIn, isSameUser } = require("../middleware/auth");

router.post("/", isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 201;

  const { userId } = req.params;
  const query = { _id: userId };
  const user = await User.findOne(query);
  user.assignments.push(req.body);
  await user.save();

  const assignments = user.assignments[user.assignments.length - 1];
  res.status(status).json({ status, response: assignments });
});

router.put("/:postId", isLoggedIn, async (req, res, next) => {
  const status = 200;

  const { postId, userId } = req.params;
  const query = { _id: userId };
  const user = await User.findOne(query);
  const graded = user.assignments.filter(assign => {
    return assign.got !== undefined;
  });
  const assignments = user.assignments.id(postId);

  const { title, desc, proLink } = req.body;
  assignments.title = title;
  assignments.desc = desc;
  assignments.proLink = proLink;
  if (req.body.got) {
    if (user.assignments) {
      if (user.grade) {
        user.grade =
          (user.grade + (req.body.got / req.body.total) * 100) / graded.length;
      } else {
        user.grade = (req.body.got / req.body.total) * 100;
      }
    }

    assignments.got = req.body.got;
  }
  if (req.body.total) {
    assignments.total = req.body.total;
  }

  await user.save();

  res.status(status).json({ status, response: assignments });
});

router.delete("/:postId", isLoggedIn, isSameUser, async (req, res, next) => {
  const status = 200;

  const { postId, userId } = req.params;
  const query = { _id: userId };
  const user = await User.findOne(query);

  user.assignments = user.assignments.filter(assign => assign.id !== postId);
  await user.save();

  res.json({ status, response: user });
});

router.get("/ungraded", isLoggedIn, async (req, res) => {
  const users = await User.find({});
  let filteredData = [];
  let assignments = [];
  Array.prototype.forEach.call(users, user => {
    if (user.assignments.length !== 0) {
      filteredData.push(user);
    }
  });
  Array.prototype.forEach.call(filteredData, user => {
    user.assignments.map(assign => {
      if (assign.got === undefined) {
        assignments.push(assign);
      }
    });
    user.assignments = assignments;
    assignments = [];
  });

  res.json({ status: 200, response: filteredData });
});

router.get("/graded", isLoggedIn, async (req, res) => {
  const users = await User.find({});
  let filteredData = [];
  let assignments = [];
  Array.prototype.forEach.call(users, user => {
    if (user.assignments.length !== 0) {
      filteredData.push(user);
    }
  });
  Array.prototype.forEach.call(filteredData, user => {
    user.assignments.map(assign => {
      if (assign.got !== undefined) {
        assignments.push(assign);
      }
    });
    user.assignments = assignments;
    assignments = [];
  });

  res.json({ status: 200, response: filteredData });
});

module.exports = router;
