/**
* @param {NS} ns
**/
export async function main (ns) {
  const target = 'phantasy'
  const portCrackers = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe']
  const tools = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject]
  const hackScript = 'earlyhackport.js'
  const allServers = spider(ns)
  for (const server of allServers) {
    await ns.scp(hackScript, server)
    const threadCount = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam(hackScript))
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
      if (threadCount > 0) {
        ns.exec(hackScript, server, threadCount, target, ns.getServerMaxMoney(target), ns.getServerMinSecurityLevel(target))
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
