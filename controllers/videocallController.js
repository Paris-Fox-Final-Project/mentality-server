const axios = require("axios")
const { CounselorUser,sequelize } = require("../models");
const dailyKey = process.env.DAILY_API_KEY || "a3fdbd0c05718b0604ccb0aadd96108c7990be061e67ba7a482630907364036f"

// const rumus = Math.floor((Date.now()/1000)) + 86400 //'exp' : 
// 86400 1 hari dalam detik
// let contoh = "2021-11-15 18:00:00.000 +0700"
// const rumusnbf = Math.floor(Date.parse(contoh)/1000)
// exp
// const expired = Math.floor(Date.parse(contoh)/1000) + sessions*3600
// atur gk bisa join sebelum waktunya
// nbf: integer
// nama room mau beda" atau sama saja
// harus ada kolom buat simpen link room buat user dan counselor ketika room dibuat?
/**
 * flow
 * sukses bayar bikin room
 * room link simen ke table user ?(di tabel user aj mungkin simpennya, berarti ada patch)
 * 
 */


/**
 * bayar done
 * bikin room
 * di fungsi bikin room kalo udh sukses bikin room langsung update ke counselorUser by id masukin link meeting
 * pas bikin room yg diatur tambah nbf mungkin dan exp
 */
class VideocallController{
    static async createRoom(req,res,next){
        // res.send("bikin video")
        try {
            const dummy = await CounselorUser.findOne({
                where:{
                    id: 15
                }
            })
            //req.body
            const rumusnbf = Math.floor(Date.parse(dummy.schedule)/1000)
            const expired = Math.floor(Date.parse(dummy.enddate)/1000)
            const create = await axios({
                url: "https://api.daily.co/v1/rooms",
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + dailyKey
                },
                data: { 
                    // name: "mentality",
                    privacy: "public",
                    properties: {
                        "start_audio_off":true,
                        "start_video_off":true,
                        "max_participants": 2,
                        // "hide_daily_branding": true,
                        "nbf": rumusnbf,
                        "exp": expired
                    }
                 }
            })
            console.log(create, 'balikan create room?');
            res.status(201).json(create.data.url)
        } catch (err) {
            console.log(err, 'err create room vidcall')
        }
    }
    // static async joinRoom(req,res,next){
    //     // res.send("join to room")
    //     try {
    //         const join = await axios({
    //             url: "https://api.daily.co/v1/rooms/mentality",
    //             method: "GET",
    //             headers:{
    //                 'content-type': 'application/json',
    //                 authorization: 'Bearer ' + dailyKey
    //             }
    //         })
    //         console.log(join, 'hoin')
    //         res.status(200).json(join.data.url)
    //     } catch (err) {
    //         console.log(err, 'get join room')
    //     }
    // }
}
module.exports = VideocallController