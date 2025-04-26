"use client"

import { usePlayerStore } from "@/lib/store"

export default function DebugPanel() {
  const { debugMode, debugLogs, clearDebugLogs } = usePlayerStore()

  if (!debugMode) return null

  return (
    <div className="debug-panel visible">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Panel</h3>
        <button onClick={clearDebugLogs} className="text-xs bg-gray-700 px-2 py-1 rounded">
          Clear
        </button>
      </div>
      <div className="space-y-1">
        {debugLogs.map((log, index) => (
          <div
            key={index}
            className={`text-xs ${
              log.type === "error" ? "text-red-400" : log.type === "warning" ? "text-yellow-400" : "text-green-400"
            }`}
          >
            [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}
