import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import ConfigPanel from './components/ConfigPanel'
import HostSelector from './components/HostSelector'
import AnalysisPanel from './components/AnalysisPanel'
import LogPanel from './components/LogPanel'

function App() {
  const [config, setConfig] = useState({
    zabbixUrl: '',
    zabbixUser: '',
    zabbixPass: '',
    openaiUrl: '',
    openaiKey: '',
    telegramToken: '',
    telegramChatId: ''
  })

  const [isConnected, setIsConnected] = useState({
    zabbix: false,
    openai: false,
    telegram: false
  })

  const [selectedGroups, setSelectedGroups] = useState([])
  const [selectedHosts, setSelectedHosts] = useState([])
  const [analysisPrompt, setAnalysisPrompt] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [autoCreateTriggers, setAutoCreateTriggers] = useState(false)
  const [notifyTelegram, setNotifyTelegram] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [logs, setLogs] = useState([])
  const [lastAnalysis, setLastAnalysis] = useState(null)

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { 
      timestamp: new Date().toISOString(), 
      message, 
      type 
    }])
  }

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const testConnection = async (service) => {
    addLog(`Testing ${service} connection...`, 'info')
    // Connection test logic would go here
    setTimeout(() => {
      setIsConnected(prev => ({ ...prev, [service]: true }))
      addLog(`${service} connected successfully`, 'success')
    }, 1000)
  }

  const runAnalysis = async () => {
    if (!isConnected.zabbix || !isConnected.openai) {
      addLog('Please configure and connect to Zabbix and OpenAI first', 'error')
      return
    }

    setIsAnalyzing(true)
    addLog('Starting threat analysis...', 'info')

    try {
      // Analysis logic would be called here
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockResult = {
        statistics: {
          groups: [{ name: 'Servers', groupid: '1' }],
          hosts: [{ name: 'web-server-01', status: '0' }],
          triggers: []
        },
        analysis: 'Analysis complete. No critical threats detected.',
        triggersCreated: autoCreateTriggers
      }

      setLastAnalysis(mockResult)
      addLog('Analysis completed successfully', 'success')
      
      if (notifyTelegram && isConnected.telegram) {
        addLog('Results sent to Telegram', 'success')
      }
    } catch (error) {
      addLog(`Analysis failed: ${error.message}`, 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="app">
      <div className="scanlines"></div>
      
      <Header />
      
      <main className="main-content">
        <div className="panels-grid">
          <ConfigPanel 
            config={config}
            onConfigChange={handleConfigChange}
            isConnected={isConnected}
            onTestConnection={testConnection}
          />
          
          <HostSelector
            selectedGroups={selectedGroups}
            selectedHosts={selectedHosts}
            onGroupChange={setSelectedGroups}
            onHostChange={setSelectedHosts}
          />
          
          <AnalysisPanel
            analysisPrompt={analysisPrompt}
            systemPrompt={systemPrompt}
            autoCreateTriggers={autoCreateTriggers}
            notifyTelegram={notifyTelegram}
            onPromptChange={setAnalysisPrompt}
            onSystemPromptChange={setSystemPrompt}
            onAutoCreateTriggersChange={setAutoCreateTriggers}
            onNotifyTelegramChange={setNotifyTelegram}
            onRunAnalysis={runAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>
        
        {lastAnalysis && (
          <div className="results-section cyber-card">
            <h2 className="section-title glow-text">
              <span className="pixel-corner pixel-corner-tl"></span>
              ANALYSIS RESULTS
              <span className="pixel-corner pixel-corner-tr"></span>
            </h2>
            <pre className="analysis-output">{lastAnalysis.analysis}</pre>
          </div>
        )}
        
        <LogPanel logs={logs} />
      </main>
    </div>
  )
}

export default App
