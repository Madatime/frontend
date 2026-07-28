import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Package, Pencil, Trash2 } from "lucide-react";
import { apiService } from "../services/apiService";
import {
  CrudEmpty,
  CrudHeader,
  CrudLoading,
  CrudNotice,
  FormActions,
} from "./AdminCrudUI";

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagenUrl: "",
  categoriaId: "",
  proveedorId: "",
};

export const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
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
      const [datosProductos, datosCategorias, datosProveedores] =
        await Promise.all([
          apiService.getProductos(),
          apiService.getCategorias(),
          apiService.getProveedores(),
        ]);
      setProductos(datosProductos);
      setCategorias(datosCategorias);
      setProveedores(datosProveedores);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const cargaInicial = window.setTimeout(cargarDatos, 0);
    return () => window.clearTimeout(cargaInicial);
  }, [cargarDatos]);

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return productos;
    return productos.filter((producto) =>
      [producto.nombre, producto.descripcion, producto.categoria?.nombre]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [busqueda, productos]);

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario(formularioInicial);
    setError("");
    setExito("");
    setMostrarFormulario(true);
  };

  const abrirEdicion = (producto) => {
    setEditando(producto);
    setFormulario({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio ?? "",
      stock: producto.stock ?? "",
      imagenUrl: producto.imagenUrl || "",
      categoriaId: producto.categoria?.id?.toString() || "",
      proveedorId: producto.proveedor?.id?.toString() || "",
    });
    setError("");
    setExito("");
    setMostrarFormulario(true);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError("");
    setExito("");

    const payload = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      imagenUrl: formulario.imagenUrl.trim() || null,
      categoria: formulario.categoriaId
        ? { id: Number(formulario.categoriaId) }
        : null,
      proveedor: formulario.proveedorId
        ? { id: Number(formulario.proveedorId) }
        : null,
    };

    try {
      if (editando) {
        await apiService.actualizarProducto(editando.id, payload);
        setExito("Producto actualizado correctamente.");
      } else {
        await apiService.crearProducto(payload);
        setExito("Producto creado correctamente.");
      }
      cerrarFormulario();
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (producto) => {
    if (!window.confirm(`¿Deseas eliminar "${producto.nombre}"?`)) return;
    setError("");
    setExito("");
    try {
      await apiService.eliminarProducto(producto.id);
      setExito("Producto eliminado correctamente.");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto.");
    }
  };

  return (
    <section>
      <CrudHeader
        icon={Package}
        title="Productos"
        description="Alta, consulta, edición y eliminación de artículos del catálogo."
        onCreate={abrirNuevo}
        createLabel="Nuevo producto"
        search={busqueda}
        onSearch={setBusqueda}
      />

      <CrudNotice error={error} success={exito} />

      {mostrarFormulario && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-violet-200 shadow-md p-6 mb-6 text-left"
        >
          <h3 className="text-xl font-extrabold text-slate-900 mb-5">
            {editando ? "Editar producto" : "Registrar producto"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Nombre</span>
              <input
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">URL de imagen</span>
              <input
                name="imagenUrl"
                type="url"
                value={formulario.imagenUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Precio</span>
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={formulario.precio}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Existencias</span>
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formulario.stock}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Categoría</span>
              <select
                name="categoriaId"
                value={formulario.categoriaId}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300"
              >
                <option value="">Sin categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Proveedor</span>
              <select
                name="proveedorId"
                value={formulario.proveedorId}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300"
              >
                <option value="">Sin proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="md:col-span-2 space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Descripción</span>
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleChange}
                maxLength={500}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 resize-y"
              />
            </label>
          </div>
          <FormActions
            editing={Boolean(editando)}
            saving={guardando}
            onCancel={cerrarFormulario}
          />
        </form>
      )}

      {cargando ? (
        <CrudLoading label="Cargando productos..." />
      ) : productosFiltrados.length === 0 ? (
        <CrudEmpty label="Registra un producto o cambia el término de búsqueda." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-violet-50 text-violet-900 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-4">Producto</th>
                  <th className="px-5 py-4">Categoría</th>
                  <th className="px-5 py-4">Proveedor</th>
                  <th className="px-5 py-4">Precio</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="hover:bg-violet-50/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-56">
                        {producto.imagenUrl ? (
                          <img
                            src={producto.imagenUrl}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover bg-slate-100"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                            <Image className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{producto.nombre}</p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-72">
                            {producto.descripcion || "Sin descripción"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {producto.categoria?.nombre || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {producto.proveedor?.nombre || "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      ${Number(producto.precio).toLocaleString("es-MX")}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold">{producto.stock}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => abrirEdicion(producto)}
                          className="p-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100"
                          aria-label={`Editar ${producto.nombre}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminar(producto)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          aria-label={`Eliminar ${producto.nombre}`}
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
