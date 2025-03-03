import "./Profile.css"; // Optionally add your own styling

export default function Profile() {
  const username = localStorage.getItem("username");

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {username ? <p>Welcome, {username}!</p> : <p>No user logged in.</p>}
    </div>
  );
}
