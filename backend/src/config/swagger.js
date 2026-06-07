const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "BitePlate Smart Restaurant Management API",
    version: "1.0.0",
    description:
      "Professional OpenAPI documentation for the BitePlate Smart Restaurant Management System backend. This API covers staff, tables, menu items, orders, billing, and order history features used in the assignment implementation.",
    contact: {
      name: "BitePlate Development Team",
      email: "support@biteplate.com",
    },
  },
  servers: [
    {
      url: "https://biteplate-srms.onrender.com",
      description: "Production server",
    },
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "Staff login through phone number and password (lightweight, no JWT).",
    },
    {
      name: "Staff Management",
      description: "Create and retrieve restaurant staff records.",
    },
    {
      name: "Table Management",
      description: "Create, retrieve, and update restaurant tables.",
    },
    {
      name: "Menu Management",
      description: "Manage menu items and demonstrate meal customization.",
    },
    {
      name: "Order Management",
      description: "Create, retrieve, prepare, cancel, and undo order actions.",
    },
    {
      name: "Billing",
      description:
        "Generate educational billing calculations through a facade.",
    },
    {
      name: "Order History",
      description:
        "Read singleton order history and iterator traversal output.",
    },
  ],
  components: {
    schemas: {
      Staff: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          fullName: { type: "string", example: "Ali Karimov" },
          phoneNumber: { type: "string", example: "+998901112233" },
          email: {
            type: "string",
            nullable: true,
            example: "ali.karimov@biteplate.com",
          },
          role: {
            type: "string",
            enum: ["MANAGER", "WAITER", "CHEF", "CASHIER"],
            example: "WAITER",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-06T10:00:00.000Z",
          },
        },
      },
      RestaurantTable: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          tableNumber: { type: "integer", example: 12 },
          capacity: { type: "integer", example: 4 },
          status: {
            type: "string",
            enum: ["FREE", "RESERVED", "OCCUPIED", "AWAITING_BILL", "CLEARED"],
            example: "FREE",
          },
        },
      },
      MenuItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Burger" },
          description: {
            type: "string",
            example: "Grilled beef burger with fresh vegetables",
          },
          category: { type: "string", example: "Main Course" },
          basePrice: { type: "number", example: 25 },
          available: { type: "boolean", example: true },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          menuItemId: { type: "integer", example: 1 },
          quantity: { type: "integer", example: 2 },
          price: { type: "number", example: 50 },
          notes: {
            type: "string",
            nullable: true,
            example: "No onions",
          },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          orderNumber: {
            type: "string",
            example: "ORD-1780720000000-ab12cd34",
          },
          status: {
            type: "string",
            enum: ["PENDING", "PREPARING", "READY", "SERVED", "CANCELLED"],
            example: "PENDING",
          },
          totalAmount: { type: "number", example: 40 },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-06T10:00:00.000Z",
          },
          tableId: { type: "integer", example: 1 },
          waiterId: { type: "integer", example: 1 },
          orderItems: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
        },
      },
      BillResponse: {
        type: "object",
        properties: {
          subtotal: { type: "number", example: 100 },
          tax: { type: "number", example: 12 },
          tip: { type: "number", example: 10 },
          total: { type: "number", example: 122 },
          splitAmountPerPerson: { type: "number", example: 61 },
        },
      },
      OrderHistory: {
        type: "object",
        properties: {
          orderId: { type: "integer", example: 1 },
          orderNumber: {
            type: "string",
            example: "ORD-1780720000000-ab12cd34",
          },
          tableId: { type: "integer", example: 1 },
          waiterId: { type: "integer", example: 1 },
          totalAmount: { type: "number", example: 40 },
          status: { type: "string", example: "PENDING" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-06T10:00:00.000Z",
          },
        },
      },
      StaffCreateRequest: {
        type: "object",
        required: ["fullName", "phoneNumber", "password", "role"],
        properties: {
          fullName: { type: "string", example: "Ali Karimov" },
          phoneNumber: { type: "string", example: "+998901112233" },
          password: { type: "string", example: "secure123" },
          role: {
            type: "string",
            enum: ["MANAGER", "WAITER", "CHEF", "CASHIER"],
            example: "WAITER",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["phoneNumber", "password"],
        properties: {
          phoneNumber: { type: "string", example: "+998901112233" },
          password: { type: "string", example: "secure123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          fullName: { type: "string", example: "Ali Valiyev" },
          phoneNumber: { type: "string", example: "+998901112233" },
          role: {
            type: "string",
            enum: ["MANAGER", "WAITER", "CHEF", "CASHIER"],
            example: "WAITER",
          },
        },
      },
      TableCreateRequest: {
        type: "object",
        required: ["tableNumber", "capacity"],
        properties: {
          tableNumber: { type: "integer", example: 12 },
          capacity: { type: "integer", example: 4 },
        },
      },
      TableStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["FREE", "RESERVED", "OCCUPIED", "AWAITING_BILL", "CLEARED"],
            example: "OCCUPIED",
          },
        },
      },
      MenuItemCreateRequest: {
        type: "object",
        required: ["name", "description", "category", "basePrice"],
        properties: {
          name: { type: "string", example: "Burger" },
          description: {
            type: "string",
            example: "Grilled beef burger with fresh vegetables",
          },
          category: { type: "string", example: "Main Course" },
          basePrice: { type: "number", example: 25 },
        },
      },
      MenuCustomizeRequest: {
        type: "object",
        required: ["name", "basePrice", "extras"],
        properties: {
          name: { type: "string", example: "Burger" },
          basePrice: { type: "number", example: 25 },
          extras: {
            type: "array",
            items: {
              type: "string",
              enum: ["EXTRA_CHEESE", "SPICY_SAUCE", "GLUTEN_FREE"],
            },
            example: ["EXTRA_CHEESE", "SPICY_SAUCE"],
          },
        },
      },
      CustomizedMenuItem: {
        type: "object",
        properties: {
          description: {
            type: "string",
            example: "Burger, Extra Cheese, Spicy Sauce",
          },
          totalPrice: { type: "number", example: 32 },
        },
      },
      OrderCreateRequest: {
        type: "object",
        required: ["tableId", "waiterId", "items"],
        properties: {
          tableId: { type: "integer", example: 1 },
          waiterId: { type: "integer", example: 1 },
          pricingMode: {
            type: "string",
            enum: ["STANDARD", "HAPPY_HOUR", "LOYALTY"],
            example: "HAPPY_HOUR",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["menuItemId", "quantity"],
              properties: {
                menuItemId: { type: "integer", example: 1 },
                quantity: { type: "integer", example: 2 },
              },
            },
          },
        },
      },
      BillRequest: {
        type: "object",
        properties: {
          tipPercentage: { type: "number", example: 10 },
          peopleCount: { type: "integer", example: 2 },
        },
      },
      PopularMenuItem: {
        type: "object",
        nullable: true,
        properties: {
          menuItemId: { type: "integer", example: 1 },
          totalQuantity: { type: "integer", example: 6 },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation error message" },
        },
      },
    },
  },
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Staff login",
        description:
          "Authenticates a staff member with phone number and password. Returns basic user data without any token (lightweight assignment scope).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Tizimga muvaffaqiyatli kirildi",
                  data: {
                    id: 1,
                    fullName: "Ali Valiyev",
                    phoneNumber: "+998901112233",
                    role: "WAITER",
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials.",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message: "Telefon raqam yoki parol noto'g'ri",
                },
              },
            },
          },
        },
      },
    },
    "/api/staff": {
      post: {
        tags: ["Staff Management"],
        summary: "Create staff member",
        description: "Creates a new staff member with a restaurant role.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StaffCreateRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Staff member created successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Xodim muvaffaqiyatli qo'shildi",
                  data: {
                    id: 1,
                    fullName: "Ali Karimov",
                    phoneNumber: "+998901112233",
                    email: null,
                    role: "WAITER",
                    createdAt: "2026-06-06T10:00:00.000Z",
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
      get: {
        tags: ["Staff Management"],
        summary: "Get all staff",
        description: "Returns all staff records.",
        responses: {
          200: {
            description: "Staff list returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Xodimlar ro'yxati",
                  data: [
                    {
                      id: 1,
                      fullName: "Ali Karimov",
                      phoneNumber: "+998901112233",
                      email: null,
                      role: "WAITER",
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/staff/{id}": {
      get: {
        tags: ["Staff Management"],
        summary: "Get staff by ID",
        description: "Returns one staff member by numeric ID.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Staff member returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Xodim ma'lumotlari",
                  data: {
                    id: 1,
                    fullName: "Ali Karimov",
                    email: "ali.karimov@biteplate.com",
                    role: "WAITER",
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/tables": {
      post: {
        tags: ["Table Management"],
        summary: "Create restaurant table",
        description:
          "Creates a new restaurant table with table number and capacity.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TableCreateRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Table created successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Stol muvaffaqiyatli qo'shildi",
                  data: {
                    id: 1,
                    tableNumber: 12,
                    capacity: 4,
                    status: "FREE",
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
      get: {
        tags: ["Table Management"],
        summary: "Get all tables",
        description: "Returns all restaurant tables.",
        responses: {
          200: {
            description: "Table list returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Stollar ro'yxati",
                  data: [
                    {
                      id: 1,
                      tableNumber: 12,
                      capacity: 4,
                      status: "FREE",
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/tables/{id}": {
      get: {
        tags: ["Table Management"],
        summary: "Get table by ID",
        description: "Returns one restaurant table by numeric ID.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Table returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Stol ma'lumotlari",
                  data: {
                    id: 1,
                    tableNumber: 12,
                    capacity: 4,
                    status: "FREE",
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/tables/{id}/status": {
      patch: {
        tags: ["Table Management"],
        summary: "Update table status",
        description:
          "Updates the current operational status of a restaurant table.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TableStatusRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Table status updated successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Stol statusi o'zgartirildi",
                  data: {
                    id: 1,
                    tableNumber: 12,
                    capacity: 4,
                    status: "OCCUPIED",
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/menu-items": {
      post: {
        tags: ["Menu Management"],
        summary: "Create menu item",
        description: "Creates a new menu item in the restaurant menu.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MenuItemCreateRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Menu item created successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Menu item muvaffaqiyatli qo'shildi",
                  data: {
                    id: 1,
                    name: "Burger",
                    description: "Grilled beef burger with fresh vegetables",
                    category: "Main Course",
                    basePrice: 25,
                    available: true,
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
      get: {
        tags: ["Menu Management"],
        summary: "Get all menu items",
        description: "Returns all available menu records ordered by category.",
        responses: {
          200: {
            description: "Menu item list returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Menu item-lar ro'yxati",
                  data: [
                    {
                      id: 1,
                      name: "Burger",
                      description: "Grilled beef burger with fresh vegetables",
                      category: "Main Course",
                      basePrice: 25,
                      available: true,
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/menu-items/{id}": {
      get: {
        tags: ["Menu Management"],
        summary: "Get menu item by ID",
        description: "Returns one menu item by numeric ID.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Menu item returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Menu item ma'lumotlari",
                  data: {
                    id: 1,
                    name: "Burger",
                    description: "Grilled beef burger with fresh vegetables",
                    category: "Main Course",
                    basePrice: 25,
                    available: true,
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/menu-items/customize": {
      post: {
        tags: ["Menu Management"],
        summary: "Customize menu item",
        description:
          "Demonstrates the Decorator Pattern by dynamically applying extras to a base menu item without persistence.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MenuCustomizeRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Customized menu item returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Menu item customize qilindi",
                  data: {
                    description: "Burger, Extra Cheese, Spicy Sauce",
                    totalPrice: 32,
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/orders": {
      post: {
        tags: ["Order Management"],
        summary: "Create order",
        description:
          "Creates a new order and calculates total amount using the selected pricing strategy.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OrderCreateRequest" },
              example: {
                tableId: 1,
                waiterId: 1,
                pricingMode: "HAPPY_HOUR",
                items: [
                  {
                    menuItemId: 1,
                    quantity: 2,
                  },
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Order created successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Buyurtma muvaffaqiyatli qo'shildi",
                  data: {
                    id: 1,
                    orderNumber: "ORD-1780720000000-ab12cd34",
                    status: "PENDING",
                    totalAmount: 40,
                    tableId: 1,
                    waiterId: 1,
                    orderItems: [
                      {
                        id: 1,
                        menuItemId: 1,
                        quantity: 2,
                        price: 50,
                      },
                    ],
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
      get: {
        tags: ["Order Management"],
        summary: "Get all orders",
        description:
          "Returns all orders with related table, waiter, and order item data.",
        responses: {
          200: {
            description: "Order list returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Buyurtmalar ro'yxati",
                  data: [
                    {
                      id: 1,
                      orderNumber: "ORD-1780720000000-ab12cd34",
                      status: "PENDING",
                      totalAmount: 40,
                    },
                  ],
                },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/api/orders/{id}": {
      get: {
        tags: ["Order Management"],
        summary: "Get order by ID",
        description: "Returns one order by numeric ID.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Order returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Buyurtma ma'lumotlari",
                  data: {
                    id: 1,
                    orderNumber: "ORD-1780720000000-ab12cd34",
                    status: "PENDING",
                    totalAmount: 40,
                    tableId: 1,
                    waiterId: 1,
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/orders/{id}/prepare": {
      patch: {
        tags: ["Order Management"],
        summary: "Prepare order",
        description:
          "Runs the kitchen PrepareOrderCommand and updates order status to PREPARING.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Order status updated to PREPARING.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Buyurtma PREPARING statusiga o'tkazildi",
                  data: {
                    id: 1,
                    orderNumber: "ORD-1780720000000-ab12cd34",
                    status: "PREPARING",
                    totalAmount: 40,
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/orders/{id}/cancel": {
      patch: {
        tags: ["Order Management"],
        summary: "Cancel order",
        description:
          "Runs the kitchen CancelOrderCommand and updates order status to CANCELLED.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Order status updated to CANCELLED.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Buyurtma CANCELLED statusiga o'tkazildi",
                  data: {
                    id: 1,
                    orderNumber: "ORD-1780720000000-ab12cd34",
                    status: "CANCELLED",
                    totalAmount: 40,
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/orders/undo-last-action": {
      post: {
        tags: ["Order Management"],
        summary: "Undo last kitchen action",
        description:
          "Undoes the last in-memory kitchen command action using the Command Pattern history.",
        responses: {
          200: {
            description: "Last kitchen action undone successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Oxirgi kitchen action undo qilindi",
                  data: {
                    id: 1,
                    orderNumber: "ORD-1780720000000-ab12cd34",
                    status: "PENDING",
                    totalAmount: 40,
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/orders/{id}/bill": {
      post: {
        tags: ["Billing"],
        summary: "Generate order bill",
        description:
          "Generates a bill through the BillingFacade with subtotal, tax, tip, total, and split amount.",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BillRequest" },
              example: {
                tipPercentage: 10,
                peopleCount: 2,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Bill generated successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Bill muvaffaqiyatli yaratildi",
                  data: {
                    subtotal: 100,
                    tax: 12,
                    tip: 10,
                    total: 122,
                    splitAmountPerPerson: 61,
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/order-history": {
      get: {
        tags: ["Order History"],
        summary: "Get order history",
        description:
          "Returns all in-memory order history records. Optional startDate and endDate query parameters filter by date range.",
        parameters: [
          {
            in: "query",
            name: "startDate",
            required: false,
            schema: { type: "string", format: "date" },
            example: "2026-06-01",
          },
          {
            in: "query",
            name: "endDate",
            required: false,
            schema: { type: "string", format: "date" },
            example: "2026-06-30",
          },
        ],
        responses: {
          200: {
            description: "Order history returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Order history ro'yxati",
                  data: [
                    {
                      orderId: 1,
                      orderNumber: "ORD-1780720000000-ab12cd34",
                      tableId: 1,
                      waiterId: 1,
                      totalAmount: 40,
                      status: "PENDING",
                      createdAt: "2026-06-06T10:00:00.000Z",
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/order-history/iterate": {
      get: {
        tags: ["Order History"],
        summary: "Iterate order history",
        description:
          "Returns order history records traversed through the Iterator Pattern implementation.",
        responses: {
          200: {
            description: "Iterator traversal returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Iterator orqali order history traversal qilindi",
                  data: [
                    {
                      orderId: 1,
                      orderNumber: "ORD-1780720000000-ab12cd34",
                      tableId: 1,
                      waiterId: 1,
                      totalAmount: 40,
                      status: "PENDING",
                      createdAt: "2026-06-06T10:00:00.000Z",
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/order-history/table/{tableId}": {
      get: {
        tags: ["Order History"],
        summary: "Get order history by table",
        description: "Returns in-memory order history records for one table.",
        parameters: [
          {
            in: "path",
            name: "tableId",
            required: true,
            schema: { type: "integer" },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Table order history returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Table bo'yicha order history",
                  data: [
                    {
                      orderId: 1,
                      orderNumber: "ORD-1780720000000-ab12cd34",
                      tableId: 1,
                      waiterId: 1,
                      totalAmount: 40,
                      status: "PENDING",
                      createdAt: "2026-06-06T10:00:00.000Z",
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/order-history/popular-item": {
      get: {
        tags: ["Order History"],
        summary: "Get most popular menu item",
        description:
          "Returns the most frequently ordered menu item from the in-memory order history cache.",
        responses: {
          200: {
            description: "Most popular menu item returned successfully.",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Eng ko'p buyurtma qilingan menu item",
                  data: {
                    menuItemId: 1,
                    totalQuantity: 6,
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
  },
};

swaggerDefinition.components.parameters = {
  IdParam: {
    in: "path",
    name: "id",
    required: true,
    schema: { type: "integer" },
    example: 1,
  },
};

swaggerDefinition.components.responses = {
  BadRequest: {
    description: "Bad request or validation error.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
        example: {
          success: false,
          message: "Validation error message",
        },
      },
    },
  },
  NotFound: {
    description: "Requested resource was not found.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
        example: {
          success: false,
          message: "Resource not found",
        },
      },
    },
  },
  ServerError: {
    description: "Internal server error.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
        example: {
          success: false,
          message: "Internal server error",
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
