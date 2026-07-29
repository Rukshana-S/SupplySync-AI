import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container animate-fade-in flex flex-col items-center justify-center" style={{ minHeight: '80vh', textAlign: 'center' }}>
      <h1 className="text-4xl font-bold text-error" style={{ marginBottom: '1rem' }}>404</h1>
      <h2 className="text-2xl" style={{ marginBottom: '2rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem' }}>The page you are looking for does not exist or has been moved.</p>
      <Link to="/">
        <button className="btn-primary">Return Home</button>
      </Link>
    </div>
  );
}
