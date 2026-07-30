import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiService } from '../services/apiService';
import {
  CreditCard,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Play,
  Package,
  ShoppingBag,
} from 'lucide-react';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const PaymentForm = ({ venta, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [clientSecret, setClientSecret] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    // 1. Obtener el clientSecret del backend
    const getSecret = async () => {
      try {
        const res = await apiService.crearIntencionPago(venta.id);
        if (res && res.clientSecret) {
          setClientSecret(res.clientSecret);
        }
      } catch (err) {
        console.warn('No se pudo inicializar Stripe.', err);
      }
    };
    if (venta && venta.id) {
      getSecret();
    }
  }, [venta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      setError('Stripe no está inicializado o la clave pública es incorrecta.');
      return;
    }

    setProcesando(true);
    setError('');

    try {
      // 2. Confirmar pago en Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
        setProcesando(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        // 3. Confirmar pago en nuestro Backend
        await apiService.confirmarPagoVenta(venta.id);
        onPaymentSuccess();
      }
    } catch (err) {
      setError(err.message || 'Error de conexión durante el pago.');
      setProcesando(false);
    }
  };

  // Simulador de pago para pruebas
  const handleSimulatePayment = async () => {
    setSimulating(true);
    setError('');
    try {
      await apiService.confirmarPagoVenta(venta.id);
      onPaymentSuccess();
    } catch {
      setError('Error al conectar con la API para simular el pago.');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200 text-sm">
          <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Formulario Stripe */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
        <label className="block text-sm font-semibold text-gray-700">Tarjeta de Crédito o Débito</label>
        <div className="bg-white p-4 rounded-xl border border-gray-300">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1f2937',
                '::placeholder': { color: '#9ca3af' },
              },
            }
          }} />
        </div>

        <button
          type="submit"
          disabled={!stripe || procesando || !clientSecret}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {procesando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Procesando pago con Stripe...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" /> Pagar Ahora (${venta.total.toFixed(2)} MXN)
            </>
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          O para pruebas
        </span>
      </div>

      <div className="bg-violet-50 rounded-2xl p-5 border border-violet-200 space-y-3">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-violet-800">Simulador de Pago de Pruebas</h4>
            <p className="text-xs text-violet-700 mt-0.5">
              Simula una transacción exitosa y actualiza el estado de la venta en la base de datos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={simulating}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {simulating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Simulando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Simular Pago Exitoso
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const CheckoutForm = ({ ventaActiva, setVistaActual }) => {
  const [pagado, setPagado] = useState(false);

  if (!ventaActiva) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-gray-200 text-center shadow-sm">
        <h3 className="font-bold text-lg text-gray-800">No hay ninguna venta activa</h3>
        <p className="text-gray-500 text-sm mt-1">Regresa al catálogo y añade productos para realizar el pago.</p>
        <button
          onClick={() => setVistaActual('catalogo')}
          className="mt-4 bg-violet-600 text-white px-6 py-2 rounded-xl text-sm font-bold cursor-pointer"
        >
          Ver Catálogo
        </button>
      </div>
    );
  }

  const handlePaymentSuccess = () => {
    setPagado(true);
  };

  if (pagado) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-xl space-y-5 animate-fade-in-down">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-800">¡Pago Exitoso!</h2>
          <p className="text-sm text-gray-500">Tu orden #{ventaActiva.id} ha sido procesada y pagada correctamente.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl text-left text-xs text-gray-600 border border-gray-100 space-y-1">
          <div><span className="font-bold">Total Pagado:</span> ${ventaActiva.total.toFixed(2)} MXN</div>
          <div><span className="font-bold">Estado:</span> <span className="text-green-600 font-bold">PAGADO</span></div>
          <div><span className="font-bold">Cliente:</span> {ventaActiva.cliente?.nombre || 'Demo'}</div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setVistaActual('miscompras')}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            Ver Mis Compras
          </button>
          <button
            onClick={() => setVistaActual('catalogo')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-violet-700 to-purple-800 px-7 py-7 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-violet-200 text-xs font-bold uppercase tracking-[0.2em]">
              Pago seguro
            </p>
            <h2 className="text-2xl font-extrabold mt-1">Checkout de Venta</h2>
            <p className="text-violet-200 mt-1 text-sm">
              Completa tu pago para la orden #{ventaActiva.id}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
            <ShoppingBag className="w-6 h-6" />
            <div>
              <p className="text-xs text-violet-100">Total del pedido</p>
              <p className="text-lg font-extrabold">
                ${Number(ventaActiva.total || 0).toFixed(2)} MXN
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 bg-slate-50/70">
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">
                Tu compra
              </p>
              <h3 className="font-extrabold text-slate-900 text-xl mt-1">
                Productos del pedido
              </h3>
            </div>
            <span className="bg-violet-50 text-violet-700 rounded-full px-3 py-1 text-xs font-bold">
              {(ventaActiva.detalles || []).reduce(
                (cantidad, detalle) => cantidad + Number(detalle.cantidad || 0),
                0
              )}{" "}
              artículos
            </span>
          </div>

          <div className="space-y-4">
            {(ventaActiva.detalles || []).map((det, idx) => {
              const producto = det.producto || {};
              const precioUnitario = Number(
                det.precioUnitario ?? producto.precio ?? 0
              );
              const subtotal = Number(
                det.subtotal ?? precioUnitario * Number(det.cantidad || 0)
              );

              return (
                <article
                  key={producto.id || idx}
                  className="flex gap-4 rounded-2xl border border-slate-200 p-3.5"
                >
                  {producto.imagenUrl ? (
                    <img
                      src={producto.imagenUrl}
                      alt={producto.nombre || "Producto"}
                      className="w-24 h-24 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0">
                      <Package className="w-9 h-9" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1 py-1">
                    <p className="font-extrabold text-slate-900 truncate">
                      {producto.nombre || `Producto #${producto.id || idx + 1}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {producto.descripcion || "Producto incluido en tu pedido."}
                    </p>
                    <div className="flex items-end justify-between gap-3 mt-3">
                      <div className="text-xs text-slate-500">
                        Cantidad:{" "}
                        <span className="font-bold text-slate-700">
                          {det.cantidad}
                        </span>
                        <span className="block mt-0.5">
                          ${precioUnitario.toFixed(2)} c/u
                        </span>
                      </div>
                      <span className="font-extrabold text-violet-700">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}

            {(ventaActiva.detalles || []).length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                <Package className="w-9 h-9 mx-auto mb-2 text-slate-400" />
                La orden fue registrada sin información visual de los productos.
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 flex justify-between font-extrabold text-slate-950">
              <span>Total a cobrar</span>
              <span>${Number(ventaActiva.total || 0).toFixed(2)} MXN</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm self-start">
          <div className="mb-5">
            <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">
              Método de pago
            </p>
            <h3 className="font-extrabold text-slate-900 text-xl mt-1">
              Finaliza tu compra
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              La ventana de Stripe y el simulador conservan su funcionamiento actual.
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <PaymentForm
              venta={ventaActiva}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        </section>
      </div>
    </div>
  );
}
