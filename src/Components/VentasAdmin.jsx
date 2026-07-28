import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import { apiService } from "../services/apiService";
import {
  CrudEmpty,
  CrudHeader,
  CrudLoading,
  CrudNotice,
  FormActions,
} from "./AdminCrudUI";

const formularioInicial = {
  clienteId: "",
  productoId: "",
  cantidad: "1",
  total: "",
  estadoPago: "PENDIENTE",
};

const fechaLegible = (fecha) => {
  if (!fecha) return "Sin fecha";
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime())
    ? fecha
    : valor.toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

export const VentasAdmin = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
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
      const [datosVentas, datosProductos, datosClientes] = await Promise.all([
        apiService.getVentas(),
        apiService.getProductos(),
        apiService.getClientes(),
      ]);
      setVentas(datosVentas);
      setProductos(datosProductos);
      setClientes(datosClientes);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las ventas.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const cargaInicial = window.setTimeout(cargarDatos, 0);
    return () => window.clearTimeout(cargaInicial);
  }, [cargarDatos]);

  const ventasFiltradas = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return ventas;
    return ventas.filter((venta) =>
      [
        venta.id?.toString(),
        venta.estadoPago,
        venta.cliente?.nombre,
        venta.cliente?.email,
      ]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [busqueda, ventas]);

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario(formularioInicial);
    setMostrarFormulario(true);
    setError("");
    setExito("");
  };

  const abrirEdicion = (venta) => {
    setEditando(venta);
    setFormulario({
      ...formularioInicial,
      clienteId: venta.cliente?.id?.toString() || "",
      total: venta.total ?? "",
      estadoPago: venta.estadoPago || "PENDIENTE",
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
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const guardar = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError("");
    setExito("");
    try {
      if (editando) {
        await apiService.actualizarVenta(editando.id, {
          ...editando,
          total: Number(formulario.total),
          estadoPago: formulario.estadoPago,
        });
        setExito("Venta actualizada correctamente.");
      } else {
        const payload = {
          cliente: formulario.clienteId
            ? { id: Number(formulario.clienteId) }
            : null,
          detalles: [
            {
              producto: { id: Number(formulario.productoId) },
              cantidad: Number(formulario.cantidad),
            },
          ],
        };
        await apiService.crearVenta(payload);
        setExito("Venta creada y existencias actualizadas.");
      }
      cerrarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo guardar la venta.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (venta) => {
    if (!window.confirm(`¿Deseas eliminar la venta #${venta.id}?`)) return;
    setError("");
    setExito("");
    try {
      await apiService.eliminarVenta(venta.id);
      setExito("Venta eliminada correctamente.");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la venta.");
    }
  };

  return (
    <section>
      <CrudHeader
        icon={ClipboardList}
        title="Ventas"
        description="Consulta operaciones, registra ventas manuales y actualiza su estado."
        onCreate={abrirNuevo}
        createLabel="Nueva venta"
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
            {editando ? `Editar venta #${editando.id}` : "Registrar venta manual"}
          </h3>
          {editando ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1.5">
                <span className="text-sm font-bold text-slate-700">Total</span>
                <input
                  name="total"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.total}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-bold text-slate-700">Estado de pago</span>
                <select
                  name="estadoPago"
                  value={formulario.estadoPago}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300"
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="PAGADO">PAGADO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="space-y-1.5">
                <span className="text-sm font-bold text-slate-700">Cliente</span>
                <select
                  name="clienteId"
                  value={formulario.clienteId}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300"
                >
                  <option value="">Venta sin cliente asociado</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} — {cliente.email}
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
                      {producto.nombre} — Stock {producto.stock}
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
            </div>
          )}
          <FormActions
            editing={Boolean(editando)}
            saving={guardando}
            onCancel={cerrarFormulario}
          />
        </form>
      )}

      {cargando ? (
        <CrudLoading label="Cargando ventas..." />
      ) : ventasFiltradas.length === 0 ? (
        <CrudEmpty label="No hay ventas registradas con ese criterio." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-violet-50 text-violet-900 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-4">Folio</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Cliente</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-violet-50/40">
                    <td className="px-5 py-4 font-extrabold text-slate-900">
                      #{venta.id}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {fechaLegible(venta.fecha)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {venta.cliente?.nombre || "Sin cliente"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          venta.estadoPago === "PAGADO"
                            ? "bg-green-100 text-green-700"
                            : venta.estadoPago === "CANCELADO"
                              ? "bg-red-100 text-red-700"
                              : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {venta.estadoPago || "PENDIENTE"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-extrabold text-slate-900">
                      ${Number(venta.total || 0).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => abrirEdicion(venta)}
                          className="p-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100"
                          aria-label={`Editar venta ${venta.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminar(venta)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          aria-label={`Eliminar venta ${venta.id}`}
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
