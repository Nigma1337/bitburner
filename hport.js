/**
* @param {NS} ns
**/
export async function main (ns) {
  const target = ns.args[0]
  const moneyThresh = ns.args[1] * 0.90
  const securityThresh = ns.args[2] + 5
  const port = ns.getPortHandle(1)
  while (true) {
    const info = JSON.parse(port.peek())
    if (info[target].money > moneyThresh && info[target].security < securityThresh) {
      await ns.hack(target)
    }
    ns.sleep(100)
  }
}
