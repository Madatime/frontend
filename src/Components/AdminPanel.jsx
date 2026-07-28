import {
  ArrowLeft,
  ClipboardList,
  ListChecks,
  Package,
  Tags,
  Truck,
  Users,
} from "lucide-react";
import { ProductosAdmin } from "./ProductosAdmin";
import { CategoriasAdmin } from "./CategoriasAdmin";
import { ProveedoresAdmin } from "./ProveedoresAdmin";
import { ClientesAdmin } from "./ClientesAdmin";
import { VentasAdmin } from "./VentasAdmin";
import { DetallesVentaAdmin } from "./DetallesVentaAdmin";

const secciones = [
  { id: "productos", nombre: "Productos", icono: Package },
  { id: "categorias", nombre: "Categorías", icono: Tags },
  { id: "proveedores", nombre: "Proveedores", icono: Truck },
  { id: "clientes", nombre: "Clientes", icono: Users },
  { id: "ventas", nombre: "Ventas", icono: ClipboardList },
  { id: "detalles", nombre: "Detalles", icono: ListChecks },
];

export const AdminPanel = ({
  user,
  adminSubTab,
  setAdminSubTab,
  setVistaActual,
}) => {
  const renderSeccion = () => {
    switch (adminSubTab) {
      case "categorias":
        return <CategoriasAdmin />;
      case "proveedores":
        return <ProveedoresAdmin />;
      case "clientes":
        return <ClientesAdmin />;
      case "ventas":
        return <VentasAdmin />;
      case "detalles":
        return <DetallesVentaAdmin />;
      case "productos":
      default:
        return <ProductosAdmin />;
    }
  };

  if (user?.rol !== "ROLE_ADMIN") {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white border border-red-200 rounded-3xl p-8 text-center shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Acceso restringido
        </h1>
        <p className="text-slate-500 mt-2">
          Esta sección está disponible únicamente para administradores.
        </p>
        <button
          type="button"
          onClick={() => setVistaActual("catalogo")}
          className="mt-6 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="rounded-3xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 text-white shadow-xl p-7 sm:p-9 mb-7">
          <button
            type="button"
            onClick={() => setVistaActual("admin-dashboard")}
            className="inline-flex items-center gap-2 text-sm font-bold text-violet-50 hover:text-white mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al panel
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Administración de la tienda
          </h1>
          <p className="text-violet-100 mt-2">
            Gestiona la información registrada usando los módulos existentes del backend.
          </p>
        </section>

        <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-2 mb-7 overflow-x-auto">
          <div className="flex min-w-max gap-1">
            {secciones.map(({ id, nombre, icono: Icono }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAdminSubTab(id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  adminSubTab === id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <Icono className="w-4 h-4" />
                {nombre}
              </button>
            ))}
          </div>
        </div>

        {renderSeccion()}
      </div>
    </div>
  );
};
