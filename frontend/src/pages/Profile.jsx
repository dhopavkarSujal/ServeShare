import { useState, useEffect } from "react";
import "../css/profile.css";

const Profile = () => {
  const userId = 1; // Later replace with JWT

  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null); // ✅ YOU MISSED THIS

  useEffect(() => {
    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const formData = new FormData();

    for (let key in user) {
      formData.append(key, user[key]);
    }

    if (image) {
      formData.append("profile_image", image);
    }

    const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: "PUT",
        body: formData,
      });

      const updatedUser = await res.json();
      setUser(updatedUser);
      setPreview(null);
      setIsEditing(false);

    alert("Profile Updated!");
    setIsEditing(false);
    setPreview(null); // optional cleanup
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        <div className="profile-left">
          <img
            src={
              preview
                ? preview
                : user.profile_image
                ? `http://localhost:5000/uploads/${user.profile_image}?t=${Date.now()}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="avatar"
            className="profile-img"
          />

          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          )}
        </div>

        <div className="profile-right">
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Full Name"
          />

          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Phone"
          />

          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Address"
          />

          <input
            name="city"
            value={user.city || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="City"
          />

          <input
            name="state"
            value={user.state || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="State"
          />

          <input
            name="pincode"
            value={user.pincode || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Pincode"
          />

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <button onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;