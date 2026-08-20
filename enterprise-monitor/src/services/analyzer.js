import { zabbixApi, openaiApi, telegramApi } from './api';

// Default system prompt for AI analysis
const DEFAULT_SYSTEM_PROMPT = `You are an expert infrastructure security analyst. 
Your task is to analyze monitoring data from Zabbix and identify potential security threats, performance issues, or anomalies.

Provide your analysis in the following format:
1. **THREAT SUMMARY** - Brief overview of identified issues
2. **CRITICAL FINDINGS** - List of high-priority concerns
3. **RECOMMENDATIONS** - Actionable steps to resolve issues
4. **ZABBIX TRIGGERS** - Suggested trigger expressions for ongoing monitoring (if applicable)

Be concise but thorough. Use technical language appropriate for system administrators.`;

class ThreatAnalyzer {
  constructor() {
    this.selectedGroups = [];
    this.selectedHosts = [];
    this.analysisPrompt = '';
    this.customSystemPrompt = DEFAULT_SYSTEM_PROMPT;
    this.autoCreateTriggers = false;
    this.notifyTelegram = true;
  }

  setGroups(groupIds) {
    this.selectedGroups = groupIds;
    return this;
  }

  setHosts(hostIds) {
    this.selectedHosts = hostIds;
    return this;
  }

  setAnalysisPrompt(prompt) {
    this.analysisPrompt = prompt;
    return this;
  }

  setSystemPrompt(prompt) {
    this.customSystemPrompt = prompt;
    return this;
  }

  setAutoCreateTriggers(enabled) {
    this.autoCreateTriggers = enabled;
    return this;
  }

  setNotifyTelegram(enabled) {
    this.notifyTelegram = enabled;
    return this;
  }

  async collectStatistics() {
    const stats = {
      timestamp: new Date().toISOString(),
      groups: [],
      hosts: [],
      triggers: [],
      items: []
    };

    // Get host groups
    if (this.selectedGroups.length > 0) {
      const groups = await zabbixApi.getHostGroups();
      stats.groups = groups.filter(g => this.selectedGroups.includes(g.groupid));
    } else {
      stats.groups = await zabbixApi.getHostGroups();
    }

    // Get hosts
    const groupIds = stats.groups.map(g => g.groupid);
    stats.hosts = await zabbixApi.getHosts(groupIds);

    // Get active triggers for selected hosts
    const hostIds = stats.hosts.map(h => h.hostid);
    stats.triggers = await zabbixApi.getTriggers(hostIds);

    // Get items for each host
    for (const host of stats.hosts) {
      const items = await zabbixApi.getItemsByHost(host.hostid);
      stats.items.push({
        hostId: host.hostid,
        hostName: host.name,
        items: items.slice(0, 10) // Limit to 10 items per host
      });
    }

    return stats;
  }

  formatStatisticsForPrompt(stats) {
    let prompt = `INFRASTRUCTURE ANALYSIS REQUEST\n`;
    prompt += `==============================\n\n`;
    prompt += `Analysis Timestamp: ${stats.timestamp}\n\n`;

    prompt += `MONITORED GROUPS:\n`;
    stats.groups.forEach(g => {
      prompt += `- ${g.name} (ID: ${g.groupid})\n`;
    });
    prompt += `\n`;

    prompt += `HOSTS STATUS:\n`;
    stats.hosts.forEach(h => {
      const status = h.status === '0' ? 'ONLINE' : 'OFFLINE';
      prompt += `- ${h.name} [${status}] - Groups: ${h.groups.map(g => g.name).join(', ')}\n`;
    });
    prompt += `\n`;

    prompt += `ACTIVE TRIGGERS:\n`;
    if (stats.triggers.length === 0) {
      prompt += 'No active triggers\n';
    } else {
      stats.triggers.forEach(t => {
        const severity = this.getSeverityName(t.priority);
        const value = t.value === '1' ? 'ACTIVE' : 'OK';
        prompt += `- [${severity}] ${t.description} - Status: ${value}\n`;
      });
    }
    prompt += `\n`;

    prompt += `KEY METRICS (Sample):\n`;
    stats.items.forEach(hostData => {
      prompt += `\n${hostData.hostName}:\n`;
      hostData.items.forEach(item => {
        prompt += `  • ${item.name}: ${item.lastvalue || 'N/A'}\n`;
      });
    });

    if (this.analysisPrompt) {
      prompt += `\n\nSPECIFIC ANALYSIS REQUEST:\n${this.analysisPrompt}`;
    } else {
      prompt += `\n\nPlease analyze this infrastructure data for potential security threats, performance bottlenecks, or anomalies. Identify any patterns that might indicate emerging issues.`;
    }

    return prompt;
  }

