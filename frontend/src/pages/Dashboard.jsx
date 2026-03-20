import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStats } from '../services/statsService';
import DashboardChart from '../components/DashboardChart';
import { CalendarIcon, EuroIcon, TicketIcon, TrendingUpIcon, AlertTriangleIcon } from '../components/ui/Icons';

function StatCard({ icon, value, label, desc, accentClass }) {
  return (
    <div className={`stat-card ${accentClass}`}>
      <div className="stat-card-header">
        <div>
          <div className="stat-card-value">{value}</div>
          <div className="stat-card-label">{label}</div>
          {desc && <div className="stat-card-desc">{desc}</div>}
        </div>
        <div className={`stat-card-icon-wrap ${accentClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function HorizontalBars({ data = [], valueFormatter }) {
  if (!data.length) {
    return <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aucune donnée disponible</p>;
  }
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div>
      {data.map((item, i) => (
        <div key={i} className="hbar-row">
          <span className="hbar-label" title={item.titre || item.name}>{item.titre || item.name}</span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: max > 0 ? `${(item.value / max) * 100}%` : '0%' }} />
          </div>
          <span className="hbar-value">{valueFormatter ? valueFormatter(item.value) : item.value}</span>
        </div>
      ))}
    </div>
  );
}

const MOCK_STATS = {
  totalEvents: 0, totalRevenue: 0, totalTickets: 0,
  occupancyRate: 0, byCategory: [], byType: [], top5Revenue: [], top5Occupancy: [],
};

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats]     = useState(MOCK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true); setError('');
      try {
        const data = await getStats(token);
        setStats({ ...MOCK_STATS, ...data });
      } catch (err) {
        console.error(err);
        setError("L'API des statistiques n'est pas encore disponible. Les données affichées sont vides.");
        setStats(MOCK_STATS);
      } finally { setLoading(false); }
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="loading-spinner" />
        <p className="loading-text">Chargement du tableau de bord…</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Tableau de bord</h1>
      <p className="dashboard-subtitle">
        Vue d'ensemble des statistiques de la plateforme
        {error && (
          <span style={{ marginLeft: 10, color: 'var(--primary)', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangleIcon size={13} /> {error}
          </span>
        )}
      </p>

      <div className="stats-grid">
        <StatCard
          icon={<CalendarIcon size={20} />}
          value={stats.totalEvents ?? 0}
          label="Total événements"
          desc="sur la plateforme"
          accentClass="blue"
        />
        <StatCard
          icon={<EuroIcon size={20} />}
          value={`${(stats.totalRevenue ?? 0).toLocaleString('fr-FR')} €`}
          label="Revenus totaux"
          desc="générés par les ventes"
          accentClass="green"
        />
        <StatCard
          icon={<TicketIcon size={20} />}
          value={(stats.totalTickets ?? 0).toLocaleString('fr-FR')}
          label="Billets vendus"
          desc={`sur ${((stats.totalEvents ?? 0) * 100).toLocaleString('fr-FR')} places`}
          accentClass="purple"
        />
        <StatCard
          icon={<TrendingUpIcon size={20} />}
          value={`${(stats.occupancyRate ?? 0).toFixed(1)}%`}
          label="Taux d'occupation"
          desc="en moyenne"
          accentClass="orange"
        />
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3 className="chart-title">Répartition par catégorie</h3>
          <DashboardChart data={stats.byCategory} type="pie" />
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Événements par type</h3>
          <DashboardChart data={stats.byType} type="bar" />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3 className="chart-title">Top 5 — Revenus</h3>
          <HorizontalBars data={stats.top5Revenue} valueFormatter={(v) => `${v.toLocaleString('fr-FR')} €`} />
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Top 5 — Taux d'occupation</h3>
          <HorizontalBars data={stats.top5Occupancy} valueFormatter={(v) => `${v.toFixed(1)}%`} />
        </div>
      </div>
    </div>
  );
}
