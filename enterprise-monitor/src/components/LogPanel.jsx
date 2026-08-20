import './LogPanel.css'

function LogPanel({ logs }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="log-panel cyber-card">
      <h2 className="section-title">
        <span className="pixel-corner pixel-corner-tl"></span>
        SYSTEM LOG
        <span className="pixel-corner pixel-corner-tr"></span>
      </h2>
      
      <div className="log-entries">
        {logs.length === 0 ? (
          <div className="log-empty">No log entries yet</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.type}`}>
              <span className="log-timestamp">{formatTime(log.timestamp)}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LogPanel
