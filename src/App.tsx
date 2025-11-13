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

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#0f1316] text-stone-100">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-6 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderReceipt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ScrollTop />
    </div>
  )
}
