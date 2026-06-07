import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import RequireAuth from '../guards/RequireAuth'
import ProtectedRoute from '../guards/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login'
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

/** Route elementini path-based rol tekshiruvi bilan o'raydi. */
function guarded(element) {
  return <ProtectedRoute>{element}</ProtectedRoute>
}

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ochiq route — login */}
          <Route path="/login" element={<Login />} />

          {/* Auth talab qiladigan dashboard */}
          <Route element={<RequireAuth />}>
            <Route element={<MainLayout />}>
              <Route index element={<Dashboard />} />

              <Route path="/staff" element={guarded(<StaffListPage />)} />
              <Route
                path="/staff/create"
                element={guarded(<StaffCreatePage />)}
              />

              <Route path="/tables" element={guarded(<TablesListPage />)} />
              <Route
                path="/tables/create"
                element={guarded(<TablesCreatePage />)}
              />

              <Route path="/menu" element={guarded(<MenuListPage />)} />
              <Route path="/menu/create" element={guarded(<MenuCreatePage />)} />
              <Route
                path="/menu/customize"
                element={guarded(<MenuCustomizePage />)}
              />

              <Route path="/orders" element={guarded(<OrdersListPage />)} />
              <Route
                path="/orders/create"
                element={guarded(<OrdersCreatePage />)}
              />
              <Route
                path="/orders/billing"
                element={guarded(<OrdersBillingPage />)}
              />

              <Route
                path="/order-history"
                element={guarded(<OrderHistoryPage />)}
              />
              <Route
                path="/order-history/popular"
                element={guarded(<PopularItemPage />)}
              />
              <Route
                path="/order-history/iterator"
                element={guarded(<IteratorPage />)}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default AppRoutes
