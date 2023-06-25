/**
* @param {NS} ns
**/
export async function main (ns) {
  const target = ns.args[0]
  const moneyThresh = ns.args[1] * 0.75
  const securityThresh = ns.args[2] + 5
  const port = ns.getPortHandle(1)
  while (true) {
    const info = JSON.parse(port.peek())
    if (info[target].security > securityThresh) {
      await ns.weaken(target)
    } else if (info[target].money < moneyThresh) {
      await ns.grow(target)
    } else {
      await ns.sleep(100)
    }
  }
}
