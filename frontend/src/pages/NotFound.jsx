import { Link } from 'react-router-dom';
import { ROUTES } from '@utils/constants';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mt-4">Página no encontrada</h2>
                <p className="text-gray-600 mt-2 mb-8">
                    Lo sentimos, la página que buscas no existe.
                </p>
                <Link
                    to={ROUTES.DASHBOARD}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
