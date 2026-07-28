import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import { Catalogo } from "./components/Catalogo";
import { Navbar } from "./components/Navbar";
import { Registro } from "./components/Registro";
import { apiService } from "./services/apiService";
import { Login } from "./components/Login";
import { AdminDashboard } from "./components/AdminDashboard";
import { ClienteDashboard } from "./components/ClienteDashboard";
import { Perfil } from "./components/Perfil";
import { Cart } from "./components/Cart";
import { AdminPanel } from "./components/AdminPanel";
import { CheckoutForm } from "./components/CheckoutForm";

function App() {
  const [vistaActual, setVistaActual] = useState("catalogo");
  const [user, setUser] = useState(() =>
    apiService.isAuthenticated()
      ? {
          username: localStorage.getItem("username"),
          nombre: localStorage.getItem("nombre"),
          rol: localStorage.getItem("rol"),
        }
      : null
  );
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [ventaActiva, setVentaActiva] = useState(null);
  const [adminSubTab, setAdminSubTab] = useState("productos");
  

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLoginSuccess = (userData) => {
    setUser({
      username: userData.username,
      nombre: userData.nombre,
      rol: userData.rol,
    });

    if (userData.rol === "ROLE_ADMIN") {
    setVistaActual("admin-dashboard");
  } else if (userData.rol === "ROLE_CLIENTE") {
    setVistaActual("cliente-dashboard");
  } else {
    setVistaActual("catalogo");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setVentaActiva(null);
    setVistaActual("catalogo");
  };

  //FUNCION CARRITO DE COMPRAS
  const AddToCart = (producto) => {
    if (!producto || producto.stock <= 0) {
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.producto.id === producto.id);
      if (existing) {
        if (existing.cantidad >= producto.stock) {
          alert(
            `No puedes agregar más unidades de ${producto.nombre}. Stock disponible: ${producto.stock}.`
          );
          return prevCart;
        }

        return prevCart.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prevCart, { producto, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  //ACTUALIZAR CANTIDAD
  const updateQuantity = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removeFromCart(productoId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.producto.id === productoId) {
          if (nuevaCantidad > item.producto.stock) {
            alert(`No se puede exceder el stock disponible: ${item.producto.stock}.`);
            return item;
          }
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
    );
  };

  //REMOVER DEL CARRITO
  const removeFromCart = (productoId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.producto.id !== productoId)
    );
  };
  //LIMPIAR CARRITO
  const clearCart = () => setCart([]);
  //CONTAR PRODUCTOS DEL CARRITO

  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  //VISTA CONTENIDO PRINCIPAL
  const vistaContenido = () => {
  switch (vistaActual) {
    case "catalogo":
      return (
        <Catalogo
          setVistaActual={setVistaActual}
          user={user}
          AddToCart={AddToCart}
        />
      );  

    case "registro":
      return (
        <Registro
          onRegisterSuccess={() => setVistaActual("login")}
          onGoToLogin={() => setVistaActual("login")}
        />
      );

    case "login":
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setVistaActual("registro")}
        />
      );

    case 'checkout':
      return (
        <CheckoutForm
          ventaActiva={ventaActiva}
          setVistaActual={setVistaActual}
        />
      );

    case "admin-dashboard":
      return (
        <AdminDashboard setVistaActual={setVistaActual}
          user={user}
          AddToCart={AddToCart}
          setAdminSubTab={setAdminSubTab}
        />
      );

    case "admin-panel":
      return (
        <AdminPanel
          user={user}
          adminSubTab={adminSubTab}
          setAdminSubTab={setAdminSubTab}
          setVistaActual={setVistaActual}
        />
      );

      case "cliente-dashboard":
      return (
        <ClienteDashboard
        user={user}
        setVistaActual={setVistaActual}
        />
      );

    case "perfil":
      return (
        <Perfil
          user={user}
          onLogout={handleLogout}
          setVistaActual={setVistaActual}
        />
      );

    default:
      return (
        <Catalogo setVistaActual={setVistaActual}
          user={user}
          AddToCart={AddToCart}
        />
      );
  }
};



  return (
    <div className="app-shell min-h-screen flex flex-col text-gray-800 antialiased">
      <Navbar
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        user={user}
        onLogout={handleLogout}
        carCount={cartCount}
        openCart={() => setIsCartOpen(true)}
      />

      <main className="app-main flex-grow pb-12">{vistaContenido()}</main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        setVistaActual={setVistaActual}
        setVentaActiva={setVentaActiva}
        user={user}
      />

      <Footer />
    </div>
  );
}

export default App;
