// import React from 'react';
// import '../style/Navbar.css'; 

// function Navbar() {
//   return (
//     <div className="navbar">
//       <h1>🏠 Smart Home Dashboard</h1>
//     </div>
//   );
// }

// export default Navbar;

import React from 'react';
import '../style/Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <nav className="navbar-container">
        <div className="nav-left">
          <a className="navbar-brand" href="/dashboard">🏠 Smart Home</a>
        </div>
        <div className="nav-right">
          <img
            src="https://th.bing.com/th/id/OIP.FUoBwhJ0OHbAmec5PgTJhwHaFg?w=211&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
            alt="Profile"
            width="32"
            height="32"
            style={{ borderRadius: '50%' }}
          />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;