import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <h1 className="logo-text">THREAT<span className="highlight">ANALYZER</span></h1>
        </div>
        <div className="header-info">
          <span className="system-status">SYSTEM: <span className="status-online">ONLINE</span></span>
          <span className="version">v1.0.0</span>
        </div>
      </div>
      <div className="header-line"></div>
    </header>
  )
}

export default Header
