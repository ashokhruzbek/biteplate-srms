import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import StaffListPage from '../pages/staff/StaffListPage'
import StaffCreatePage from '../pages/staff/StaffCreatePage'
import TablesListPage from '../pages/tables/TablesListPage'
import TablesCreatePage from '../pages/tables/TablesCreatePage'
import MenuListPage from '../pages/menu/MenuListPage'
import MenuCreatePage from '../pages/menu/MenuCreatePage'
import MenuCustomizePage from '../pages/menu/MenuCustomizePage'
import OrdersListPage from '../pages/orders/OrdersListPage'
import OrdersCreatePage from '../pages/orders/OrdersCreatePage'
import OrdersBillingPage from '../pages/orders/OrdersBillingPage'
import OrderHistoryPage from '../pages/order-history/OrderHistoryPage'
import PopularItemPage from '../pages/order-history/PopularItemPage'
import IteratorPage from '../pages/order-history/IteratorPage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="/staff" element={<StaffListPage />} />
          <Route path="/staff/create" element={<StaffCreatePage />} />

          <Route path="/tables" element={<TablesListPage />} />
          <Route path="/tables/create" element={<TablesCreatePage />} />

          <Route path="/menu" element={<MenuListPage />} />
          <Route path="/menu/create" element={<MenuCreatePage />} />
          <Route path="/menu/customize" element={<MenuCustomizePage />} />

          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/create" element={<OrdersCreatePage />} />
          <Route path="/orders/billing" element={<OrdersBillingPage />} />

          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/order-history/popular" element={<PopularItemPage />} />
          <Route path="/order-history/iterator" element={<IteratorPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
