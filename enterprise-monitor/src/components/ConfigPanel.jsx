import './ConfigPanel.css'

function ConfigPanel({ config, onConfigChange, isConnected, onTestConnection }) {
  return (
    <div className="config-panel cyber-card">
      <h2 className="section-title">
        <span className="pixel-corner pixel-corner-tl"></span>
        API CONFIGURATION
        <span className="pixel-corner pixel-corner-tr"></span>
      </h2>

      <div className="config-section">
        <h3 className="config-section-title">ZABBIX</h3>
        <div className="form-group">
          <label className="form-label">API URL</label>
          <input
            type="text"
            className="form-input"
            placeholder="https://zabbix.example.com/api_jsonrpc.php"
            value={config.zabbixUrl}
            onChange={(e) => onConfigChange('zabbixUrl', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            placeholder="Admin"
            value={config.zabbixUser}
            onChange={(e) => onConfigChange('zabbixUser', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={config.zabbixPass}
            onChange={(e) => onConfigChange('zabbixPass', e.target.value)}
          />
        </div>
        <button 
          className="cyber-button test-btn"
          onClick={() => onTestConnection('zabbix')}
        >
          Test Connection
        </button>
        <div className={`status-badge ${isConnected.zabbix ? 'status-connected' : ''}`}>
          <span className="status-dot"></span>
          {isConnected.zabbix ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="config-section">
        <h3 className="config-section-title">OPENAI / LOCAL LLM</h3>
        <div className="form-group">
          <label className="form-label">Base URL</label>
          <input
            type="text"
            className="form-input"
            placeholder="http://localhost:11434"
            value={config.openaiUrl}
            onChange={(e) => onConfigChange('openaiUrl', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">API Key</label>
          <input
            type="text"
            className="form-input"
            placeholder="not-needed-for-local"
            value={config.openaiKey}
            onChange={(e) => onConfigChange('openaiKey', e.target.value)}
          />
        </div>
        <button 
          className="cyber-button test-btn"
          onClick={() => onTestConnection('openai')}
        >
          Test Connection
        </button>
        <div className={`status-badge ${isConnected.openai ? 'status-connected' : ''}`}>
          <span className="status-dot"></span>
          {isConnected.openai ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="config-section">
        <h3 className="config-section-title">TELEGRAM BOT</h3>
        <div className="form-group">
          <label className="form-label">Bot Token</label>
          <input
            type="text"
            className="form-input"
            placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
            value={config.telegramToken}
            onChange={(e) => onConfigChange('telegramToken', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Chat ID</label>
          <input
            type="text"
            className="form-input"
            placeholder="-1001234567890"
            value={config.telegramChatId}
            onChange={(e) => onConfigChange('telegramChatId', e.target.value)}
          />
        </div>
        <button 
          className="cyber-button test-btn"
          onClick={() => onTestConnection('telegram')}
        >
          Test Connection
        </button>
        <div className={`status-badge ${isConnected.telegram ? 'status-connected' : ''}`}>
          <span className="status-dot"></span>
          {isConnected.telegram ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  )
}

export default ConfigPanel
