import { useCallback, useEffect, useMemo, useState } from "react";
import { ListChecks, Pencil, Trash2 } from "lucide-react";
import { apiService } from "../services/apiService";
import {
  CrudEmpty,
  CrudHeader,
  CrudLoading,
  CrudNotice,
  FormActions,
} from "./AdminCrudUI";

const formularioInicial = {
  ventaId: "",
  productoId: "",
  cantidad: "1",
  precioUnitario: "",
};

export const DetallesVentaAdmin = () => {
  const [detalles, setDetalles] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editando, setEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const [datosDetalles, datosVentas, datosProductos] = await Promise.all([
        apiService.getDetalleVentas(),
        apiService.getVentas(),
        apiService.getProductos(),
      ]);
      setDetalles(datosDetalles);
      setVentas(datosVentas);
      setProductos(datosProductos);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los detalles de venta.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const cargaInicial = window.setTimeout(cargarDatos, 0);
    return () => window.clearTimeout(cargaInicial);
  }, [cargarDatos]);

  const detallesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return detalles;
    return detalles.filter((detalle) =>
      [
        detalle.id?.toString(),
        detalle.venta?.id?.toString(),
        detalle.producto?.nombre,
      ]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [busqueda, detalles]);

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario(formularioInicial);
    setMostrarFormulario(true);
    setError("");
    setExito("");
  };

  const abrirEdicion = (detalle) => {
    setEditando(detalle);
    setFormulario({
      ventaId: detalle.venta?.id?.toString() || "",
      productoId: detalle.producto?.id?.toString() || "",
      cantidad: detalle.cantidad?.toString() || "1",
      precioUnitario: detalle.precioUnitario?.toString() || "",
    });
    setMostrarFormulario(true);
    setError("");
    setExito("");
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(null);
    setFormulario(formularioInicial);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((actual) => {
      const siguiente = { ...actual, [name]: value };
      if (name === "productoId" && !editando) {
        const producto = productos.find(
          (item) => item.id === Number(value)
        );
        siguiente.precioUnitario = producto?.precio?.toString() || "";
      }
      return siguiente;
    });
  };

  const guardar = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError("");
    setExito("");

    const cantidad = Number(formulario.cantidad);
    const precioUnitario = Number(formulario.precioUnitario);
    const payload = {
      cantidad,
      precioUnitario,
      subtotal: cantidad * precioUnitario,
      venta: { id: Number(formulario.ventaId) },
      producto: { id: Number(formulario.productoId) },
    };

    try {
      if (editando) {
        await apiService.actualizarDetalleVenta(editando.id, payload);
        setExito("Detalle actualizado correctamente.");
      } else {
        await apiService.crearDetalleVenta(payload);
        setExito("Detalle creado correctamente.");
      }
      cerrarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo guardar el detalle de venta.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (detalle) => {
    if (!window.confirm(`¿Deseas eliminar el detalle #${detalle.id}?`)) return;
    setError("");
    setExito("");
    try {
      await apiService.eliminarDetalleVenta(detalle.id);
      setExito("Detalle eliminado correctamente.");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el detalle de venta.");
    }
  };

  return (
    <section>
      <CrudHeader
        icon={ListChecks}
        title="Detalles de venta"
        description="Gestiona las líneas que relacionan ventas, productos, cantidades y subtotales."
        onCreate={abrirNuevo}
        createLabel="Nuevo detalle"
        search={busqueda}
        onSearch={setBusqueda}
      />
      <CrudNotice error={error} success={exito} />

      {mostrarFormulario && (
        <form
          onSubmit={guardar}
          className="bg-white rounded-3xl border border-violet-200 shadow-md p-6 mb-6 text-left"
        >
          <h3 className="text-xl font-extrabold text-slate-900 mb-5">
            {editando ? "Editar detalle" : "Registrar detalle"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Venta</span>
              <select
                name="ventaId"
                value={formulario.ventaId}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              >
                <option value="">Selecciona una venta</option>
                {ventas.map((venta) => (
                  <option key={venta.id} value={venta.id}>
                    Venta #{venta.id} — ${Number(venta.total || 0).toFixed(2)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Producto</span>
              <select
                name="productoId"
                value={formulario.productoId}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              >
                <option value="">Selecciona un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Cantidad</span>
              <input
                name="cantidad"
                type="number"
                min="1"
                step="1"
                value={formulario.cantidad}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Precio unitario</span>
              <input
                name="precioUnitario"
                type="number"
                min="0"
                step="0.01"
                value={formulario.precioUnitario}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
          </div>
          <p className="text-sm text-violet-700 font-bold mt-4">
            Subtotal calculado: $
            {(
              Number(formulario.cantidad || 0) *
              Number(formulario.precioUnitario || 0)
            ).toFixed(2)}
          </p>
          <FormActions
            editing={Boolean(editando)}
            saving={guardando}
            onCancel={cerrarFormulario}
          />
        </form>
      )}

      {cargando ? (
        <CrudLoading label="Cargando detalles..." />
      ) : detallesFiltrados.length === 0 ? (
        <CrudEmpty label="No hay detalles registrados con ese criterio." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-violet-50 text-violet-900 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Venta</th>
                  <th className="px-5 py-4">Producto</th>
                  <th className="px-5 py-4">Cantidad</th>
                  <th className="px-5 py-4">Precio</th>
                  <th className="px-5 py-4">Subtotal</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detallesFiltrados.map((detalle) => (
                  <tr key={detalle.id} className="hover:bg-violet-50/40">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      #{detalle.id}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      #{detalle.venta?.id || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {detalle.producto?.nombre || "Sin producto"}
                    </td>
                    <td className="px-5 py-4 text-sm">{detalle.cantidad}</td>
                    <td className="px-5 py-4 text-sm">
                      ${Number(detalle.precioUnitario || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      ${Number(detalle.subtotal || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => abrirEdicion(detalle)}
                          className="p-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100"
                          aria-label={`Editar detalle ${detalle.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminar(detalle)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          aria-label={`Eliminar detalle ${detalle.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
