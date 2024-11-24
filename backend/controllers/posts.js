const Post = require("../models/post");

exports.createTeam = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      console.log(createdPost);
      res.status(201).json({
        message: "post added successfully!",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.updateTeam = (req, res, next) => {
  let imagePath = req.body.imagePath;
  console.log(req.body);
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });

  Post.updateOne({ _id: req.params.postId, creator: req.userData.userId }, post)
    .then((result) => {
      console.log(result);
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "post updated successfully!",
        });
      } else {
        res.status(401).json({
          message: "update not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "updating a post failed!",
      });
    });
};

exports.getTeams = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const creatorId = req.query.creatorId;
  const userId = req.userData.userId;

  let value = undefined;
  let fetchedPostsLength = 0;

  creatorId !== undefined ? (value = creatorId) : (value = req.userData.userId);

  const postQuery = Post.find({ creator: value });
  const postQueryForLength = Post.find({ creator: value });

  postQueryForLength.then((documents) => {
    fetchedPostsLength = documents.length;
  });

  let fetchedPosts;
  let fetchedPostsCount;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPostsCount = documents.length;
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "post fetched successfully!",
        posts: fetchedPosts,
        maxPosts: fetchedPostsLength,
        userId: userId,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "fetching posts failed!",
      });
    });
};

exports.getTeamById = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "post not found!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "fetching post failed!",
      });
    });
};

exports.deleteTeam = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "post deleted successfully!",
        });
      } else {
        res.status(401).json({
          message: "post deletion not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "deleting a post failed!",
      });
    });
};
