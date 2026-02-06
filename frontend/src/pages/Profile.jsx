import "../css/profile.css";

const Profile = () => {
  // TEMP data (later comes from API)
  const user = {
    name: "Sujal Dhopavkar",
    email: "sujal@example.com",
    phone: "9876543210",
  };

  return (
    <main className="dashboard-body">
      <div className="profile-container">
        {/* Left Card */}
        <div className="profile-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User Avatar"
          />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </div>

        {/* Right Card */}
        <div className="profile-card profile-info">
          <form id="profileForm">
            <label>Name</label>
            <input type="text" value={user.name} readOnly />

            <label>Email</label>
            <input type="email" value={user.email} readOnly />

            <label>Phone</label>
            <input type="text" value={user.phone} readOnly />

            <button type="button" id="editProfileBtn">
              Edit Profile
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Profile;
