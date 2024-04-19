const mongoose = require("mongoose");
const AddArticle = require("../Modals/addArticleModal");

// Function to save a new article
async function saveArticle(req, res) {
  try {
    let articleData = req.body;
    if (articleData && articleData.authorNames) {
      articleData.authorNames = JSON.parse(articleData.authorNames);
    }
    if (articleData && articleData.articlekeywords) {
      articleData.articlekeywords = JSON.parse(articleData.articlekeywords);
    }
    if (articleData && articleData.publisheddate) {
      articleData.publisheddate = new Date(
        articleData.publisheddate
      ).toISOString();
    }
    if (req.file) {
      articleData.pdffilepath = `artcilePDFFile/${req.file.filename}`;
    }
    const latestArticle = await AddArticle.findOne(
      {},
      {},
      { sort: { articleID: -1 } }
    );

    let newArticleID = "ART001";

    if (latestArticle) {
      const latestArticleID = latestArticle.articleID;
      const latestArticleNumber = parseInt(latestArticleID.slice(3), 10);
      newArticleID = `ART${(latestArticleNumber + 1)
        .toString()
        .padStart(3, "0")}`;
    }
    articleData.statusflag = "In-Press";
    articleData.articleID = newArticleID || "";
    articleData.volumeuid = null;
    articleData.issueuid = null;
    articleData.journalid = new mongoose.Types.ObjectId(articleData.journalid);
    let inPressDocCount = await AddArticle.find({
      statusflag: "In-Press",
      journalid: new mongoose.Types.ObjectId(articleData.journalid),
    }).count();
    if (inPressDocCount >= 5) {
      res.status(500).json({
        status: false,
        msg: "In-press articles are reached to 5, move the article to issue!",
      });
      return;
    }
    const newArticle = new AddArticle(articleData);

    // Save the new article to the database
    const savedArticle = await newArticle.save();

    // Respond with the saved article as JSON
    if (savedArticle) {
      res.json(savedArticle);
    } else {
      res.status(500).json({
        status: false,
        msg: "Issue in saving the article!",
      });
    }
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error saving article:", error);
    res.status(500).json({ error: "Failed to save article" });
  }
}

// Function to update an existing article by ID
async function updateArticle(req, res) {
  // console.log(req.body);
  const articleId = req.body._id;
  let updatequery = {
    title: req.body.title,
    abstract: req.body.abstract,
    citation: req.body.citation,
    authorNames: req.body.authorNames,
  };
  try {
    const updatedArticle = await AddArticle.findByIdAndUpdate(
      articleId,
      updatequery,
      { new: true }
    );

    if (!updatedArticle) {
      // If the article with the given ID doesn't exist, send a 404 response
      return res.status(404).json({ error: "Article not found" });
    }

    // Respond with the updated article as JSON
    res.json(updatedArticle);
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Failed to update article" });
  }
}

async function getAticles(req, res) {
  AddArticle.find({}, (err, docs) => {
    if (err) {
      res.status(500).json({
        msg: "No docs Found!",
        status: false,
      });
    } else {
      res.status(200).json({
        msg: "docs Found!",
        status: true,
        data: docs,
      });
    }
  });
}

async function getArticlesPaginationWise(req, res) {
  try {
    const perPage = 5; // Number of documents to fetch per page
    const skip = (req.body.pageNumber - 1) * perPage; // Calculate the number of documents to skip

    // Use the "find" method to retrieve articles with pagination
    let findQuery = {};
    if (req.body.journalid) {
      findQuery.journalid = new mongoose.Types.ObjectId(req.body.journalid);
    }
    const articles = await AddArticle.find(findQuery)
      .skip(skip)
      .limit(perPage)
      .populate("volumeuid", "title")
      .populate("issueuid", "title")
      .populate("journalid", "JournalName");

    // Count the total number of articles (for pagination)
    let countQuery = {}
    if (req.body.journalid) {
      countQuery.journalid = new mongoose.Types.ObjectId(req.body.journalid);
    }
    const totalArticles = await AddArticle.countDocuments(countQuery);
    const totalPages = Math.ceil(totalArticles / perPage);
    if (articles) {
      res.status(200).json({
        articles,
        totalArticles,
        status: true,
        totalPages,
      });
    } else {
      res.status(500).json({
        status: false,
      });
    }
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error fetching articles:", error);
    throw error;
  }
}

async function searchArticle(req, res) {
  // console.log(req.body.name);
  let searchTerm = req.body.name;
  let articles1 = await AddArticle.find({
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { articleID: searchTerm },
    ],
  })
    .populate("volumeuid", "title")
    .populate("issueuid", "title");
  // console.log(articles1);
  if (articles1 !== null) {
    res.status(200).json({
      msg: "Data Found!",
      status: true,
      articles: articles1,
    });
  } else {
    res.status(500).json({
      msg: "No Data",
      status: false,
      articles: {},
    });
  }
}

