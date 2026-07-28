import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, Pencil, Phone, Trash2, Truck } from "lucide-react";
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
  contacto: "",
  email: "",
  telefono: "",
};

export const ProveedoresAdmin = () => {
  const [proveedores, setProveedores] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editando, setEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargarProveedores = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setProveedores(await apiService.getProveedores());
    } catch (err) {
      setError(err.message || "No se pudieron cargar los proveedores.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const cargaInicial = window.setTimeout(cargarProveedores, 0);
    return () => window.clearTimeout(cargaInicial);
  }, [cargarProveedores]);

  const proveedoresFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return proveedores;
    return proveedores.filter((proveedor) =>
      [proveedor.nombre, proveedor.contacto, proveedor.email]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [busqueda, proveedores]);

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario(formularioInicial);
    setMostrarFormulario(true);
    setError("");
    setExito("");
  };

  const abrirEdicion = (proveedor) => {
    setEditando(proveedor);
    setFormulario({
      nombre: proveedor.nombre || "",
      contacto: proveedor.contacto || "",
      email: proveedor.email || "",
      telefono: proveedor.telefono || "",
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
    const payload = {
      nombre: formulario.nombre.trim(),
      contacto: formulario.contacto.trim(),
      email: formulario.email.trim(),
      telefono: formulario.telefono.trim(),
    };

    try {
      if (editando) {
        await apiService.actualizarProveedor(editando.id, payload);
        setExito("Proveedor actualizado correctamente.");
      } else {
        await apiService.crearProveedor(payload);
        setExito("Proveedor creado correctamente.");
      }
      cerrarFormulario();
      await cargarProveedores();
    } catch (err) {
      setError(err.message || "No se pudo guardar el proveedor.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (proveedor) => {
    if (!window.confirm(`¿Deseas eliminar al proveedor "${proveedor.nombre}"?`)) {
      return;
    }
    setError("");
    setExito("");
    try {
      await apiService.eliminarProveedor(proveedor.id);
      setExito("Proveedor eliminado correctamente.");
      await cargarProveedores();
    } catch (err) {
      setError(
        err.message ||
          "No se pudo eliminar. Verifica que no tenga productos asociados."
      );
    }
  };

  return (
    <section>
      <CrudHeader
        icon={Truck}
        title="Proveedores"
        description="Administra los datos de contacto de quienes abastecen el catálogo."
        onCreate={abrirNuevo}
        createLabel="Nuevo proveedor"
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
            {editando ? "Editar proveedor" : "Registrar proveedor"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["nombre", "Nombre o empresa", "text"],
              ["contacto", "Persona de contacto", "text"],
              ["email", "Correo electrónico", "email"],
              ["telefono", "Teléfono", "tel"],
            ].map(([name, label, type]) => (
              <label key={name} className="space-y-1.5">
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <input
                  name={name}
                  type={type}
                  value={formulario[name]}
                  onChange={handleChange}
                  required={name === "nombre"}
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </label>
            ))}
          </div>
          <FormActions
            editing={Boolean(editando)}
            saving={guardando}
            onCancel={cerrarFormulario}
          />
        </form>
      )}

      {cargando ? (
        <CrudLoading label="Cargando proveedores..." />
      ) : proveedoresFiltrados.length === 0 ? (
        <CrudEmpty label="Registra un proveedor o cambia la búsqueda." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {proveedoresFiltrados.map((proveedor) => (
            <article
              key={proveedor.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEdicion(proveedor)}
                    className="p-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100"
                    aria-label={`Editar ${proveedor.nombre}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(proveedor)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    aria-label={`Eliminar ${proveedor.nombre}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-4">
                {proveedor.nombre}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {proveedor.contacto || "Sin contacto registrado"}
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-500" />
                  {proveedor.email || "Sin correo"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-violet-500" />
                  {proveedor.telefono || "Sin teléfono"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
