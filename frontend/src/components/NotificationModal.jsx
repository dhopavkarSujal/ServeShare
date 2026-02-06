import "../css/notification.css";

const NotificationModal = ({ onClose, notifications = [] }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content notif-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>

        <h2 className="modal-title">Notifications</h2>

        <ul className="notif-modal-list">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            notifications.map((notif, index) => (
              <li key={index}>{notif}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationModal;
