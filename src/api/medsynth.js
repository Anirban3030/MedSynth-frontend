import axios from 'axios'

const BASE_URL = 'https://medsynth-api.onrender.com'

const api = axios.create({ baseURL: BASE_URL })

/** Check if backend is alive */
export async function healthCheck() {
  const res = await api.get('/')
  return res.data
}

/**
 * Run the full 6-agent pipeline
 * @param {string} query - Plain English medical question
 * @param {number} maxResults - Max papers to fetch (default 15)
 * @returns {Promise<{success, query, papers, contradictions, report, report_text}>}
 */
export async function analyze(query, maxResults = 15) {
  const res = await api.post('/analyze', { query, max_results: maxResults })
  return res.data
}

export default api
