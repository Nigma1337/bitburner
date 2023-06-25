/** @param {NS} ns **/

export async function main (ns) {
  while (ns.getPurchasedServers().length != 25) {
    ns.purchaseServer(`pserver-${ns.getPurchasedServers().length}`, 2)
    await ns.sleep(100)
  }
  let servers = await genServerList(ns)
  // While we can upgrade our cheapest to upgrade server, do it
  while (ns.getPurchasedServerUpgradeCost(servers[0].hostname, servers[0].maxRam * 2) <= ns.getPlayer().money) {
    const server = servers[0]
    ns.tprint(`Upgrading server ${server.hostname} to ${server.maxRam * 2} GB`)
    await ns.upgradePurchasedServer(server.hostname, server.maxRam * 2)
    servers = await genServerList(ns)
    await ns.sleep(50)
  }
}

export async function genServerList (ns) {
  const servers = []
  for (const hostname of ns.getPurchasedServers()) {
    servers.push(await ns.getServer(hostname))
  }
  servers.sort(function (a, b) {
    return a.maxRam - b.maxRam
  })
  return servers
}
