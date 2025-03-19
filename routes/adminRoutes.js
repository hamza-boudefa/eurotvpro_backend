const express = require("express")
const router = express.Router()
const { Op } = require("sequelize")
const { Order } = require("../models")

// Route to get filtered and paginated orders (for admin)
router.get("/orders", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 10 // Orders per page
    const offset = (page - 1) * limit
    const filter = req.query.filter || "all"

    // New filters
    const fullName = req.query.fullName || ""
    const status = req.query.status || ""
    const confirmationDate = req.query.confirmationDate || ""
    const email = req.query.email || ""
    const phoneNumber = req.query.phoneNumber || ""

    let whereClause = {}
    const currentDate = new Date()

    // Apply date filter
    switch (filter) {
      case "today":
        whereClause.createdAt = {
          [Op.gte]: new Date(currentDate.setHours(0, 0, 0, 0)),
        }
        break
      case "lastWeek":
        whereClause.createdAt = {
          [Op.gte]: new Date(currentDate.setDate(currentDate.getDate() - 7)),
        }
        break
      case "lastMonth":
        whereClause.createdAt = {
          [Op.gte]: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
        }
        break
      // 'all' doesn't need a where clause
    }

    // Apply full name filter
    if (fullName) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${fullName}%` } },
        { lastName: { [Op.like]: `%${fullName}%` } },
      ]
    }

    // Apply status filter
    if (status) {
      whereClause.status = status
    }

    // Apply confirmation date filter
    if (confirmationDate) {
      whereClause.confirmationDate = {
        [Op.gte]: new Date(confirmationDate),
      }
    }

    // Apply email filter
    if (email) {
      whereClause.email = { [Op.like]: `%${email}%` }
    }

    // Apply phone number filter
    if (phoneNumber) {
      whereClause.phoneNumber = { [Op.like]: `%${phoneNumber}%` }
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    })

    const totalPages = Math.ceil(count / limit)

    res.status(200).json({ orders, totalPages, currentPage: page })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching orders" })
  }
})

module.exports = router