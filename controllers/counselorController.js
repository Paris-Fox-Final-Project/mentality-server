const {Counselor} = require("../models")

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
            const {} = req.body
            const created = await Counselor.create({

            })
            res.status(201).json(created)
        } catch (err) {
            console.log(err, 'err create counselor')
        }
    }

    static async updateCounselor(req,res,next){
        try {
            // isi data apa aja
            const {} = req.body
            const {id} = req.params
            // find one dulu
            const updated = await Counselor.update({

            },{
                where:{
                    id:id
                }
            })

        } catch (err) {
            console.log(err, 'err update counselor')
        }
    }
}
module.exports = CounselorController