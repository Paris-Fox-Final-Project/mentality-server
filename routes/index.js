const express = require("express");
const router = express.Router();
const counselor = require("./counselorRoute")

router.get('/', (req,res)=>{
    res.send('hello cuy')
})

router.use("/counselor", counselor)

module.exports = router;
