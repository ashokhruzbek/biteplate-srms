// Buyurtmalar bilan ish logikasi
// Service - validation va business logic bu yerda

const OrderRepository = require("../repositories/OrderRepository");
const StandardPricing = require("../patterns/strategy/StandardPricing");
const HappyHourPricing = require("../patterns/strategy/HappyHourPricing");
const LoyaltyCardPricing = require("../patterns/strategy/LoyaltyCardPricing");
const KitchenQueue = require("../patterns/command/KitchenQueue");
const PrepareOrderCommand = require("../patterns/command/PrepareOrderCommand");
const CancelOrderCommand = require("../patterns/command/CancelOrderCommand");
const OrderHistoryLog = require("../patterns/singleton/OrderHistoryLog");
const OrderStatusSubject = require("../patterns/observer/OrderStatusSubject");
const WaiterNotifier = require("../patterns/observer/WaiterNotifier");
const ManagerDashboardNotifier = require(
  "../patterns/observer/ManagerDashboardNotifier"
);
const KitchenDisplayNotifier = require(
  "../patterns/observer/KitchenDisplayNotifier"
);
const BillingFacade = require("../patterns/facade/BillingFacade");

const PRICING_STRATEGIES = {
  STANDARD: new StandardPricing(),
  HAPPY_HOUR: new HappyHourPricing(),
  LOYALTY: new LoyaltyCardPricing(),
};

// Invoker: kitchen command history hozircha memory-da saqlanadi
const kitchenQueue = new KitchenQueue();

// Singleton: butun system bitta order history log instance-dan foydalanadi
const orderHistoryLog = OrderHistoryLog.getInstance();

// Observer Pattern: order status o'zgarganda barcha observer-lar xabar oladi
const orderStatusSubject = new OrderStatusSubject();
orderStatusSubject.attach(new WaiterNotifier());
orderStatusSubject.attach(new ManagerDashboardNotifier());
orderStatusSubject.attach(new KitchenDisplayNotifier());

// Facade Pattern: billing subsystem uchun yagona sodda interface
const billingFacade = new BillingFacade();

class OrderService {
  // Runtime-da kerakli pricing strategiyani tanlash
  getPricingStrategy(pricingMode = "STANDARD") {
    const normalizedPricingMode = String(
      pricingMode || "STANDARD"
    ).toUpperCase();
    const pricingStrategy = PRICING_STRATEGIES[normalizedPricingMode];

    if (!pricingStrategy) {
      throw new Error(
        "Invalid pricingMode. Allowed modes: STANDARD, HAPPY_HOUR, LOYALTY"
      );
    }

    return pricingStrategy;
  }

  // Yangi buyurtma qo'shish
  async createOrder(tableId, waiterId, items, pricingMode = "STANDARD") {
    // 1. Kerakli fieldlarni tekshirish
    if (!tableId || !waiterId || !items) {
      throw new Error("tableId, waiterId va items to'ldirilishi kerak");
    }

    // 2. Items array bo'lishini tekshirish
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Items kam bo'ladi 1 ta item");
    }

    // 3. Stol mavjudligini tekshirish
    const tableExists = await OrderRepository.checkTableExists(tableId);
    if (!tableExists) {
      throw new Error("Stol topilmadi");
    }

    // 4. Xodim mavjudligini tekshirish
    const waiterExists = await OrderRepository.checkWaiterExists(waiterId);
    if (!waiterExists) {
      throw new Error("Xodim topilmadi");
    }

    // 5. Menu items-larni tekshirish va strategy uchun tayyorlash
    const preparedItems = [];

    for (const item of items) {
      // Item validation
      if (!item.menuItemId || !item.quantity) {
        throw new Error("Har bir item-da menuItemId va quantity bo'lishi kerak");
      }

      if (isNaN(item.menuItemId) || isNaN(item.quantity)) {
        throw new Error("menuItemId va quantity raqam bo'lishi kerak");
      }

      if (item.quantity <= 0) {
        throw new Error("Quantity 0 dan katta bo'lishi kerak");
      }

      // Menu item-ni database dan olish
      const menuItem = await OrderRepository.getMenuItemById(item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ID ${item.menuItemId} topilmadi`);
      }

      // Item available bo'lishini tekshirish
      if (!menuItem.available) {
        throw new Error(
          `"${menuItem.name}" mavjud emas (available: false)`
        );
      }

      // Narxni hisoblash
      const itemPrice = menuItem.basePrice * item.quantity;

      // Item prepare qilish (database-ga yozish uchun)
      preparedItems.push({
        menuItemId: parseInt(item.menuItemId),
        quantity: parseInt(item.quantity),
        price: itemPrice,
      });
    }

    // 6. Strategy Pattern: tanlangan pricing algoritm orqali total hisoblash
    const pricingStrategy = this.getPricingStrategy(pricingMode);
    const totalAmount = pricingStrategy.calculateTotal(preparedItems);

    // 7. Buyurtma yaratish
    const orderData = {
      tableId: parseInt(tableId),
      waiterId: parseInt(waiterId),
      totalAmount,
      items: preparedItems,
    };

    const newOrder = await OrderRepository.createOrder(orderData);
    orderHistoryLog.addOrder(newOrder);

    return newOrder;
  }

  // Barcha buyurtmalarni olish
  async getAllOrders() {
    const orders = await OrderRepository.getAllOrders();
    return orders;
  }

  // Bir buyurtmani ID bo'yicha olish
  async getOrderById(id) {
    // ID tekshirish
    if (!id || isNaN(id)) {
      throw new Error("ID raqam bo'lishi kerak");
    }

    const order = await OrderRepository.getOrderById(id);

    if (!order) {
      throw new Error("Buyurtma topilmadi");
    }

    return order;
  }

  // Facade Pattern: order uchun bill yaratish
  async generateOrderBill(orderId, options = {}) {
    const order = await this.getOrderById(orderId);

    return billingFacade.generateBill(order, options);
  }

  // Command Pattern: order-ni kitchen tayyorlash jarayoniga o'tkazish
  async prepareOrder(orderId) {
    const order = await this.getOrderById(orderId);
    const command = new PrepareOrderCommand(order, OrderRepository);
    const updatedOrder = await kitchenQueue.executeCommand(command);

    orderStatusSubject.notify(updatedOrder);

    return updatedOrder;
  }

  // Command Pattern: order-ni bekor qilish
  async cancelOrder(orderId) {
    const order = await this.getOrderById(orderId);
    const command = new CancelOrderCommand(order, OrderRepository);
    const updatedOrder = await kitchenQueue.executeCommand(command);

    orderStatusSubject.notify(updatedOrder);

    return updatedOrder;
  }

  // Command Pattern: oxirgi kitchen action-ni undo qilish
  async undoLastKitchenAction() {
    return kitchenQueue.undoLastCommand();
  }
}

module.exports = new OrderService();
