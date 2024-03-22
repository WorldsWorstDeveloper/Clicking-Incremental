const RANKS = {
    reset(type) {
        
            if (type == "tier") {
                if (tmp.ranks.tier.can) {
                    player.essence = E(0)
                    player.pres.pts = E(0)
                    player.ranks.rank = E(0)
                    player.ranks.tier = player.ranks.tier.add(1)
                }
            } else if (type == "rank") {
                if (tmp.ranks.rank.can) {
                    player.essence = E(0)
                    player.pres.pts = E(0)
                    player.ranks.rank = player.ranks.rank.add(1)
                }
            } else return

    },
    tick() {
        for (let x = 0; x < RANKS["names"].length; x++) {
            let t = RANKS.names[x]
            if (t.auto) RANKS.reset(t)
        }
    },
    reqs : {
        rank(x=player.ranks.rank) {
            let base = E("4e5")
            let inc = E(10)
            inc = inc.pow(x.div(17.5).add(1))
            if (x.gte("8")) inc = inc.pow(1.33)
            if (x.gte("15")) inc = inc.pow(1.25)
            if (x.gte("22")) inc = inc.mul(1.2)
            let req = Decimal.mul(base, Decimal.pow(inc, x))
            return req
        },
        tier(x=player.ranks.tier) {
            let base = E("15")
            let inc = E("1.2")
            inc = inc.pow(x.div(20).add(1))

            let req = Decimal.mul(base, Decimal.pow(inc, x))

            return req.floor()
        }
    },
    desc: {
        rank: {
            '1': "Prestige Shard gain is raised by 1.25, gain thrice as much Essence",
            '2': "Essence is boosted by rank [(x^2)^0.8].",
            '5': "Automatically generate prestige shards.",
            '10': "Essence boosts PS by x(log10(essence+1)^0.1)+1",
            '13': "Essence is raised by 1.02",
            '15': 'Unlock ????? <p class="corrupted_text2"></p>'
        },
        tier: {
            '1': "Essence first softcap starts later based on tier.",
            '2': "Unlock auto rank, <br><p class='void_text'>EMBRACE THE DARKNESS</p>"
        }
    },
    effects: {
        rank: {
            '2'() {
                let ret = player.ranks.rank.pow(2).pow(0.8)

                return ret
            },
            '10'() {
                let ret = (player.essence.add(1).log10().root(10)).add(1)

                return ret
            }
        },
        tier: {
            '1'() {
                let ret = player.ranks.tier.div(25).add(1)

                return ret
            }
        }
    },
    names: ['rank','tier'],
    fullnames: ['Rank','Tier'],
}


function updateRanksHTML() {
    /**return @SHSHWIEDUZYXH tezt */
    tmp.el.rank.setHTML(`Rank: <b>${format(player.ranks.rank, 0)}</b><br>`)
    tmp.el.rankup.setHTML(`
    Reset your progress, but rank up. ${RANKS.desc.rank[player.ranks.rank.add(1)] ? 'At rank ' + format(player.ranks.rank.add(1), 0) + ' - ' + RANKS.desc.rank[player.ranks.rank.add(1)] : ''}
    <br>Need: ${format(RANKS.reqs.rank())} Essence<br><br>
    `)
    
    tmp.el.rank_auto.setHTML(
        tmp.ranks.rank.autounl ? (tmp.ranks.rank.auto ? `AUTO: ON`: `AUTO: OFF`) : ''
    )
    tmp.el.tier.setHTML(`Tier: <b>${format(player.ranks.tier, 0)}</b><br>`)
    tmp.el.tierup.setHTML(`
    Reset your progress, but tier up. ${RANKS.desc.tier[player.ranks.tier.add(1)] ? `At tier ` + format(player.ranks.tier.add(1),0) + ' - ' + RANKS.desc.tier[player.ranks.tier.add(1)] : ''}
    <br>Need: Rank ${format(RANKS.reqs.tier(),0)}
    `)


    /*for (let i = 0; i < RANKS["names"].length; i++) {
        let type = RANKS.names[i]
        tmp.el[type].setHTML(`${RANKS.fullnames[i]}: <b>${format(player.ranks[type],0)}</b>`)
        tmp.el[type+"up"].setHTML(`
        Reset your progress but ${type} up. ${RANKS.desc[type[player.ranks[type].add(1)]] ? `At ${type} ` + format(player.ranks[type].add(1),0) + " - " + RANKS.desc[type[player.ranks[type].add(1)]] : ''}
        `)
    }*/

}

function updateRanksTemp() {
    RANKS.tick()
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS["names"].length; x++) {
        let t = RANKS.names[x]
        if (!tmp.ranks[t]) {
            tmp.ranks[t] = {
                unl: false,
                can: false,
                autounl: false,
                auto: false
            }
        }
    }
    //tmp.ranks.rank = {}
    //tmp.ranks.tier = {}
    tmp.ranks.rank.can = player.essence.gte(RANKS.reqs.rank())
    tmp.ranks.tier.can = player.ranks.rank.gte(RANKS.reqs.tier())
    tmp.ranks.rank.autounl = player.ranks.tier.gte(2)
    for (let x = 0; x < RANKS["names"].length; x++) {
        let t = RANKS.names[x]

        tmp.el[t+'_auto'].setAttr('onclick',`if (tmp.ranks[${t}].autounl) tmp.ranks[${t}].auto = !tmp.ranks[${t}].auto`)
    }
}