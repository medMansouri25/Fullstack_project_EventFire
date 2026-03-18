export default function FilterBar({ filters, onChange }) {
  const { search = '', category = '', type = '' } = filters;

  const handleChange = (field) => (e) => {
    onChange({ ...filters, [field]: e.target.value });
  };

  return (
    <div className="filter-card">
      <div className="filter-header">▽ Filtres</div>
      <div className="filter-row">
        {/* Search */}
        <div className="filter-input-wrap">
          <span className="icon">🔍</span>
          <input
            className="filter-input"
            type="text"
            placeholder="Rechercher un événement..."
            value={search}
            onChange={handleChange('search')}
          />
        </div>

        {/* Category */}
        <select
          className="filter-select"
          value={category}
          onChange={handleChange('category')}
        >
          <option value="">Toutes les catégories</option>
          <option value="Musical">Musical</option>
          <option value="Culturel">Culturel</option>
        </select>

        {/* Type */}
        <select
          className="filter-select"
          value={type}
          onChange={handleChange('type')}
        >
          <option value="">Tous les types</option>
          <option value="Symphonie">Symphonie</option>
          <option value="Festival">Festival</option>
          <option value="Opéra">Opéra</option>
          <option value="Concert">Concert</option>
          <option value="Théâtre">Théâtre</option>
          <option value="Ballet">Ballet</option>
        </select>
      </div>
    </div>
  );
}
