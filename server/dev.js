import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const children = [
  spawn(process.execPath, ['server/index.js'], { cwd: root, stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env
  })
]

let stopping = false

function stop(code = 0) {
  if (stopping) return
  stopping = true
  process.exitCode = code
  children.forEach(child => {
    if (child.exitCode === null && !child.killed) child.kill()
  })
}

children.forEach(child => {
  child.on('error', error => {
    console.error('Gagal menjalankan server development:', error)
    stop(1)
  })
  child.on('exit', code => {
    if (!stopping) stop(code || 0)
  })
})

process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
