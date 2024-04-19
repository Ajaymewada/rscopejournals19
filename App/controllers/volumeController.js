const mongoose = require("mongoose");
const Volume = require("../Modals/volumesModel");

async function createVolume(req, res) {
  try {
    const { title, body, journalid } = req.body;
    const latestVolume = await Volume.findOne(
      {},
      {},
      { sort: { volumeID: -1 } }
    );

    let newVolumeID = "VOL001";

    if (latestVolume) {
      const latestVolumeID = latestVolume.volumeID;
      const latestVolumeNumber = parseInt(latestVolumeID.slice(3), 10);
      newVolumeID = `VOL${(latestVolumeNumber + 1)
        .toString()
        .padStart(3, "0")}`;
    }

    const newVolume = new Volume({
      title,
      body,
      volumeID: newVolumeID,
      journalid: new mongoose.Types.ObjectId(journalid),
    });

    await newVolume.save();
    res.status(201).json(newVolume);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}

async function updateVolumeById(req, res) {
  try {
    const { title, body, volumeId } = req.body;

    const volume = await Volume.findByIdAndUpdate(
      volumeId,
      {
        title,
        body,
      },
      { new: true }
    );
    if (volume) {
      res.json(volume);
    } else {
      res.status(404).json({ error: "Volume not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}

async function getAllVolumes(req, res) {
  try {
    // const { volumeId } = req.body;
    const volume = await Volume.find({});

    if (volume) {
      res.json({
        volumes: volume,
        status: true,
      });
    } else {
      res.status(404).json({ error: "Volumes not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}

async function getVolumesByJournal(req, res) {
    try {
      // const { volumeId } = req.body;
      const {journalid} = req.params;
      const volume = await Volume.find({
        journalid: new mongoose.Types.ObjectId(journalid)
      });
  
      if (volume) {
        res.json({
          volumes: volume,
          status: true,
        });
      } else {
        res.status(200).json({ error: "Volumes not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  }



async function searchVolumesByTitleOrID(req, res) {
  try {
    const { searchTerm } = req.body;
    const volumes = await Volume.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } }, // Case-insensitive title search
        { volumeID: searchTerm },
      ],
    });

    if (volumes.length > 0) {
      res.json({
        volumes: volumes,
      });
    } else {
      res
        .status(200)
        .json({ error: "No volumes found with the given search criteria" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}

async function getVolumesWithPagination(req, res) {
  try {
    const page = parseInt(req.body.page) || 1; // Default to page 1 if not specified
    const limit = 5; // Default to 10 items per page if not specified

    const skip = (page - 1) * limit;

    const totalVolumes = await Volume.countDocuments({});
    const volumes = await Volume.find().skip(skip).limit(limit);

    const totalPages = Math.ceil(totalVolumes / limit);

    if (volumes.length > 0) {
      res.json({
        volumes,
        page,
        totalPages,
        totalVolumes,
      });
    } else {
      res.status(200).json({ error: "No volumes found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}

module.exports = {
  createVolume,
  updateVolumeById,
  getAllVolumes,
  searchVolumesByTitleOrID,
  getVolumesWithPagination,
  getVolumesByJournal
};
