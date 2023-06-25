/**
* @param {NS} ns
**/
export async function main (ns) {
  const target = 'phantasy'
  const portCrackers = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe']
  const tools = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject]
  const WGScript = 'wgport.js'
  const HScript = 'hport.js'
  const allServers = spider(ns)
  let hackThreadsNeeded = ns.hackAnalyzeThreads(target, Math.floor(ns.getServerMaxMoney(target) / 2))
  for (const server of allServers) {
    if (server == 'home') {
      continue
    }
    await ns.scp(WGScript, server)
    await ns.scp(HScript, server)
    const hackThreadCount = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(HScript))
    const portsNeeded = ns.getServerNumPortsRequired(server)
    let open = 0

    for (let i = 0; i < portCrackers.length && open < portsNeeded; i++) {
      if (ns.fileExists(portCrackers[i], 'home')) {
        tools[i](server)
        ++open
      }
    }
    if (portsNeeded <= open) {
      ns.nuke(server)
    }

    // if root, move to and exec hack script
    if (await ns.hasRootAccess(server)) {
      ns.killall(server)
      if (hackThreadCount <= hackThreadsNeeded) {
        ns.exec(HScript, server, hackThreadCount, target, ns.getServerMaxMoney(target), ns.getServerMinSecurityLevel(target))
        hackThreadsNeeded = hackThreadsNeeded - hackThreadCount
      } else if (hackThreadCount > hackThreadsNeeded) {
        ns.exec(HScript, server, hackThreadsNeeded, target, ns.getServerMaxMoney(target), ns.getServerMinSecurityLevel(target))
        hackThreadsNeeded = 0
      }
      const freeRam = ns.getServerUsedRam(server) - ns.getServerMaxRam(server)
      const threadCount = Math.floor(freeRam / ns.getScriptRam(WGScript))
      if (threadCount > 0) {
        ns.exec(WGScript, server, threadCount, target, ns.getServerMaxMoney(target), ns.getServerMinSecurityLevel(target))
      }
    }
  }

  function spider (ns) {
    const serversSeen = ['home']
    for (const server of serversSeen) {
      const thisScan = ns.scan(server, 5)
      for (const scan of thisScan) {
        if (serversSeen.indexOf(scan) === -1) {
          serversSeen.push(scan)
        }
      }
    }
    return serversSeen
  }
}
