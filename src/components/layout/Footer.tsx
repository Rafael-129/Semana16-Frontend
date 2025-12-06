export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🏥 MediCare</h3>
            <p className="text-gray-400">
              Sistema de gestión de citas médicas. Tu salud es nuestra prioridad.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/doctors" className="hover:text-white transition-colors">Doctores</a></li>
              <li><a href="/appointments" className="hover:text-white transition-colors">Citas</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Nosotros</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 contacto@medicare.com</li>
              <li>📱 +51 999 888 777</li>
              <li>📍 Lima, Perú</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>© 2025 MediCare. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
