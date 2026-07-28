import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Tags, Trash2 } from "lucide-react";
import { apiService } from "../services/apiService";
import {
  CrudEmpty,
  CrudHeader,
  CrudLoading,
  CrudNotice,
  FormActions,
} from "./AdminCrudUI";

export const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargarCategorias = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setCategorias(await apiService.getCategorias());
    } catch (err) {
      setError(err.message || "No se pudieron cargar las categorías.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const cargaInicial = window.setTimeout(cargarCategorias, 0);
    return () => window.clearTimeout(cargaInicial);
  }, [cargarCategorias]);

  const categoriasFiltradas = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();
    return termino
      ? categorias.filter((categoria) =>
          categoria.nombre?.toLowerCase().includes(termino)
        )
      : categorias;
  }, [busqueda, categorias]);

  const abrirNuevo = () => {
    setEditando(null);
    setNombre("");
    setMostrarFormulario(true);
    setError("");
    setExito("");
  };

  const abrirEdicion = (categoria) => {
    setEditando(categoria);
    setNombre(categoria.nombre || "");
    setMostrarFormulario(true);
    setError("");
    setExito("");
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(null);
    setNombre("");
  };

  const guardar = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError("");
    setExito("");
    try {
      if (editando) {
        await apiService.actualizarCategoria(editando.id, {
          nombre: nombre.trim(),
        });
        setExito("Categoría actualizada correctamente.");
      } else {
        await apiService.crearCategoria({ nombre: nombre.trim() });
        setExito("Categoría creada correctamente.");
      }
      cerrarFormulario();
      await cargarCategorias();
    } catch (err) {
      setError(err.message || "No se pudo guardar la categoría.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (categoria) => {
    if (!window.confirm(`¿Deseas eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }
    setError("");
    setExito("");
    try {
      await apiService.eliminarCategoria(categoria.id);
      setExito("Categoría eliminada correctamente.");
      await cargarCategorias();
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
        icon={Tags}
        title="Categorías"
        description="Organiza el catálogo en grupos fáciles de explorar."
        onCreate={abrirNuevo}
        createLabel="Nueva categoría"
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
            {editando ? "Editar categoría" : "Registrar categoría"}
          </h3>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-slate-700">Nombre</span>
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
              className="w-full p-3 rounded-xl border border-slate-300"
              placeholder="Ej. Electrónicos"
            />
          </label>
          <FormActions
            editing={Boolean(editando)}
            saving={guardando}
            onCancel={cerrarFormulario}
          />
        </form>
      )}

      {cargando ? (
        <CrudLoading label="Cargando categorías..." />
      ) : categoriasFiltradas.length === 0 ? (
        <CrudEmpty label="Registra una categoría o cambia la búsqueda." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriasFiltradas.map((categoria) => (
            <article
              key={categoria.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4 text-left"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-violet-500 uppercase">
                  ID {categoria.id}
                </p>
                <h3 className="font-extrabold text-slate-900 truncate">
                  {categoria.nombre}
                </h3>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => abrirEdicion(categoria)}
                  className="p-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100"
                  aria-label={`Editar ${categoria.nombre}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => eliminar(categoria)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  aria-label={`Eliminar ${categoria.nombre}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
