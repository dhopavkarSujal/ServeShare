import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserPages.css";
import { ngoService } from "../config/services/ngoService";

export default function UserNGOsPage() {
  const navigate = useNavigate();

  const [ngos, setNgos] = useState([]);
  const [filteredNGOs, setFilteredNGOs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 DEBUG: Log when component mounts
  console.log("UserNGOsPage mounted");

  // Step 1: Fetch approved NGOs from Supabase
  useEffect(() => {
    const loadNGOs = async () => {
      setLoading(true);
      setError(null);

      console.log("Fetching NGOs from Supabase...");
      const { ngos: fetchedNGOs } = await ngoService.getApprovedNGOs();

      if (!fetchedNGOs || fetchedNGOs.length === 0) {
        console.warn("No NGOs found");
        setNgos([]);
        setFilteredNGOs([]);
      } else {
        console.log("Loaded NGOs:", fetchedNGOs.length, "items");
        setNgos(fetchedNGOs);
        setFilteredNGOs(fetchedNGOs);
      }

      setLoading(false);
    };

    loadNGOs();
  }, []);

  // Step 2: Search and filter logic
  useEffect(() => {
    if (!search.trim()) {
      setFilteredNGOs(ngos);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = ngos.filter((ngo) => {
      // Search by name
      if (ngo.name?.toLowerCase().includes(searchLower)) return true;
      // Search by city/location
      if (ngo.city?.toLowerCase().includes(searchLower)) return true;
      if (ngo.location?.toLowerCase().includes(searchLower)) return true;
      // Search by categories
      if (ngo.categories && Array.isArray(ngo.categories)) {
        return ngo.categories.some((cat) =>
          cat.toLowerCase().includes(searchLower)
        );
      }
      return false;
    });

    console.log("Filtered NGOs:", filtered.length, "results for search:", search);
    setFilteredNGOs(filtered);
  }, [search, ngos]);

  // Step 3: Handle Donate click - navigate with NGO pre-selected
  const handleDonateClick = (ngoId) => {
    console.log("Navigating to donation form with ngo_id:", ngoId);
    navigate(`/user/donations/new?ngo_id=${ngoId}`);
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Nearby NGOs</h1>
          <p>Browse and support verified NGOs</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ marginTop: 20 }}>
        <input
          className="search-bar"
          placeholder="Search by name, location, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* NGO Grid */}
      <div className="grid-3" style={{ marginTop: 20 }}>

        {/* Scenario 1: Loading State */}
        {loading && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "40px 20px",
              textAlign: "center",
              color: "#888",
            }}
          >
            Loading NGOs...
          </div>
        )}

        {/* Scenario 2: Error State */}
        {error && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "40px 20px",
              textAlign: "center",
              color: "#ef4444",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Scenario 3: No NGOs Exist in Database (Empty) */}
        {!loading && !error && ngos.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
            }}
          >
            <div className="glass-card" style={{ padding: 30, textAlign: "center" }}>
              <h3>No NGOs Available</h3>
              <p>There are currently no registered NGOs. Please check again later.</p>
            </div>
          </div>
        )}

        {/* Scenario 4: NGOs Exist but Search/Filter Shows None */}
        {!loading && !error && ngos.length > 0 && filteredNGOs.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "40px 20px",
              textAlign: "center",
              color: "#888",
            }}
          >
            <p>No NGOs match your search for <strong>"{search}"</strong></p>
            <p style={{ fontSize: "0.9em", marginTop: 8, color: "#999" }}>
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* Scenario 5: Normal Display - NGOs with matches */}
        {!loading && !error && ngos.length > 0 && filteredNGOs.length > 0 &&
          filteredNGOs.map((ngo) => (
            <div key={ngo.id} className="ngo-card">
              <h3>{ngo.name}</h3>
              <p style={{ fontSize: "0.9em", color: "#888" }}>
                📍 {ngo.location || ngo.city || "Location not specified"}
              </p>
              <p style={{ fontSize: "0.85em", marginTop: "8px" }}>
                {ngo.categories && Array.isArray(ngo.categories)
                  ? ngo.categories.join(", ")
                  : "General"}
              </p>
              {ngo.rating && (
                <p style={{ fontSize: "0.9em", color: "#fbbf24", marginTop: "8px" }}>
                  ⭐ {ngo.rating.toFixed(1)} rating
                </p>
              )}

              <button
                className="btn-green"
                onClick={() => handleDonateClick(ngo.id)}
                style={{ marginTop: "12px", cursor: "pointer" }}
              >
                Donate Now
              </button>
            </div>
          ))}

      </div>

    </div>
  );
}