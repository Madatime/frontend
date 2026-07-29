import {
  UserRound,
  ShoppingBag,
  ListOrdered,
  User,
  ArrowRight,
  PackageCheck,
  Clock3
} from "lucide-react";

export const ClienteDashboard = ({
  user,
  setVistaActual
}) => {

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Encabezado principal */}
        <section
          className="relative overflow-hidden rounded-3xl
          bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500
          text-white shadow-xl mb-8"
        >
          {/* Elementos decorativos */}
          <div
            className="absolute -top-20 -right-16
            w-72 h-72 bg-white/10 rounded-full"
          />

          <div
            className="absolute -bottom-28 right-32
            w-64 h-64 bg-purple-200/20 rounded-full"
          />

          <div className="relative px-8 py-10 md:px-12 md:py-12">

            <div
              className="flex items-center gap-3
              text-violet-100 font-bold uppercase
              tracking-widest text-sm mb-7"
            >
              <UserRound className="w-6 h-6" />
              Área de {user?.nombre || "Cliente"}
            </div>

            <div className="text-center">

              <h1 className="text-3xl md:text-5xl font-extrabold mb-5">
                ¡Bienvenido, {user?.nombre || "Cliente"}!
              </h1>

              <p className="text-violet-100 text-base md:text-lg">
                Consulta tus compras, administra tu cuenta y descubre
                nuevos productos.
              </p>

              <p className="text-purple-100 text-sm mt-3">
                Cuenta activa:{" "}
                <span className="font-bold">
                  {user?.username}
                </span>
              </p>

            </div>
          </div>
        </section>

        {/* Resumen */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2
          gap-5 mb-9"
        >

          <div
            className="bg-white rounded-2xl p-5
            border border-violet-100 shadow-sm
            flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl
              bg-violet-100 text-violet-700
              flex items-center justify-center"
            >
              <PackageCheck className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Compras realizadas
              </p>

              <p className="text-2xl font-bold text-gray-900">
                0
              </p>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-5
            border border-violet-100 shadow-sm
            flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl
              bg-violet-100 text-violet-700
              flex items-center justify-center"
            >
              <Clock3 className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Pedidos pendientes
              </p>

              <p className="text-2xl font-bold text-gray-900">
                0
              </p>
            </div>
          </div>

        </section>

        {/* Accesos principales */}
        <section
          className="grid grid-cols-1 md:grid-cols-2
          lg:grid-cols-3 gap-6"
        >

          {/* Catálogo */}
          <button
            type="button"
            onClick={() => setVistaActual("catalogo")}
            className="group text-left bg-white rounded-3xl p-7
            border border-violet-100 shadow-md
            hover:shadow-xl hover:-translate-y-1
            transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl
              bg-violet-100 text-violet-700
              flex items-center justify-center mb-5
              group-hover:bg-violet-600
              group-hover:text-white transition-colors"
            >
              <ShoppingBag className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Explorar catálogo
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Consulta todos los productos disponibles y encuentra nuevas
              ofertas.
            </p>

            <div
              className="flex items-center gap-2
              text-violet-700 font-bold"
            >
              Ir al catálogo
              <ArrowRight
                className="w-5 h-5
                group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>

          {/* Mis compras */}
          <button
            type="button"
            onClick={() => setVistaActual("miscompras")}
            className="group text-left bg-white rounded-3xl p-7
            border border-violet-100 shadow-md
            hover:shadow-xl hover:-translate-y-1
            transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl
              bg-violet-100 text-violet-700
              flex items-center justify-center mb-5
              group-hover:bg-violet-600
              group-hover:text-white transition-colors"
            >
              <ListOrdered className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Mis compras
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Revisa tus pedidos, el estado de las compras y el historial.
            </p>

            <div
              className="flex items-center gap-2
              text-violet-700 font-bold"
            >
              Ver compras
              <ArrowRight
                className="w-5 h-5
                group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>

          {/* Información */}
          <button
            type="button"
            onClick={() => setVistaActual("perfil")}
            className="group text-left bg-white rounded-3xl p-7
            border border-purple-100 shadow-md
            hover:shadow-xl hover:-translate-y-1
            transition-all duration-300"
          >
            <div
              className="w-14 h-14 rounded-2xl
              bg-purple-100 text-purple-700
              flex items-center justify-center mb-5
              group-hover:bg-purple-600
              group-hover:text-white transition-colors"
            >
              <User className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Mi información
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Consulta tu nombre, correo, teléfono, dirección y rol.
            </p>

            <div
              className="flex items-center gap-2
              text-purple-700 font-bold"
            >
              Ver información
              <ArrowRight
                className="w-5 h-5
                group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>

        </section>
      </div>
    </div>
  );
};
