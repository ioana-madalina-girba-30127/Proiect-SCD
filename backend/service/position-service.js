import Position from "../models/Position.js";

export const createPosition = async (req, res) => {
  let createdPosition;
  const { longitude, latitude } = req.body;

  try {
    createdPosition = new Position({
      longitude,
      latitude,
    });

    await createdPosition.save();
  } catch (err) {
    res.json("Saving position failed!");
  }
  res.status(201).json({
    message: "New position added!",
    position: createdPosition,
  });
};

export const getAllPositions = async (req, res) => {
  let positions;
  try {
    positions = await Position.find().exec();
    console.log(positions);
    if (!positions)
      return res.json({
        message: "No position found!",
      });
  } catch (err) {
    return res.json({ message: "Could not show positions.", err: err });
  }

  res.json({
    message: "Positions: ",
    positions,
    payload: req.payload,
  });
};

export const deletePosition = async (req, res) => {
  const positionID = req.params.pid;

  let position;
  try {
    position = await Postion.findById(positionID);
  } catch (err) {
    return res.status(500).json("Deleting position failed! ");
  }

  try {
    await position.remove();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Deleting user has failed! ", error: err });
  }
  return res.status(200).json({ message: "Positon deleted.", position });
};
