const UrlSchema = require("../Schema/url.schema");
const shortid = require("shortid");

const BASE_URL = "http://short.com/";

// Create a new link
exports.shortenUrl = async (req, res) => {
  const { destinationUrl, remarks, expiryDate } = req.body;
  const userId = req.user.id;
  // Dynamically get the base URL (works for both development and production)
  const baseUrl = `${req.protocol}:${req.get("host")}`;

  // Generate URL code (use shortid, nanoid, or any unique ID generator)
  const urlCode = shortid.generate();

  try {
    // Check if the original URL already exists in the database
    let url = await UrlSchema.findOne({ destinationUrl });
    if (url) {
      // If the URL exists, return the existing shortened URL
      return res.json(url);
    } else {
      // Create a new shortened URL
      const shortUrl = `${baseUrl}/${urlCode}`;

      // Handle expiration date if provided
      let expiration = null;
      if (expiryDate) {
        expiration = new Date(expiryDate);
      }

      // Save the new URL to the database
      url = new UrlSchema({
        destinationUrl,
        shortUrl,
        urlCode,
        remarks,
        clickCount: 1,
        expiryDate: expiration,
        userId,
        status: "Active",
      });

      await url.save();
      return res.status(201).json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

// In routes/url.js or similar file

// Route to redirect short URL to the original URL
exports.redirectUrl = async (req, res) => {
  const shortUrlCode = req.params.shorted;

  try {
    // Look up the original URL using the short URL code
    const urlData = await UrlSchema.findOne({ urlCode: shortUrlCode });
    if (!urlData) {
      return res.status(404).json("No URL found");
    }

    const countUrl = (urlData.clickCount += 1);

    // Get today's date in "YYYY-MM-DD" format
    const today = new Date().toISOString().split("T")[0];

    // Check if there's already a record for today
    const todayClickData = urlData.dailyClickCounts.find(
      (data) => data.date === today
    );

    if (todayClickData) {
      // Increment the click count for today
      todayClickData.count += 1;
    } else {
      // Add a new entry for today's date
      urlData.dailyClickCounts.push({
        date: today,
        count: 1,
      });
    }

    // Ensure cumulative addition of today's count to the previous day's count
    urlData.dailyClickCounts.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    ); // Sort by date
    for (let i = 1; i < urlData.dailyClickCounts.length; i++) {
      urlData.dailyClickCounts[i].count +=
        urlData.dailyClickCounts[i - 1].count;
    }

    // Extract device type and IP address
    // const deviceType = req.device.type || "Desktop"; // Use express-device to get device type
    const deviceType = req.device.parser.useragent.family || "Desktop";
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get IP address

    // Save the device details and IP address to the database
    urlData.deviceDetails.push({
      deviceType,
      ipAddress,
      clickedAt: new Date(), // Store the current timestamp
    });

    await urlData.save();

    // If found, redirect the user to the original URL
    return res.redirect(urlData.destinationUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
};

// Get all links
exports.getAllLinks = async (req, res) => {
  try {
    const links = await UrlSchema.find();
    res.status(200).json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }

  const { page = 1, limit = 10, search = "" } = req.query;

  // setTimeout(async () => {
  //   const query = search
  //     ? { originalUrl: { $regex: search, $options: "i" } }
  //     : {};
  //   const urls = await UrlSchema.find(query)
  //     .limit(limit * 1)
  //     .skip((page - 1) * limit)
  //     .exec();

  //   const count = await UrlSchema.countDocuments(query);

  //   res.json({
  //     urls,
  //     totalPages: Math.ceil(count / limit),
  //     currentPage: page,
  //   });
  // }, 3000);
};

// Get a single link by ID
exports.getLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await UrlSchema.findById(id);

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.status(200).json({ data: link });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a link
exports.updateLink = async (req, res) => {
  try {
    const { id } = req.params;

    // Build an object containing only the fields the user wants to update
    const updateData = {};
    if (req.body.destinationUrl !== undefined) {
      updateData.destinationUrl = req.body.destinationUrl;
    }
    if (req.body.remarks !== undefined) {
      updateData.remarks = req.body.remarks;
    }
    if (req.body.linkExpiration !== undefined) {
      updateData.linkExpiration = req.body.linkExpiration;

      // If linkExpiration.enabled is false, remove expirationDate
      if (req.body.linkExpiration.enabled === false) {
        updateData.linkExpiration.expirationDate = undefined; // Clear expirationDate
      }
    }

    const updatedLink = await UrlSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    res
      .status(200)
      .json({ message: "Link updated successfully", data: updatedLink });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLink = await UrlSchema.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    res
      .status(200)
      .json({ message: "Link deleted successfully", data: deletedLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get info from the db

exports.getInfo = async (req, res) => {
  const userId = req.user.id;
  try {
    // Fetch all URLs created by the authenticated user
    const urls = await UrlSchema.find({ userId: req.user._id });

    if (!urls.length) {
      return res.status(404).json({ message: "No links found for this user" });
    }

    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving URLs", error });
  }
};
