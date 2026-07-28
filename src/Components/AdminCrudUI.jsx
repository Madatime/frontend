import { AlertCircle, Loader2, Plus, Search } from "lucide-react";

export const CrudHeader = ({
  icon: Icon,
  title,
  description,
  onCreate,
  createLabel,
  search,
  onSearch,
}) => (
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
      <div className="flex items-start gap-4 text-left">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Buscar..."
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {createLabel}
        </button>
      </div>
    </div>
  </div>
);

export const CrudNotice = ({ error, success }) => {
  if (!error && !success) {
    return null;
  }

  return (
    <div
      className={`mb-5 p-4 rounded-xl border text-sm text-left ${
        error
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}
    >
      <div className="flex items-start gap-2">
        {error && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
        <span>{error || success}</span>
      </div>
    </div>
  );
};

export const CrudLoading = ({ label = "Cargando registros..." }) => (
  <div className="bg-white rounded-3xl border border-slate-200 p-14 flex flex-col items-center justify-center text-slate-500">
    <Loader2 className="w-9 h-9 text-violet-600 animate-spin mb-3" />
    <p className="font-semibold">{label}</p>
  </div>
);

export const CrudEmpty = ({ label }) => (
  <div className="bg-white rounded-3xl border border-dashed border-violet-200 p-12 text-center">
    <p className="font-bold text-slate-800">No hay registros para mostrar</p>
    <p className="text-sm text-slate-500 mt-1">{label}</p>
  </div>
);

export const FormActions = ({ editing, saving, onCancel }) => (
  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
    <button
      type="button"
      onClick={onCancel}
      disabled={saving}
      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
    >
      Cancelar
    </button>
    <button
      type="submit"
      disabled={saving}
      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
    >
      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
      {editing ? "Guardar cambios" : "Crear registro"}
    </button>
  </div>
);
