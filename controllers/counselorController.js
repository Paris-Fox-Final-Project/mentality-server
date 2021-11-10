const {Counselor,User} = require("../models")

class CounselorController{
    static async getCounselor(req,res,next){
        try {
            const counselors = await Counselor.findAll()
            res.status(200).json(counselors)
        } catch (err) {
            console.log(err, 'err get counselor')
        }
    }

    static async getCounselorById(req,res,next){
        try {
            const {id} = req.params
            const counselor = await Counselor.findOne({
                where: {
                    id: id
                }
            })
            if(!counselor){
                throw {name: "counselorNotFound"}
            }
            res.status(200).json(counselor)
        } catch (err) {
            console.log(err, 'err get counselor by id')
            if(err.name === "counselorNotFound"){
                res.status(400).json({message: "Counselor not found!"})
            }
        }
    }

    static async createCounselor(req,res,next){
        try {
            // isi data apa aja
            const {email,
                password,
                name,
                gender,
                avatarUrl,
                motto,
                specialist,
                about,
                price} = req.body

            const createdUserCounselor = await User.create({
                email:email,
                password:password,
                role: "Counselor",
                name: name,
                gender: gender,
                avatarUrl: avatarUrl
            })

            const createdCounselor = await Counselor.create({
                UserId: createdUserCounselor.id,
                motto: motto,
                specialist:specialist,
                about:about,
                price:price
            })
            const payload = {
                id: createdUserCounselor.id,
                email: createdUserCounselor.email,
                role: createdUserCounselor.role,
                name: createdUserCounselor.name,
                gender: createdUserCounselor.gender,
                avatarUrl: createdUserCounselor.avatarUrl,
                motto: createdCounselor.module,
                specialist: createdCounselor.specialist,
                about: createdCounselor.about,
                price: createdCounselor.price
            }
            res.status(201).json({
                counselor: payload,
            })
        } catch (err) {
            console.log(err, 'err create counselor')
        }
    }

    static async updateCounselor(req,res,next){
        try {
            // isi data apa aja
            const {motto,specialist,about,price} = req.body
            const {id} = req.params
            // find one dulu
            const updated = await Counselor.update({
                motto: motto,
                specialist:specialist,
                about:about,
                price:price
            },{
                where:{
                    UserId:id
                }
            })
            res.status(200).json({updated: updated})
        } catch (err) {
            console.log(err, 'err update counselor')
        }
    }
}
module.exports = CounselorController