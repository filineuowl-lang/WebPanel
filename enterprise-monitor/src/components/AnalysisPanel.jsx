import './AnalysisPanel.css'

function AnalysisPanel({
  analysisPrompt,
  systemPrompt,
  autoCreateTriggers,
  notifyTelegram,
  onPromptChange,
  onSystemPromptChange,
  onAutoCreateTriggersChange,
  onNotifyTelegramChange,
  onRunAnalysis,
  isAnalyzing
}) {
  return (
    <div className="analysis-panel cyber-card">
      <h2 className="section-title">
        <span className="pixel-corner pixel-corner-tl"></span>
        ANALYSIS CONFIGURATION
        <span className="pixel-corner pixel-corner-tr"></span>
      </h2>

      <div className="form-group">
        <label className="form-label">Custom Analysis Prompt</label>
        <textarea
          className="form-input form-textarea"
          placeholder="Enter specific instructions for the AI analyzer..."
          value={analysisPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">System Prompt (Optional)</label>
        <textarea
          className="form-input form-textarea"
          placeholder="Override default system prompt for specialized analysis..."
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
        />
      </div>

      <div className="options-section">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="autoTriggers"
            className="cyber-checkbox"
            checked={autoCreateTriggers}
            onChange={(e) => onAutoCreateTriggersChange(e.target.checked)}
          />
          <label htmlFor="autoTriggers" className="checkbox-label">
            Auto-create Zabbix triggers based on AI recommendations
          </label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="notifyTg"
            className="cyber-checkbox"
            checked={notifyTelegram}
            onChange={(e) => onNotifyTelegramChange(e.target.checked)}
          />
          <label htmlFor="notifyTg" className="checkbox-label">
            Send results to Telegram
          </label>
        </div>
      </div>

      <button 
        className="analyze-btn"
        onClick={onRunAnalysis}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <span className="btn-icon">⟳</span>
            ANALYZING...
          </>
        ) : (
          <>
            <span className="btn-icon">◈</span>
            RUN THREAT ANALYSIS
          </>
        )}
      </button>

      <div className="info-box">
        <div className="info-icon">ⓘ</div>
        <div className="info-text">
          This will collect data from selected Zabbix hosts, send it to the configured AI service for analysis, and optionally create triggers and send notifications.
        </div>
      </div>
    </div>
  )
}

export default AnalysisPanel
