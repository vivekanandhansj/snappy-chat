const express = require("express");

const { addMessage, getAllMessages } = require ("../controllers/messageController.js");


const router =express.Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getAllMessages);
module.exports = router;