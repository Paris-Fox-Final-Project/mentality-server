const axios = require("axios")
const dailyKey = "a3fdbd0c05718b0604ccb0aadd96108c7990be061e67ba7a482630907364036f"

const rumus = Math.floor((Date.now()/1000)) + 86400 //'exp' : 

class VideocallController{
    static async createRoom(req,res,next){
        // res.send("bikin video")
        try {
            const create = await axios({
                url: "https://api.daily.co/v1/rooms",
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + dailyKey
                },
                data: { 
                    name: "mentality",
                    privacy: "private",
                    properties: {
                        "start_audio_off":false,
                        "start_video_off":true,
                        "max_participants": 2,
                        "enable_prejoin_ui": true
                    }
                 }
            })
            console.log(create, 'balikan create room?');
            res.status(201).json(create.data.url)
        } catch (err) {
            console.log(err, 'err create room vidcall')
        }
    }
    static async joinRoom(req,res,next){
        // res.send("join to room")
        try {
            const join = await axios({
                url: "https://api.daily.co/v1/rooms/DPZRaQZjpAMdMw4rxj9R",
                method: "GET",
                headers:{
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + dailyKey
                }
            })
            console.log(join, 'hoin')
            res.status(200).json(join.data.url)
        } catch (err) {
            console.log(err, 'get join room')
        }
    }
}
module.exports = VideocallController