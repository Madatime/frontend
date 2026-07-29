import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Loader2,
  PackageOpen,
  ReceiptText,
} from "lucide-react";
import { apiService } from "../services/apiService";

export const MisCompras = ({ setVistaActual, setVentaActiva }) => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarCompras = async () => {
      try {
        const data = await apiService.getMisCompras();
        if (activo) {
          setCompras(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "No se pudieron cargar tus compras.");
        }
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    cargarCompras();

    return () => {
      activo = false;
    };
  }, []);

  const abrirPago = (venta) => {
    setVentaActiva(venta);
    setVistaActual("checkout");
  };

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "Fecha no disponible";
    }

    return new Date(fecha).toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              Historial
            </p>
            <h1 className="text-3xl font-black text-gray-900 mt-1">
              Mis compras
            </h1>
            <p className="text-gray-600 mt-2">
              Consulta tus pedidos y completa los pagos que siguen pendientes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setVistaActual("cliente-dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-bold text-violet-700 hover:bg-violet-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a mi cuenta
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-3xl border border-violet-100 shadow-sm py-20 text-center">
            <Loader2 className="w-9 h-9 text-violet-600 animate-spin mx-auto" />
            <p className="text-gray-600 mt-4">Cargando tus compras...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">
            {error}
          </div>
        )}

        {!loading && !error && compras.length === 0 && (
          <div className="bg-white rounded-3xl border border-violet-100 shadow-sm py-16 px-6 text-center">
            <PackageOpen className="w-14 h-14 text-violet-300 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 mt-4">
              Todavía no tienes compras
            </h2>
            <p className="text-gray-600 mt-2">
              Cuando realices una compra aparecerá aquí junto con su estado.
            </p>
            <button
              type="button"
              onClick={() => setVistaActual("catalogo")}
              className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700 transition-colors cursor-pointer"
            >
              Explorar catálogo
            </button>
          </div>
        )}

        {!loading && !error && compras.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {compras.map((venta) => {
              const pagada = venta.estadoPago === "PAGADO";

              return (
                <article
                  key={venta.id}
                  className="bg-white rounded-3xl border border-violet-100 shadow-sm p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                        <ReceiptText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-bold text-gray-400">
                          Orden
                        </p>
                        <h2 className="text-lg font-black text-gray-900">
                          #{venta.id}
                        </h2>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        pagada
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {pagada ? "Pagada" : "Pago pendiente"}
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <CalendarDays className="w-4 h-4" />
                        Fecha
                      </span>
                      <span className="font-semibold text-gray-800 text-right">
                        {formatearFecha(venta.fecha)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="text-xl font-black text-gray-900">
                        ${(venta.total || 0).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        MXN
                      </span>
                    </div>
                  </div>

                  {!pagada && (
                    <button
                      type="button"
                      onClick={() => abrirPago(venta)}
                      className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5" />
                      Ir a la pasarela de pago
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
