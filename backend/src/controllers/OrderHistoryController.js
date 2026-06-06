// Order History uchun HTTP request/response handleri

const OrderHistoryService = require("../services/OrderHistoryService");

class OrderHistoryController {
  async getAllHistory(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const history = await OrderHistoryService.getAllHistory(
        startDate,
        endDate
      );

      res.status(200).json({
        success: true,
        message: "Order history ro'yxati",
        data: history,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getOrdersByTable(req, res) {
    try {
      const { tableId } = req.params;
      const history = await OrderHistoryService.getOrdersByTable(tableId);

      res.status(200).json({
        success: true,
        message: "Table bo'yicha order history",
        data: history,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMostPopularMenuItem(req, res) {
    try {
      const popularItem = await OrderHistoryService.getMostPopularMenuItem();

      res.status(200).json({
        success: true,
        message: "Eng ko'p buyurtma qilingan menu item",
        data: popularItem,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async iterateAllHistory(req, res) {
    try {
      const history = await OrderHistoryService.iterateAllHistory();

      res.status(200).json({
        success: true,
        message: "Iterator orqali order history traversal qilindi",
        data: history,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new OrderHistoryController();
