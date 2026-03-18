import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStats } from '../services/statsService';
import DashboardChart from '../components/DashboardChart';

/* ── Stat card with colored icon ── */
function StatCard({ icon, value, label, desc, accentClass }) {
  return (
    <div className="stat-card">
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

/* ── Horizontal bar chart ── */
function HorizontalBars({ data = [], valueFormatter }) {
  if (!data.length) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Aucune donnée disponible
      </p>
    );
  }
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div>
      {data.map((item, i) => (
        <div key={i} className="hbar-row">
          <span className="hbar-label" title={item.titre || item.name}>
            {item.titre || item.name}
          </span>
          <div className="hbar-track">
            <div
              className="hbar-fill"
              style={{ width: max > 0 ? `${(item.value / max) * 100}%` : '0%' }}
            />
          </div>
          <span className="hbar-value">
            {valueFormatter ? valueFormatter(item.value) : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

const MOCK_STATS = {
  totalEvents: 0,
  totalRevenue: 0,
  totalTickets: 0,
  occupancyRate: 0,
  byCategory: [],
  byType: [],
  top5Revenue: [],
  top5Occupancy: [],
};

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getStats(token);
        setStats({ ...MOCK_STATS, ...data });
      } catch (err) {
        console.error(err);
        setError("L'API des statistiques n'est pas encore disponible. Les données affichées sont vides.");
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
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
      {/* Header */}
      <h1 className="dashboard-title">Tableau de bord</h1>
      <p className="dashboard-subtitle">
        Vue d'ensemble des statistiques de la plateforme
        {error && (
          <span style={{ marginLeft: 10, color: 'var(--primary)', fontSize: '0.78rem' }}>
            ⚠️ {error}
          </span>
        )}
      </p>

      {/* 4 Stat cards */}
      <div className="stats-grid">
        <StatCard
          icon="📅"
          value={stats.totalEvents ?? 0}
          label="Événements"
          desc="Total de la plateforme"
          accentClass="blue"
        />
        <StatCard
          icon="💶"
          value={`${(stats.totalRevenue ?? 0).toLocaleString('fr-FR')} €`}
          label="Revenus générés"
          desc="Billets vendus"
          accentClass="green"
        />
        <StatCard
          icon="🎟️"
          value={(stats.totalTickets ?? 0).toLocaleString('fr-FR')}
          label="Billets vendus"
          desc="Toutes catégories"
          accentClass="purple"
        />
        <StatCard
          icon="📊"
          value={`${(stats.occupancyRate ?? 0).toFixed(1)}%`}
          label="Taux d'occupation"
          desc="Moyenne globale"
          accentClass="orange"
        />
      </div>

      {/* Main charts: Pie + Bar */}
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

      {/* Top 5 horizontal bar charts */}
      <div className="charts-row">
        <div className="chart-card">
          <h3 className="chart-title">Top 5 — Revenus</h3>
          <HorizontalBars
            data={stats.top5Revenue}
            valueFormatter={(v) => `${v.toLocaleString('fr-FR')} €`}
          />
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Top 5 — Taux d'occupation</h3>
          <HorizontalBars
            data={stats.top5Occupancy}
            valueFormatter={(v) => `${v.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  );
}
