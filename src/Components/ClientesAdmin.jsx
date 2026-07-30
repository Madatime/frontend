import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, MapPin, Pencil, Phone, Trash2, Users } from "lucide-react";
import { apiService } from "../services/apiService";
import {
  CrudEmpty,
  CrudHeader,
  CrudLoading,
  CrudNotice,
  FormActions,
} from "./AdminCrudUI";

const formularioInicial = {
  username: "",
  password: "",
  nombre: "",
  email: "",
  direccion: "",
  telefono: "",
  rol: "ROLE_CLIENTE",
};

export const ClientesAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editando, setEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargarClientes = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setClientes(await apiService.getClientes());
    } catch (err) {
      setError(err.message || "No se pudieron cargar los clientes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const cargaInicial = window.setTimeout(cargarClientes, 0);
    return () => window.clearTimeout(cargaInicial);
  }, [cargarClientes]);

  const clientesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return clientes;
    return clientes.filter((cliente) =>
      [cliente.nombre, cliente.email, cliente.telefono, cliente.usuario?.username]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [busqueda, clientes]);

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario(formularioInicial);
    setMostrarFormulario(true);
    setError("");
    setExito("");
  };

  const abrirEdicion = (cliente) => {
    setEditando(cliente);
    setFormulario({
      username: cliente.usuario?.username || "",
      password: "",
      nombre: cliente.nombre || "",
      email: cliente.email || "",
      direccion: cliente.direccion || "",
      telefono: cliente.telefono || "",
      rol: "ROLE_CLIENTE",
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
        await apiService.actualizarCliente(editando.id, {
          nombre: formulario.nombre.trim(),
          email: formulario.email.trim(),
          direccion: formulario.direccion.trim(),
          telefono: formulario.telefono.trim(),
          usuario: editando.usuario,
        });
        setExito("Cliente actualizado correctamente.");
      } else {
        await apiService.registrarUsuarioAdmin({
          username: formulario.username.trim(),
          password: formulario.password,
          email: formulario.email.trim(),
          nombre: formulario.nombre.trim(),
          direccion: formulario.direccion.trim(),
          telefono: formulario.telefono.trim(),
          rol: formulario.rol,
        });
        setExito(
          formulario.rol === "ROLE_ADMIN"
            ? "Administrador creado correctamente."
            : "Cliente creado correctamente."
        );
      }
      cerrarFormulario();
      await cargarClientes();
    } catch (err) {
      setError(err.message || "No se pudo guardar el cliente.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (cliente) => {
    if (!window.confirm(`¿Deseas eliminar al cliente "${cliente.nombre}"?`)) {
      return;
    }
    setError("");
    setExito("");
    try {
      await apiService.eliminarCliente(cliente.id);
      setExito("Cliente eliminado correctamente.");
      await cargarClientes();
    } catch (err) {
      setError(
        err.message ||
          "No se pudo eliminar. Verifica si el cliente tiene ventas asociadas."
      );
    }
  };

  return (
    <section>
      <CrudHeader
        icon={Users}
        title="Clientes"
        description="Consulta clientes y registra nuevas cuentas de cliente o administrador."
        onCreate={abrirNuevo}
        createLabel="Nuevo usuario"
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
            {editando ? "Editar cliente" : "Registrar usuario"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!editando && (
              <>
                <label className="space-y-1.5">
                  <span className="text-sm font-bold text-slate-700">Usuario</span>
                  <input
                    name="username"
                    value={formulario.username}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-bold text-slate-700">Contraseña</span>
                  <input
                    name="password"
                    type="password"
                    value={formulario.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </label>
                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-bold text-slate-700">
                    Tipo de cuenta
                  </span>
                  <select
                    name="rol"
                    value={formulario.rol}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="ROLE_CLIENTE">Cliente</option>
                    <option value="ROLE_ADMIN">Administrador</option>
                  </select>
                </label>
              </>
            )}
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Nombre</span>
              <input
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Correo</span>
              <input
                name="email"
                type="email"
                value={formulario.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Teléfono</span>
              <input
                name="telefono"
                type="tel"
                value={formulario.telefono}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-bold text-slate-700">Dirección</span>
              <input
                name="direccion"
                value={formulario.direccion}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300"
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
        <CrudLoading label="Cargando clientes..." />
      ) : clientesFiltrados.length === 0 ? (
        <CrudEmpty label="Registra un cliente o cambia la búsqueda." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {clientesFiltrados.map((cliente) => (
            <article
              key={cliente.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-violet-500 uppercase">
                    Cliente #{cliente.id}
                  </p>
                  <h3 className="text-lg font-extrabold text-slate-900 truncate">
                    {cliente.nombre}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Usuario: {cliente.usuario?.username || "Sin usuario"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEdicion(cliente)}
                    className="p-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100"
                    aria-label={`Editar ${cliente.nombre}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(cliente)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    aria-label={`Eliminar ${cliente.nombre}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-violet-500" />
                  {cliente.email || "Sin correo"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-violet-500" />
                  {cliente.telefono || "Sin teléfono"}
                </p>
                <p className="sm:col-span-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-violet-500" />
                  {cliente.direccion || "Sin dirección"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
