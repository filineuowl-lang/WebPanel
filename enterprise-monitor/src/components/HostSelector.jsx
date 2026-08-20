import { useState } from 'react'
import './HostSelector.css'

function HostSelector({ selectedGroups, selectedHosts, onGroupChange, onHostChange }) {
  const [groups] = useState([
    { groupid: '1', name: 'Servers', hostCount: 12 },
    { groupid: '2', name: 'Network Devices', hostCount: 8 },
    { groupid: '3', name: 'Databases', hostCount: 5 },
    { groupid: '4', name: 'Web Servers', hostCount: 6 },
    { groupid: '5', name: 'Storage', hostCount: 3 }
  ])

  const [hosts] = useState([
    { hostid: '101', name: 'web-server-01', status: '0', ip: '192.168.1.10' },
    { hostid: '102', name: 'web-server-02', status: '0', ip: '192.168.1.11' },
    { hostid: '103', name: 'db-master', status: '0', ip: '192.168.1.20' },
    { hostid: '104', name: 'db-replica', status: '0', ip: '192.168.1.21' },
    { hostid: '105', name: 'cache-01', status: '0', ip: '192.168.1.30' },
    { hostid: '106', name: 'monitoring', status: '0', ip: '192.168.1.5' },
    { hostid: '107', name: 'backup-server', status: '1', ip: '192.168.1.50' }
  ])

  const toggleGroup = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      onGroupChange(selectedGroups.filter(id => id !== groupId))
    } else {
      onGroupChange([...selectedGroups, groupId])
    }
  }

  const toggleHost = (hostId) => {
    if (selectedHosts.includes(hostId)) {
      onHostChange(selectedHosts.filter(id => id !== hostId))
    } else {
      onHostChange([...selectedHosts, hostId])
    }
  }

  const selectAllGroups = () => {
    onGroupChange(groups.map(g => g.groupid))
  }

  const clearSelection = () => {
    onGroupChange([])
    onHostChange([])
  }

  return (
    <div className="host-selector cyber-card">
      <h2 className="section-title">
        <span className="pixel-corner pixel-corner-tl"></span>
        TARGET SELECTION
        <span className="pixel-corner pixel-corner-tr"></span>
      </h2>

      <div className="selector-actions">
        <button className="cyber-button small" onClick={selectAllGroups}>
          Select All
        </button>
        <button className="cyber-button small" onClick={clearSelection}>
          Clear
        </button>
      </div>

      <div className="selector-grid">
        <div className="selector-column">
          <h3 className="selector-title">HOST GROUPS</h3>
          <div className="selection-list">
            {groups.map(group => (
              <div
                key={group.groupid}
                className={`selection-item ${selectedGroups.includes(group.groupid) ? 'selected' : ''}`}
                onClick={() => toggleGroup(group.groupid)}
              >
                <input
                  type="checkbox"
                  className="cyber-checkbox"
                  checked={selectedGroups.includes(group.groupid)}
                  onChange={() => {}}
                />
                <span className="item-name">{group.name}</span>
                <span className="item-status">{group.hostCount} hosts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="selector-column">
          <h3 className="selector-title">INDIVIDUAL HOSTS</h3>
          <div className="selection-list">
            {hosts.map(host => (
              <div
                key={host.hostid}
                className={`selection-item ${selectedHosts.includes(host.hostid) ? 'selected' : ''}`}
                onClick={() => toggleHost(host.hostid)}
              >
                <input
                  type="checkbox"
                  className="cyber-checkbox"
                  checked={selectedHosts.includes(host.hostid)}
                  onChange={() => {}}
                />
                <span className="item-name">{host.name}</span>
                <span className={`item-status ${host.status === '0' ? 'status-online' : 'status-offline'}`}>
                  {host.status === '0' ? '●' : '○'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="selection-summary">
        <span>Selected: </span>
        <span className="highlight">{selectedGroups.length} groups</span>
        <span>, </span>
        <span className="highlight">{selectedHosts.length} hosts</span>
      </div>
    </div>
  )
}

export default HostSelector
