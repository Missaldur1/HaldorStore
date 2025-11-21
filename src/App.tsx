import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import ScrollTop from "./components/ScrollTop"
import NotFound from "./pages/NotFound"
import Catalog from "./pages/Catalog"
import ProductDetail from "./pages/ProductDetail"
import CartPage from "./pages/Cart"
import Checkout from "./pages/Checkout"
import OrderReceipt from "./pages/OrderReceipt"
import AuthModal from "./components/AuthModal"
import Account from "./pages/Account"
import { AppErrorBoundary } from "./components/AppErrorBoundary"
import OrdersPage from "./pages/Orders"
import WebpayInit from "./pages/WebpayInit"
import WebpayVoucher from "./pages/WebpayVoucher"
import WebPayBankAuth from "./pages/WebpayBankAuth"

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <AppErrorBoundary>
      <div className="min-h-dvh flex flex-col bg-[#0f1316] text-stone-100">
        
        {/* NAVBAR */}
        <Navbar onOpenAuth={() => setAuthOpen(true)} />

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 mx-auto max-w-6xl px-4 py-6 w-full">
          <ScrollTop />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<OrderReceipt />} />
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/webpay/init" element={<WebpayInit />} />
            <Route path="/webpay/bank-auth" element={<WebPayBankAuth />} />
            <Route path="/webpay/voucher" element={<WebpayVoucher />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />

        {/* MODAL LOGIN/REGISTER */}
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
        />
      </div>
    </AppErrorBoundary>
  )
}