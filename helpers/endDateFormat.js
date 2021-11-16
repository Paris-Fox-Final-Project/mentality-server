
function formatEndDate(startDate, session){
    const date = new Date(startDate)
    const hour = new Date(startDate).getHours()
    const endDate = `${date.toISOString().split("T")[0]} ${hour + session}:00:00+07`
    return endDate
}
module.exports = formatEndDate
// console.log(formatEndDate("2021-11-20 13:00:00.554 +0700",4))