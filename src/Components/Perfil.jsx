import { useEffect, useState } from "react";
import { apiService } from "../services/apiService";

const formularioInicial = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  password: "",
};

export const Perfil = ({
  onLogout,
  user,
  setVistaActual,
  onUserUpdate,
}) => {
  const username = user?.username || "marcedaniel";
  const rol = user?.rol || "ROLE_CLIENTE";
  const esCliente = rol === "ROLE_CLIENTE";
  const [formulario, setFormulario] = useState({
    ...formularioInicial,
    nombre: user?.nombre || "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      setCargando(true);
      setError("");
      try {
        const perfil = esCliente
          ? await apiService.getPerfilCliente()
          : await apiService.getPerfilAdministrador();
        if (activo) {
          setFormulario({
            nombre: perfil.nombre || "",
            email: perfil.email || "",
            telefono: perfil.telefono || "",
            direccion: perfil.direccion || "",
            password: "",
          });
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "No se pudo cargar la información del perfil.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarPerfil();

    return () => {
      activo = false;
    };
  }, [esCliente]);

  const nombre =
    formulario.nombre || user?.nombre || user?.username || "Marce Daniel";

  const nombreRol =
    rol === "ROLE_ADMIN"
      ? "Administrador"
      : "Cliente";

  const iniciales = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
    setError("");
    setExito("");
  };

  const guardarCambios = async (event) => {
    event.preventDefault();

    setGuardando(true);
    setError("");
    setExito("");

    try {
      const datosPerfil = {
        nombre: formulario.nombre.trim(),
        email: formulario.email.trim(),
        telefono: formulario.telefono.trim(),
        direccion: formulario.direccion.trim(),
      };
      const perfilActualizado = esCliente
        ? await apiService.actualizarPerfilCliente(datosPerfil)
        : await apiService.actualizarPerfilAdministrador({
            ...datosPerfil,
            password: formulario.password,
          });

      setFormulario({
        nombre: perfilActualizado.nombre || "",
        email: perfilActualizado.email || "",
        telefono: perfilActualizado.telefono || "",
        direccion: perfilActualizado.direccion || "",
        password: "",
      });
      localStorage.setItem("nombre", perfilActualizado.nombre || username);
      onUserUpdate?.({ nombre: perfilActualizado.nombre || username });
      setExito("Información actualizada correctamente.");
    } catch (err) {
      setError(err.message || "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-violet-700 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white">
            {iniciales}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold">
              {nombre}
            </h1>

            <p className="text-violet-100 mt-2">
              Bienvenido a tu perfil.
            </p>

            <span className="inline-block mt-4 px-4 py-2 rounded-full bg-white text-violet-700 font-semibold">
              {nombreRol}
            </span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Información */}
        <form
          onSubmit={guardarCambios}
          className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6"
        >
          <h2 className="text-2xl font-bold mb-6">
            Información personal
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Nombre
              </label>

              <input
                type="text"
                name="nombre"
                className="w-full border rounded-xl p-3 bg-gray-50"
                value={formulario.nombre}
                onChange={handleChange}
                disabled={cargando || guardando}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Usuario
              </label>

              <input
                type="text"
                className="w-full border rounded-xl p-3 bg-gray-50"
                value={username}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Correo
              </label>

              <input
                type="email"
                name="email"
                className="w-full border rounded-xl p-3 bg-gray-50"
                value={formulario.email}
                onChange={handleChange}
                disabled={cargando || guardando}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Teléfono
              </label>

              <input
                type="text"
                name="telefono"
                className="w-full border rounded-xl p-3 bg-gray-50"
                value={formulario.telefono}
                onChange={handleChange}
                disabled={cargando || guardando}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Dirección
              </label>

              <input
                type="text"
                name="direccion"
                className="w-full border rounded-xl p-3 bg-gray-50"
                value={formulario.direccion}
                onChange={handleChange}
                disabled={cargando || guardando}
              />
            </div>

            {!esCliente && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Nueva contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  minLength={6}
                  className="w-full border rounded-xl p-3 bg-gray-50"
                  value={formulario.password}
                  onChange={handleChange}
                  disabled={cargando || guardando}
                  placeholder="Déjala vacía para conservar la contraseña actual"
                />
              </div>
            )}
          </div>

          {error && (
            <p className="mt-5 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {exito && (
            <p className="mt-5 text-sm font-medium text-green-600">
              {exito}
            </p>
          )}

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={cargando || guardando}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>

        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Cuenta
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Rol
                </span>

                <span className="font-semibold">
                  {nombreRol}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Estado
                </span>

                <span className="text-green-600 font-semibold">
                  Activa
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Accesos rápidos
            </h2>

            <button
              type="button"
              onClick={() => setVistaActual?.("catalogo")}
              className="w-full mb-3 bg-violet-50 hover:bg-violet-100 rounded-xl py-3 font-medium"
            >
              Catálogo
            </button>

            {rol === "ROLE_CLIENTE" && (
              <button
                type="button"
                onClick={() =>
                  setVistaActual?.("mis-compras")
                }
                className="w-full mb-3 bg-violet-50 hover:bg-violet-100 rounded-xl py-3 font-medium"
              >
                Mis compras
              </button>
            )}

            {rol === "ROLE_ADMIN" && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setVistaActual?.("admin-dashboard")
                  }
                  className="w-full mb-3 bg-violet-50 hover:bg-violet-100 rounded-xl py-3 font-medium"
                >
                  Panel administrativo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setVistaActual?.("admin-panel")
                  }
                  className="w-full mb-3 bg-violet-50 hover:bg-violet-100 rounded-xl py-3 font-medium"
                >
                  Gestionar productos
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-xl py-3 font-semibold transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
