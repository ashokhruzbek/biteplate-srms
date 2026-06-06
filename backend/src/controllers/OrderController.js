// Buyurtmalar uchun HTTP request/response handleri
// Controller - API qo'ngiroqlarni qabul qiladi va service ga o'tkazadi

const OrderService = require("../services/OrderService");

class OrderController {
  // Yangi buyurtma qo'shish
  async createOrder(req, res) {
    try {
      // Request bodydan ma'lumotlarni olish
      const { tableId, waiterId, pricingMode, items } = req.body;

      // Service-ga o'tkazish
      const newOrder = await OrderService.createOrder(
        tableId,
        waiterId,
        items,
        pricingMode
      );

      // Muvaffaqiyatli javob
      res.status(201).json({
        success: true,
        message: "Buyurtma muvaffaqiyatli qo'shildi",
        data: newOrder,
      });
    } catch (error) {
      // Xato javob
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Barcha buyurtmalarni olish
  async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();

      res.status(200).json({
        success: true,
        message: "Buyurtmalar ro'yxati",
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Bir buyurtmani olish
  async getOrderById(req, res) {
    try {
      const { id } = req.params;

      const order = await OrderService.getOrderById(id);

      res.status(200).json({
        success: true,
        message: "Buyurtma ma'lumotlari",
        data: order,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buyurtmani kitchen tayyorlash jarayoniga o'tkazish
  async prepareOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await OrderService.prepareOrder(id);

      res.status(200).json({
        success: true,
        message: "Buyurtma PREPARING statusiga o'tkazildi",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buyurtmani bekor qilish
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await OrderService.cancelOrder(id);

      res.status(200).json({
        success: true,
        message: "Buyurtma CANCELLED statusiga o'tkazildi",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Oxirgi kitchen action-ni undo qilish
  async undoLastKitchenAction(req, res) {
    try {
      const order = await OrderService.undoLastKitchenAction();

      res.status(200).json({
        success: true,
        message: "Oxirgi kitchen action undo qilindi",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new OrderController();
