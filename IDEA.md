"Any global variable declared in a ns2 script is shared between all instances of that script. For example, assume you write a script foo.js and declared a global variable like so:"

This means we can have global variables which pick how many weaken, grow, hack servers/threads something needs.

So lets say we have a script e.g
```javscript
let growers;
let weakers;
let hackers;
export async function main(ns) {
    // script first runs at home
    if server == home:
        growers = ns.growthAnalyze(target, 2)
        hackers = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(targets))
        
}