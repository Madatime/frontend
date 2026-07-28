import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Users,
  Truck,
  ArrowRight,
  ListChecks
} from "lucide-react";

export const AdminDashboard = ({
  user,
  setVistaActual,
  setAdminSubTab
}) => {

  const irASeccion = (seccion) => {
    if (setAdminSubTab) {
      setAdminSubTab(seccion);
    }

    setVistaActual("admin-panel");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Encabezado */}
        <section
          className="relative overflow-hidden rounded-3xl
          bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500
          text-white shadow-xl mb-10"
        >
          {/* Decoración */}
          <div
            className="absolute -top-20 -right-16 w-72 h-72
            bg-white/10 rounded-full"
          />

          <div
            className="absolute -bottom-24 right-36 w-56 h-56
            bg-purple-200/20 rounded-full"
          />

          <div className="relative px-8 py-10 md:px-12 md:py-12">
            <div
              className="flex items-center gap-3 text-purple-50
              font-bold uppercase tracking-widest text-sm mb-7"
            >
              <LayoutDashboard className="w-6 h-6" />
              Área privada
            </div>

            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-5">
                Panel de administración
              </h1>

              <p className="text-purple-50 text-base md:text-lg">
                Sesión de administrador:{" "}
                <span className="font-bold">
                  {user?.nombre || user?.username || "Administrador"}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Opciones principales */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Productos */}
          <button
            type="button"
            onClick={() => irASeccion("productos")}
            className="group text-left bg-white rounded-3xl p-7
            border border-purple-100 shadow-md hover:shadow-xl
            hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-purple-100
              text-purple-700 flex items-center justify-center mb-5
              group-hover:bg-purple-600 group-hover:text-white
              transition-colors"
            >
              <Package className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Productos
            </h2>

            <p className="text-slate-600 leading-relaxed mb-5">
              Consulta, registra, actualiza y elimina los productos del catálogo.
            </p>

            <div className="flex items-center gap-2 text-purple-700 font-bold">
              Administrar productos
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1
                transition-transform"
              />
            </div>
          </button>

          {/* Categorías */}
          <button
            type="button"
            onClick={() => irASeccion("categorias")}
            className="group text-left bg-white rounded-3xl p-7
            border border-purple-100 shadow-md hover:shadow-xl
            hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-purple-100
              text-purple-700 flex items-center justify-center mb-5
              group-hover:bg-purple-600 group-hover:text-white
              transition-colors"
            >
              <Tags className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Categorías
            </h2>

            <p className="text-slate-600 leading-relaxed mb-5">
              Organiza los productos por categoría y administra su información.
            </p>

            <div className="flex items-center gap-2 text-purple-700 font-bold">
              Administrar categorías
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1
                transition-transform"
              />
            </div>
          </button>

          {/* Ventas */}
          <button
            type="button"
            onClick={() => irASeccion("ventas")}
            className="group text-left bg-white rounded-3xl p-7
            border border-violet-100 shadow-md hover:shadow-xl
            hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-violet-100
              text-violet-700 flex items-center justify-center mb-5
              group-hover:bg-violet-600 group-hover:text-white
              transition-colors"
            >
              <ClipboardList className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Ventas
            </h2>

            <p className="text-slate-600 leading-relaxed mb-5">
              Registra, consulta, actualiza y elimina las ventas de la tienda.
            </p>

            <div className="flex items-center gap-2 text-violet-700 font-bold">
              Consultar ventas
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1
                transition-transform"
              />
            </div>
          </button>

          {/* Clientes */}
          <button
            type="button"
            onClick={() => irASeccion("clientes")}
            className="group text-left bg-white rounded-3xl p-7
            border border-fuchsia-100 shadow-md hover:shadow-xl
            hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-fuchsia-100
              text-fuchsia-700 flex items-center justify-center mb-5
              group-hover:bg-fuchsia-600 group-hover:text-white
              transition-colors"
            >
              <Users className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Clientes
            </h2>

            <p className="text-slate-600 leading-relaxed mb-5">
              Administra la información de los clientes registrados.
            </p>

            <div className="flex items-center gap-2 text-fuchsia-700 font-bold">
              Consultar clientes
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1
                transition-transform"
              />
            </div>
          </button>

          {/* Proveedores */}
          <button
            type="button"
            onClick={() => irASeccion("proveedores")}
            className="group text-left bg-white rounded-3xl p-7
            border border-purple-100 shadow-md hover:shadow-xl
            hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-purple-100
              text-purple-700 flex items-center justify-center mb-5
              group-hover:bg-purple-600 group-hover:text-white
              transition-colors"
            >
              <Truck className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Proveedores
            </h2>

            <p className="text-slate-600 leading-relaxed mb-5">
              Administra los proveedores relacionados con los productos.
            </p>

            <div className="flex items-center gap-2 text-purple-700 font-bold">
              Administrar proveedores
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1
                transition-transform"
              />
            </div>
          </button>

          {/* Detalles de venta */}
          <button
            type="button"
            onClick={() => irASeccion("detalles")}
            className="group text-left bg-white rounded-3xl p-7
            border border-violet-100 shadow-md hover:shadow-xl
            hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl bg-violet-100
              text-violet-700 flex items-center justify-center mb-5
              group-hover:bg-violet-600 group-hover:text-white
              transition-colors"
            >
              <ListChecks className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Detalles de venta
            </h2>

            <p className="text-slate-600 leading-relaxed mb-5">
              Gestiona productos, cantidades y subtotales asociados a cada venta.
            </p>

            <div className="flex items-center gap-2 text-violet-700 font-bold">
              Administrar detalles
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1
                transition-transform"
              />
            </div>
          </button>

        </section>
      </div>
    </div>
  );
};
