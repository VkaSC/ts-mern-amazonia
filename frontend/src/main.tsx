import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.js'
import './index.css'
import HomePage from './pages/HomePage.js';
import ProductPage from './pages/ProductPage.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StoreProvider } from './Store.js';
import CartPage from './pages/CartPage.js';
import SigninPage from './pages/SigninPage.js';
import SignupPage from './pages/SignupPage.js';
import ShippingAddressPage from './pages/shippingAddressPage.js';
import PaymentMethodPage from './pages/PaymentMethodPage.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import PlaceOrderPage from './pages/PlaceOrderPage.js';
import OrderPage from './pages/OrderPage.js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import OrderHistoryPage from './pages/OrderHistoryPage.js';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path='product/:slug' element={<ProductPage />} />
      <Route path='cart' element={<CartPage />} />
      <Route path='signin' element={<SigninPage />} />
      <Route path='signup' element={<SignupPage />} />
      <Route path='' element={<ProtectedRoute />}>
        <Route path='shipping' element={<ShippingAddressPage />} />
        <Route path='payment' element={<PaymentMethodPage />} />
        <Route path='placeorder' element={<PlaceOrderPage />} />
        <Route path='/order/:id' element={<OrderPage />} />
        <Route path='/orderHistory' element={<OrderHistoryPage />} />
      </Route>
      {/*<Route path="dashboard" element={<Dashboard />} />*/}
      {/* ... etc. */}
    </Route>
  )
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <PayPalScriptProvider options={{ 'clientId': 'sb' }} //'client-id'==> es lo que el ha puesto en el codigo
        deferLoading={true}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HelmetProvider>
      </PayPalScriptProvider>

    </StoreProvider>
  </React.StrictMode>,
)
