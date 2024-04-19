const fs = require("fs");
const xmlbuilder = require("xmlbuilder");

// Function to generate XML from list of URLs
function generateXML(urls) {
  let root = xmlbuilder.create("urls");

  urls.forEach((url) => {
    root.ele("url", {}, url);
  });

  return root.end({ pretty: true });
}

function createurlxmlfile(req, res) {
  try {
    // Ensure req.body contains the expected data
    if (!req.body || !Array.isArray(req.body.listofurls)) {
      throw new Error("Invalid request data or listofurls is not an array");
    }

    // Extract list of URLs from request body
    const { listofurls } = req.body;

    // Generate XML
    const xmlContent = generateXML(listofurls);

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
