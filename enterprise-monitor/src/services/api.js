import axios from 'axios';

// Zabbix API Service
export const zabbixApi = {
  baseUrl: '',
  authToken: null,

  configure(baseUrl, username, password) {
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
  },

  async login() {
    try {
      const response = await axios.post(this.baseUrl, {
        jsonrpc: '2.0',
        method: 'user.login',
        params: {
          user: this.username,
          password: this.password
        },
        id: 1,
        auth: null
      });
      this.authToken = response.data.result;
      return this.authToken;
    } catch (error) {
      console.error('Zabbix login failed:', error);
      throw error;
    }
  },

  async getHostGroups() {
    const response = await axios.post(this.baseUrl, {
      jsonrpc: '2.0',
      method: 'hostgroup.get',
      params: {
        output: ['groupid', 'name'],
        selectHosts: ['hostid', 'name', 'status']
      },
      id: 1,
      auth: this.authToken
    });
    return response.data.result;
  },

  async getHosts(groupIds = []) {
    const params = {
      output: ['hostid', 'name', 'status'],
      selectInterfaces: ['ip'],
      selectGroups: ['name']
    };
    
    if (groupIds.length > 0) {
      params.groupids = groupIds;
    }

    const response = await axios.post(this.baseUrl, {
      jsonrpc: '2.0',
      method: 'host.get',
      params,
      id: 1,
      auth: this.authToken
    });
    return response.data.result;
  },

  async getTriggers(hostIds = [], severity = null) {
    const params = {
      output: ['triggerid', 'description', 'priority', 'value'],
      selectHosts: ['name'],
      monitored: true,
      active: true
    };

    if (hostIds.length > 0) {
      params.hostids = hostIds;
    }

    if (severity !== null) {
      params.severities = [severity];
    }

    const response = await axios.post(this.baseUrl, {
      jsonrpc: '2.0',
      method: 'trigger.get',
      params,
      id: 1,
      auth: this.authToken
    });
    return response.data.result;
  },

  async getHistory(itemIds, timeFrom, timeTill) {
    const response = await axios.post(this.baseUrl, {
      jsonrpc: '2.0',
      method: 'history.get',
      params: {
        itemids: itemIds,
        history: 0,
        time_from: timeFrom,
        time_till: timeTill,
        sortfield: 'clock',
        sortorder: 'DESC'
      },
      id: 1,
      auth: this.authToken
    });
    return response.data.result;
  },

  async createTrigger(hostId, description, expression, priority = 3) {
    const response = await axios.post(this.baseUrl, {
      jsonrpc: '2.0',
      method: 'trigger.create',
      params: {
        description: description,
        expression: expression,
        priority: priority,
        hosts: [{ hostid: hostId }]
      },
      id: 1,
      auth: this.authToken
    });
    return response.data.result;
  },

  async getItemsByHost(hostId) {
    const response = await axios.post(this.baseUrl, {
      jsonrpc: '2.0',
      method: 'item.get',
      params: {
        output: ['itemid', 'name', 'key_', 'lastvalue'],
        hostids: [hostId],
        monitored: true
      },
      id: 1,
      auth: this.authToken
    });
    return response.data.result;
  }
};

// OpenAI API Service (Local LLM)
export const openaiApi = {
  baseUrl: '',
  apiKey: '',
  model: 'local-model',

  configure(baseUrl, apiKey, model = 'local-model') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.model = model;
  },

  async analyze(prompt, systemPrompt = '') {
    try {
      const response = await axios.post(`${this.baseUrl}/v1/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'You are a security analyst analyzing infrastructure monitoring data. Identify potential threats and provide actionable recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
};

// Telegram Bot API Service
export const telegramApi = {
  botToken: '',
  chatId: '',

  configure(botToken, chatId) {
    this.botToken = botToken;
    this.chatId = chatId;
  },

  async sendMessage(message, parseMode = 'Markdown') {
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          chat_id: this.chatId,
          text: message,
          parse_mode: parseMode
        }
      );
      return response.data;
    } catch (error) {
      console.error('Telegram API error:', error);
      throw error;
    }
  },

  async sendDocument(document, caption = '') {
    try {
      const formData = new FormData();
      formData.append('chat_id', this.chatId);
      formData.append('document', document);
      if (caption) {
        formData.append('caption', caption);
      }

      const response = await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendDocument`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Telegram send document error:', error);
      throw error;
    }
  }
};

export default { zabbixApi, openaiApi, telegramApi };
