/**
* @param {NS} ns
**/
export async function main (ns) {
  const target = ns.args[0]
  const port = ns.getPortHandle(1)
  while (true) {
    const info = { [target]: { security: ns.getServerSecurityLevel(target), money: ns.getServerMoneyAvailable(target) } }
    port.write(JSON.stringify(info))
    await ns.sleep(50)
  }
}