async function getInPressArticles(req, res) {
  try {
    const { journalid } = req.params;
    if (journalid) {
      AddArticle.find(
        {
          statusflag: "In-Press",
          journalid: new mongoose.Types.ObjectId(journalid),
        },
        (err, articles) => {
          if (err) {
            res.status(500).json({
              status: false,
              msg: "No Articles Found!",
            });
          } else {
            res.status(200).json({
              status: true,
              msg: "Articles Found!",
              articles,
            });
          }
        }
      );
    } else {
      res.status(500).json({
        status: false,
        msg: "Invalid Journal ID!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "No Articles Found!",
    });
  }
}

async function getAllInPressArticles(req, res) {
  try {
    const articles = await AddArticle.aggregate([
      {
        $match: {
          statusflag: "In-Press",
        },
      },
      {
        $lookup: {
          from: "journals",
          localField: "journalid",
          foreignField: "_id",
          as: "journal",
        },
      },
      {
        $unwind: "$journal",
      },
    ]);

    if (articles.length === 0) {
      return res.status(200).json({
        status: false,
        msg: "No Articles Found!",
      });
    }
    res.status(200).json({
      status: true,
      msg: "Articles Found!",
      articles,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "No Articles Found!",
    });
  }
}

async function movearticletoIssue(req, res) {
  const { selectedVolume, selectedIssue, articleuid } = req.body;
  if (selectedVolume && selectedIssue && articleuid) {
    let updateQuery = {
      $set: {
        volumeuid: mongoose.Types.ObjectId(selectedVolume),
        issueuid: mongoose.Types.ObjectId(selectedIssue),
        statusflag: "In-Issue",
      },
    };
    let searchQuery = {
      _id: mongoose.Types.ObjectId(articleuid),
    };
    try {
      AddArticle.findByIdAndUpdate(searchQuery, updateQuery, (err, docs) => {
        if (err) {
          res.status(500).json({
            status: false,
            msg: "Articles Update Failed!",
          });
        } else {
          res.status(200).json({
            status: true,
            msg: "Articles Update Success!",
            docs,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        msg: "Articles Update Failed!",
      });
    }
  }
}

async function getArticleByID(req, res) {
  let articleID = req.body.article_id;
  if (articleID == null && articleID == "") {
    res.status(200).json({
      status: false,
      article: null,
    });
    return;
  }
  AddArticle.findById(articleID, (err, doc) => {
    if (err) {
      res.status(200).json({
        status: false,
        article: null,
      });
    } else {
      res.status(200).json({
        status: true,
        article: doc,
      });
    }
  });
}

async function updateArticleViews(req, res) {
  let articleID = req.body.article_id;
  if (articleID == null && articleID == "") {
    res.status(200).json({
      status: false,
      article: null,
    });
    return;
  }
  AddArticle.findById(articleID, async (err, doc) => {
    if (err) {
      res.status(200).json({
        status: false,
        article: null,
      });
    } else {
      // res.status(200).json({
      //     status: true,
      //     article: doc
      // })
      if (doc != null) {
        let updatedviews = 0;
        if (doc.views != null) {
          updatedviews = doc.views + 1;
        }
        try {
          const updatedArticle = await AddArticle.findByIdAndUpdate(
            articleID,
            {
              views: updatedviews,
            },
            { new: true }
          );

          if (!updatedArticle) {
            // If the article with the given ID doesn't exist, send a 404 response
            return res.status(404).json({ error: "Article not found" });
          }

          // Respond with the updated article as JSON
          res.json(updatedArticle);
        } catch (error) {
          // Handle errors and send an error response
          console.error("Error updating article:", error);
          res.status(500).json({ error: "Failed to update article" });
        }
      }
    }
  });
}

async function getArticlesByJournalID(req, res) {
  let journalid = req.body.journalid;
  if (journalid == null && journalid == "") {
    res.status(200).json({
      status: false,
      article: null,
    });
    return;
  }
  AddArticle.find(
    {
      journalid: new mongoose.Types.ObjectId(journalid),
    },
    (err, docs) => {
      if (err) {
        res.status(200).json({
          status: false,
          article: null,
        });
      } else {
        res.status(200).json({
          msg: "docs Found!",
          status: true,
          data: docs,
        });
      }
    }
  );
}

// Export both functions for use in routes
module.exports = {
  saveArticle,
  updateArticle,
  getAticles,
  getArticlesPaginationWise,
  searchArticle,
  getInPressArticles,
  movearticletoIssue,
  getArticleByID,
  updateArticleViews,
  getAllInPressArticles,
  getArticlesByJournalID,
};
