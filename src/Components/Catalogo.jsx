import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Search, Filter, ShoppingCart, Info, AlertTriangle } from 'lucide-react';

export const Catalogo = ({ user, AddToCart }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carga, setCarga] = useState(true);
    const [error, setError] = useState('');

    //filtros 
    const [searchQuery, setSearchQuery] = useState('');
    const [selecionCategoria, setSelecionCategoria] = useState('Todos');

    useEffect(() => {
        const cargaDatosCatalogo = async () => {
            setCarga(true);
            try {
                const datosProductos = await apiService.getProductos();
                setProductos(datosProductos);
                const datosCategorias = await apiService.getCategorias();
                setCategorias(datosCategorias);
            } catch (err) {
                setError('Error en el servidor backend..' + err);
            } finally {
                setCarga(false);
            }
        }; 
        cargaDatosCatalogo();
    }, []);

    //AGREGAR AL CARRITO
    const handleAddToCart = (producto) => {
        if (user?.rol === 'ROLE_ADMIN') {
            alert('Los administradores no pueden agregar productos al carrito.');
            return;
        }
        AddToCart(producto);
    };

    const filtroProductos = productos.filter((producto) => {
        const busqueda =
            producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (producto.descripcion
                && producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

        const busquedaCategorias =
            selecionCategoria === 'Todos' ||
            (producto.categoria && producto.categoria.nombre === selecionCategoria);

        return busqueda && busquedaCategorias;

    });

    if (carga) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                <p className="text-gray-500 mt-4 font-medium">Cargando productos....</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 xl:px-8 2xl:px-10 py-6 sm:py-8">


            {/* Banner Principal */}
            <div className="bg-gradient-to-br from-violet-200 via-purple-100 to-fuchsia-100 rounded-3xl px-7 py-9 sm:p-10 lg:p-12 mb-6 lg:mb-8 min-h-56 flex items-center text-slate-900 border border-violet-200/80 shadow-[0_18px_45px_-25px_rgba(49,65,90,0.45)] relative overflow-hidden">
                <div className="relative z-10 max-w-2xl text-left">
                    <span className="inline-flex items-center rounded-full bg-white/60 border border-violet-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 mb-4">
                        Todo en un solo lugar
                    </span>
                    <h1 className="m-0 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Catálogo de Productos</h1>
                    <p className="mt-3 text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl">
                        Explora las mejores ofertas, productos de calidad y envíos garantizados directamente por nuestros proveedores.
                    </p>
                </div>
                <div className="absolute -right-5 sm:right-4 bottom-0 top-0 text-violet-700 opacity-10 flex items-center justify-center p-4 sm:p-8">
                    <ShoppingCart className="w-56 h-56 sm:w-72 sm:h-72" />
                </div>
            </div>

            {error && (
                <div className="bg-violet-50 text-violet-800 p-4 rounded-xl flex items-start gap-2.5 border border-violet-200 text-sm mb-6">
                    <Info className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">Aviso del Servidor:</span> {error}. Mostrando interfaz local. Asegúrate de iniciar la API en Spring Boot.
                    </div>
                </div>
            )}

            {/* Buscador y Contenido */}
            <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
                {/* Filtros Lateral (Sidebar) */}
                <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
                    {/* Tarjeta de Búsqueda */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_8px_25px_-18px_rgba(15,23,42,0.45)] space-y-3 text-left">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Search className="w-4 h-4 text-violet-500" /> Buscar Producto
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Escribe nombre o descripción..."
                                className="w-full p-3 pl-4 rounded-xl border border-gray-300 focus:outline-none text-sm text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Tarjeta de Categorías */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_8px_25px_-18px_rgba(15,23,42,0.45)] space-y-4 text-left">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Filter className="w-4 h-4 text-violet-500" /> Categorías
                        </h3>
                        <div className="flex flex-wrap lg:flex-col gap-1.5">
                            <button
                                onClick={() => setSelecionCategoria('Todos')}
                                className={`w-auto lg:w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                    selecionCategoria === 'Todos'
                                        ? 'bg-violet-50 text-violet-700 font-bold ring-1 ring-violet-100'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Todas las categorías
                            </button>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelecionCategoria(cat.nombre)}
                                    className={`w-auto lg:w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                        selecionCategoria === cat.nombre
                                            ? 'bg-violet-50 text-violet-700 font-bold ring-1 ring-violet-100'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Cuadrícula de Productos */}
                <section className="w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 text-left">
                        <div>
                            <h2 className="m-0 text-2xl font-extrabold text-slate-900">Productos</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {filtroProductos.length} {filtroProductos.length === 1 ? 'artículo encontrado' : 'artículos encontrados'}
                            </p>
                        </div>
                        {selecionCategoria !== 'Todos' && (
                            <span className="self-start sm:self-auto bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-3.5 py-1.5 text-xs font-bold">
                                {selecionCategoria}
                            </span>
                        )}
                    </div>
                    {filtroProductos.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                            <AlertTriangle className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                            <h3 className="font-bold text-lg text-gray-800">No se encontraron productos</h3>
                            <p className="text-gray-500 text-sm mt-1">Prueba a modificar los filtros o los términos de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5 xl:gap-6">
                            {filtroProductos.map((producto) => {
                                const defaultImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300";
                                const isOutOfStock = producto.stock <= 0;
                                const isAdmin = user?.rol === 'ROLE_ADMIN';

                                return (
                                    <div
                                        key={producto.id}
                                        className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.6)] overflow-hidden flex flex-col group hover:shadow-[0_18px_38px_-22px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Imagen con zoom effect */}
                                        <div className="h-52 2xl:h-56 w-full bg-gray-100 relative overflow-hidden">
                                            <img
                                                src={producto.imagenUrl || defaultImage}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                            {/* Categoría Badge */}
                                            {producto.categoria && (
                                                <span className="absolute top-3 left-3 bg-violet-700/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                                                    {producto.categoria.nombre}
                                                </span>
                                            )}
                                        </div>

                                        {/* Cuerpo */}
                                        <div className="p-5 flex-grow flex flex-col justify-between gap-5">
                                            <div className="space-y-2">
                                                {/* Proveedor */}
                                                {producto.proveedor && (
                                                    <div className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                                                        <i className="fa-solid fa-truck text-violet-400"></i> {producto.proveedor.nombreEmpresa}
                                                    </div>
                                                )}
                                                <h3 className="font-bold text-gray-800 text-lg leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-violet-600 transition-colors">
                                                    {producto.nombre}
                                                </h3>
                                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-10">
                                                    {producto.descripcion || 'Sin descripción disponible.'}
                                                </p>
                                            </div>

                                            {/* Precio y Stock */}
                                            <div className="pt-2">
                                                <div className="flex flex-wrap justify-between items-end gap-2">
                                                    <span className="font-extrabold text-xl leading-tight text-slate-900">
                                                        ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                                    </span>
                                                    <span className={`text-xs font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                                        {isOutOfStock ? 'Sin stock' : `Disponibles: ${producto.stock}`}
                                                    </span>
                                                </div>

                                                {/* Botón Comprar */}
                                                <button
                                                    onClick={() => handleAddToCart(producto)}
                                                    disabled={isOutOfStock || isAdmin}
                                                    className={`w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer ${
                                                        isOutOfStock || isAdmin
                                                            ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                                                            : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-md'
                                                    }`}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {isAdmin ? 'Disponible para clientes' : 'Añadir al carrito'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

        </div>
    );

};
