const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
const Journal = require("../Modals/Journal");

// Function to generate XML from list of URLs
function generateXML(urls, req) {
  let root = xmlbuilder.create("urls");

  const requestUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const parsedUrl = new URL(requestUrl);
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

  console.log(baseUrl);

  urls.forEach((url) => {
    root.ele("url", {}, baseUrl + "/" + url);
  });

  return root.end({ pretty: true });
}

async function createurlxmlfile(req, res) {
  try {
    const journals = await Journal.find(
      { isActive: true },
      { JournalSlug: 1, _id: 0 }
    );
    const subPages = [
      "aims-and-scope",
      "editorial-board",
      "peer-review",
      "for-editors",
      "why-submit",
      "article-types",
      "submissionchecklist",
      "author-instructions",
      "article-processing-fee",
      "editorial-office",
      "current-issue",
      "all-issues",
    ];

    // Generate subpages for each journal slug
    const journalSlugsWithSubpages = journals
      .map((journal) => {
        const journalSlug = journal.JournalSlug;
        const journalWithSubpages = subPages.map(
          (subPage) => `${journalSlug}/${subPage}`
        );
        return [journalSlug, ...journalWithSubpages]; // Combine normal slug with subpages
      })
      .flat();

    // Generate XML
    const xmlContent = generateXML(journalSlugsWithSubpages, req);

    // Write XML to a file asynchronously
    fs.writeFile("urls.xml", xmlContent, (err) => {
      if (err) {
        throw err;
      }

      // Set headers for XML response
      res.set("Content-Type", "text/xml");
      res.set("Content-Disposition", "attachment; filename=urls.xml");

      // Send XML content to the frontend
      res.send(xmlContent);
    });
  } catch (error) {
    // Handle errors
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createurlxmlfile,
};
