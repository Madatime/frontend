import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import {
    applyCatalogImageOverride,
    catalogImageCredits
} from '../data/catalogImageOverrides';
import {
    AlertTriangle,
    Check,
    ChevronLeft,
    ChevronRight,
    Filter,
    Info,
    Pause,
    Play,
    Search,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Truck
} from 'lucide-react';

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300";

export const Catalogo = ({ user, AddToCart }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carga, setCarga] = useState(true);
    const [error, setError] = useState('');
    const [indicePasarela, setIndicePasarela] = useState(0);
    const [pasarelaPausada, setPasarelaPausada] = useState(
        () => typeof window !== 'undefined'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    //filtros 
    const [searchQuery, setSearchQuery] = useState('');
    const [selecionCategoria, setSelecionCategoria] = useState('Todos');

    useEffect(() => {
        const cargaDatosCatalogo = async () => {
            setCarga(true);
            try {
                const datosProductos = await apiService.getProductos();
                setProductos(datosProductos.map(applyCatalogImageOverride));
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

    const categoriasPasarela = categorias
        .map((categoria) => ({
            categoria,
            productos: productos
                .filter((producto) => producto.categoria?.nombre === categoria.nombre)
                .slice(0, 5)
        }))
        .filter((grupo) => grupo.productos.length > 0);

    const totalCategoriasPasarela = categoriasPasarela.length;
    const grupoPasarela = totalCategoriasPasarela > 0
        ? categoriasPasarela[indicePasarela % totalCategoriasPasarela]
        : null;

    useEffect(() => {
        if (pasarelaPausada || totalCategoriasPasarela < 2) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setIndicePasarela((indiceActual) => (
                (indiceActual + 1) % totalCategoriasPasarela
            ));
        }, 5500);

        return () => window.clearInterval(timer);
    }, [pasarelaPausada, totalCategoriasPasarela]);

    const cambiarCategoriaPasarela = (direccion) => {
        setIndicePasarela((indiceActual) => (
            (indiceActual + direccion + totalCategoriasPasarela)
            % totalCategoriasPasarela
        ));
    };

    //AGREGAR AL CARRITO
    const animateProductToCart = (event) => {
        const cartTarget = document.querySelector('[aria-label^="Abrir carrito"]');
        const productImage = event.currentTarget.closest('.group')?.querySelector('img');

        if (
            !cartTarget ||
            !productImage ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return;
        }

        const imageRect = productImage.getBoundingClientRect();
        const cartRect = cartTarget.getBoundingClientRect();
        const flyingImage = productImage.cloneNode();
        const translateX =
            cartRect.left + cartRect.width / 2 - (imageRect.left + imageRect.width / 2);
        const translateY =
            cartRect.top + cartRect.height / 2 - (imageRect.top + imageRect.height / 2);

        Object.assign(flyingImage.style, {
            position: 'fixed',
            left: `${imageRect.left}px`,
            top: `${imageRect.top}px`,
            width: `${imageRect.width}px`,
            height: `${imageRect.height}px`,
            objectFit: 'cover',
            borderRadius: '1.25rem',
            pointerEvents: 'none',
            zIndex: '9999',
            boxShadow: '0 18px 35px rgba(76, 29, 149, 0.28)'
        });

        document.body.appendChild(flyingImage);

        const animation = flyingImage.animate(
            [
                { transform: 'translate(0, 0) scale(1)', opacity: 0.95 },
                {
                    transform: `translate(${translateX * 0.55}px, ${translateY * 0.35 - 70}px) scale(0.55)`,
                    opacity: 0.85,
                    offset: 0.65
                },
                {
                    transform: `translate(${translateX}px, ${translateY}px) scale(0.12)`,
                    opacity: 0.2
                }
            ],
            {
                duration: 650,
                easing: 'cubic-bezier(0.22, 0.8, 0.25, 1)'
            }
        );

        animation.onfinish = () => {
            flyingImage.remove();
            cartTarget.animate(
                [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.2)' },
                    { transform: 'scale(1)' }
                ],
                { duration: 260, easing: 'ease-out' }
            );
        };
        animation.oncancel = () => flyingImage.remove();
    };

    const handleAddToCart = (producto, event) => {
        if (user?.rol === 'ROLE_ADMIN') {
            alert('Los administradores no pueden agregar productos al carrito.');
            return;
        }
        AddToCart(producto);
        animateProductToCart(event);
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
            <div className="bg-gradient-to-br from-violet-200 via-purple-100 to-fuchsia-100 rounded-[2rem] px-7 py-9 sm:p-10 lg:px-12 lg:py-11 mb-6 lg:mb-8 min-h-64 flex items-center text-slate-900 border border-violet-200/80 shadow-[0_24px_60px_-32px_rgba(49,65,90,0.48)] relative overflow-hidden isolate">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_32%)]"></div>
                <div className="relative z-10 max-w-3xl text-left">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/65 border border-violet-200 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700 mb-5 shadow-sm backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        Todo en un solo lugar
                    </span>
                    <h1 className="m-0 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Catálogo de Productos</h1>
                    <p className="mt-3 text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl">
                        Explora las mejores ofertas, productos de calidad y envíos garantizados directamente por nuestros proveedores.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/55 border border-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-sm">
                            <ShieldCheck className="w-4 h-4 text-violet-600" />
                            Compra segura
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/55 border border-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-sm">
                            <Truck className="w-4 h-4 text-violet-600" />
                            Envíos garantizados
                        </span>
                    </div>
                </div>
                <div className="absolute -right-16 sm:right-8 lg:right-16 top-1/2 -translate-y-1/2 w-56 h-56 lg:w-64 lg:h-64 rounded-full bg-white/25 border border-white/40 shadow-inner backdrop-blur-sm flex items-center justify-center">
                    <ShoppingCart className="w-32 h-32 lg:w-40 lg:h-40 text-violet-700 opacity-15" />
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

            {/* Pasarela visual de productos existentes */}
            {grupoPasarela && (
                <section
                    className="mb-6 lg:mb-8 rounded-[1.75rem] border border-violet-100 bg-white p-4 sm:p-5 lg:p-6 shadow-[0_20px_50px_-34px_rgba(76,29,149,0.45)] overflow-hidden"
                    aria-label="Pasarela de productos por categoría"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 text-left">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                                Descubre por categoría
                            </span>
                            <h2 className="mt-1 mb-0 text-2xl font-extrabold tracking-tight text-slate-900">
                                {grupoPasarela.categoria.nombre}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Una selección de hasta 5 productos disponibles
                            </p>
                        </div>

                        <div className="flex items-center gap-2" aria-label="Controles de la pasarela">
                            <button
                                type="button"
                                onClick={() => cambiarCategoriaPasarela(-1)}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 flex items-center justify-center cursor-pointer"
                                aria-label="Ver categoría anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setPasarelaPausada((pausada) => !pausada)}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 flex items-center justify-center cursor-pointer"
                                aria-label={pasarelaPausada ? 'Reanudar pasarela' : 'Pausar pasarela'}
                            >
                                {pasarelaPausada
                                    ? <Play className="w-4 h-4" />
                                    : <Pause className="w-4 h-4" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => cambiarCategoriaPasarela(1)}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 flex items-center justify-center cursor-pointer"
                                aria-label="Ver categoría siguiente"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        key={grupoPasarela.categoria.id}
                        className="product-showcase-enter grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
                    >
                        {grupoPasarela.productos.map((producto) => (
                            <article
                                key={producto.id}
                                className="group/showcase min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50"
                            >
                                <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden bg-slate-100">
                                    <img
                                        src={producto.imagenUrl || DEFAULT_PRODUCT_IMAGE}
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/showcase:scale-105"
                                        onError={(event) => {
                                            event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                                        }}
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/25 to-transparent pointer-events-none"></div>
                                </div>
                                <div className="p-3.5 text-left">
                                    <h3 className="m-0 text-sm font-extrabold leading-snug text-slate-800 line-clamp-2 min-h-10">
                                        {producto.nombre}
                                    </h3>
                                    <p className="mt-2 text-sm font-bold text-violet-700">
                                        ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-1.5">
                        {categoriasPasarela.map((grupo, indice) => (
                            <button
                                key={grupo.categoria.id}
                                type="button"
                                onClick={() => setIndicePasarela(indice)}
                                className={`h-2 rounded-full cursor-pointer transition-all ${
                                    indice === indicePasarela % totalCategoriasPasarela
                                        ? 'w-7 bg-violet-600'
                                        : 'w-2 bg-violet-200 hover:bg-violet-300'
                                }`}
                                aria-label={`Ver ${grupo.categoria.nombre}`}
                                aria-current={
                                    indice === indicePasarela % totalCategoriasPasarela
                                        ? 'true'
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Buscador y Contenido */}
            <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
                {/* Filtros Lateral (Sidebar) */}
                <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
                    {/* Tarjeta de Búsqueda */}
                    <div className="bg-white p-5 rounded-[1.4rem] border border-slate-200/90 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.5)] space-y-3 text-left">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Search className="w-4 h-4 text-violet-500" /> Buscar Producto
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Escribe nombre o descripción..."
                                className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none text-sm text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Tarjeta de Categorías */}
                    <div className="bg-white p-5 rounded-[1.4rem] border border-slate-200/90 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.5)] space-y-4 text-left">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Filter className="w-4 h-4 text-violet-500" /> Categorías
                        </h3>
                        <div className="flex flex-wrap lg:flex-col gap-1.5">
                            <button
                                onClick={() => setSelecionCategoria('Todos')}
                                className={`w-auto lg:w-full flex items-center justify-between gap-3 text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                    selecionCategoria === 'Todos'
                                        ? 'bg-violet-50 text-violet-700 font-bold ring-1 ring-violet-100'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <span>Todas las categorías</span>
                                {selecionCategoria === 'Todos' && <Check className="w-4 h-4 hidden lg:block" />}
                            </button>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelecionCategoria(cat.nombre)}
                                    className={`w-auto lg:w-full flex items-center justify-between gap-3 text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                        selecionCategoria === cat.nombre
                                            ? 'bg-violet-50 text-violet-700 font-bold ring-1 ring-violet-100'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{cat.nombre}</span>
                                    {selecionCategoria === cat.nombre && <Check className="w-4 h-4 hidden lg:block" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Cuadrícula de Productos */}
                <section className="w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 text-left">
                        <div>
                            <h2 className="m-0 text-2xl font-extrabold tracking-tight text-slate-900">Productos</h2>
                            <p className="text-sm text-slate-500 mt-0.5">
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
                                const isOutOfStock = producto.stock <= 0;
                                const isAdmin = user?.rol === 'ROLE_ADMIN';

                                return (
                                    <div
                                        key={producto.id}
                                        className="bg-white rounded-[1.4rem] border border-slate-200/90 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.58)] overflow-hidden flex flex-col group hover:shadow-[0_24px_48px_-25px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1.5"
                                    >
                                        {/* Imagen con zoom effect */}
                                        <div className="h-52 2xl:h-56 w-full bg-gray-100 relative overflow-hidden">
                                            <img
                                                src={producto.imagenUrl || DEFAULT_PRODUCT_IMAGE}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                                                }}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/15 to-transparent pointer-events-none"></div>
                                            {/* Categoría Badge */}
                                            {producto.categoria && (
                                                <span className="absolute top-3.5 left-3.5 bg-violet-700/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/20">
                                                    {producto.categoria.nombre}
                                                </span>
                                            )}
                                        </div>

                                        {/* Cuerpo */}
                                        <div className="p-5 flex-grow flex flex-col justify-between gap-5 text-left">
                                            <div className="space-y-2">
                                                {/* Proveedor */}
                                                {producto.proveedor && (
                                                    <div className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                                                        <i className="fa-solid fa-truck text-violet-400"></i> {producto.proveedor.nombreEmpresa}
                                                    </div>
                                                )}
                                                <h3 className="font-extrabold text-gray-800 text-lg tracking-tight leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-violet-600 transition-colors">
                                                    {producto.nombre}
                                                </h3>
                                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-10">
                                                    {producto.descripcion || 'Sin descripción disponible.'}
                                                </p>
                                            </div>

                                            {/* Precio y Stock */}
                                            <div className="pt-2">
                                                <div className="flex flex-wrap justify-between items-end gap-2">
                                                    <span className="font-extrabold text-xl tracking-tight leading-tight text-slate-900">
                                                        ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                                        {isOutOfStock ? 'Sin stock' : `Disponibles: ${producto.stock}`}
                                                    </span>
                                                </div>

                                                {/* Botón Comprar */}
                                                <button
                                                    onClick={(event) => handleAddToCart(producto, event)}
                                                    disabled={isOutOfStock || isAdmin}
                                                    className={`w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer ${
                                                        isOutOfStock || isAdmin
                                                            ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                                                            : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-lg hover:shadow-violet-200'
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

            <details className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-xs text-slate-500">
                <summary className="cursor-pointer font-semibold text-slate-600">
                    Créditos de las imágenes actualizadas
                </summary>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {catalogImageCredits.map((credito) => (
                        <p key={credito.producto} className="leading-relaxed">
                            <span className="font-semibold text-slate-700">{credito.producto}:</span>{' '}
                            <a
                                href={credito.fuente}
                                target="_blank"
                                rel="noreferrer"
                                className="text-violet-700 hover:underline"
                            >
                                {credito.autor}
                            </a>{' '}
                            ·{' '}
                            <a
                                href={credito.licenciaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-violet-700 hover:underline"
                            >
                                {credito.licencia}
                            </a>
                        </p>
                    ))}
                </div>
            </details>

        </div>
    );

};