  getSeverityName(priority) {
    const severities = {
      '0': 'NOT CLASSIFIED',
      '1': 'INFORMATION',
      '2': 'WARNING',
      '3': 'AVERAGE',
      '4': 'HIGH',
      '5': 'DISASTER'
    };
    return severities[priority] || 'UNKNOWN';
  }

  async runAnalysis() {
    // Step 1: Collect statistics
    console.log('Collecting statistics from Zabbix...');
    const stats = await this.collectStatistics();

    // Step 2: Format prompt
    const prompt = this.formatStatisticsForPrompt(stats);

    // Step 3: Send to AI for analysis
    console.log('Sending to AI for analysis...');
    const analysisResult = await openaiApi.analyze(prompt, this.customSystemPrompt);

    // Step 4: Send result to Telegram
    if (this.notifyTelegram) {
      console.log('Sending analysis to Telegram...');
      const telegramMessage = this.formatForTelegram(stats, analysisResult);
      await telegramApi.sendMessage(telegramMessage);
    }

    // Step 5: Create triggers if enabled
    if (this.autoCreateTriggers) {
      console.log('Extracting trigger suggestions...');
      const triggers = this.extractTriggerSuggestions(analysisResult, stats.hosts);
      for (const trigger of triggers) {
        try {
          await zabbixApi.createTrigger(
            trigger.hostId,
            trigger.description,
            trigger.expression,
            trigger.priority
          );
          console.log(`Created trigger: ${trigger.description}`);
        } catch (error) {
          console.error(`Failed to create trigger: ${trigger.description}`, error);
        }
      }
    }

    return {
      statistics: stats,
      analysis: analysisResult,
      triggersCreated: this.autoCreateTriggers
    };
  }

  formatForTelegram(stats, analysis) {
    let message = `🔍 *THREAT ANALYSIS REPORT*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📅 ${new Date(stats.timestamp).toLocaleString()}\n\n`;

    message += `📊 *SUMMARY*\n`;
    message += `Groups: ${stats.groups.length}\n`;
    message += `Hosts: ${stats.hosts.length}\n`;
    message += `Active Triggers: ${stats.triggers.filter(t => t.value === '1').length}\n\n`;

    message += `🤖 *AI ANALYSIS*\n`;
    message += `${analysis.substring(0, 3500)}\n`; // Telegram message limit

    if (analysis.length > 3500) {
      message += `\n... (truncated)`;
    }

    return message;
  }

  extractTriggerSuggestions(analysis, hosts) {
    const triggers = [];
    
    // Simple regex-based extraction - in production, use more sophisticated NLP
    const triggerPatterns = [
      /create.*trigger.*:(.*?)(?:for|on|in)\s+(\w+)/gi,
      /monitor\s+(.+?)\s+with\s+(.+)/gi,
      /alert when (.+?)(?: exceeds|goes above)/gi
    ];

    // Default triggers based on common patterns
    if (hosts.length > 0) {
      const firstHost = hosts[0];
      
      // Check if analysis mentions CPU
      if (analysis.toLowerCase().includes('cpu')) {
        triggers.push({
          hostId: firstHost.hostid,
          description: 'High CPU Usage Detected by AI Analysis',
          expression: `{${firstHost.name}:system.cpu.util.avg(5m)}>80`,
          priority: 3
        });
      }

      // Check if analysis mentions memory
      if (analysis.toLowerCase().includes('memory') || analysis.toLowerCase().includes('ram')) {
        triggers.push({
          hostId: firstHost.hostid,
          description: 'High Memory Usage Detected by AI Analysis',
          expression: `{${firstHost.name}:vm.memory.size.pused.avg(5m)}>90`,
          priority: 3
        });
      }

      // Check if analysis mentions disk
      if (analysis.toLowerCase().includes('disk')) {
        triggers.push({
          hostId: firstHost.hostid,
          description: 'Disk Space Critical - AI Recommended',
          expression: `{${firstHost.name}:vfs.fs.size[,pused].avg(10m)}>85`,
          priority: 4
        });
      }
    }

    return triggers;
  }
}

export default ThreatAnalyzer;
