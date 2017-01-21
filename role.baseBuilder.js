// The baseBuilder (Alpha)
module.exports = {
    run(creep) {
        if (!creep.memory['state'] ) {
            // creep.say('HarvestNow');
            creep.memory['state'] = 'HarvestNow';
        } else {
            // creep.say(creep.memory['state']);
        }
        var state = creep.memory['state'];
        
        ////////////////
        //State Machinez
        switch(state) {
            case 'HarvestNow': {
                // console.log(creep.name + " Is Carrying: "+_.sum(creep.carry)+" Total Of Max "+creep.carryCapacity);
                if ( _.sum(creep.carry) < creep.carryCapacity) {
                    var sources = creep.room.find(FIND_SOURCES);
                    var thisOneFuller = chooseMostEnergy(sources,creep);
                    if(creep.harvest(thisOneFuller) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(thisOneFuller);
                       //creep.say("goHarvest");
                    }
                } else  if ( _.sum(creep.carry) == creep.carryCapacity) {
                    // We are FULL.
                    // creep.say('buildNow');
                    creep.memory['state'] = 'buildNow';
                }
                break;
            }
            case 'buildNow': {
                var roomConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                // console.log(creep.name+': My Current Room has '+roomConstructionSites.length+' Construction Sites.');
                var thisOnefirst = chooseClosest(roomConstructionSites,creep);
                if(creep.build(thisOnefirst) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(thisOnefirst);
                    // creep.say("goBuild");
                }
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'HarvestNow';creep.say('I\'m Empty!');}
                break;
            }
            default: { creep.memory.state = 'HarvestNow';break;}
        }
        //
        // End Switch(state)
        function chooseClosest(targets,creep) {
            chosen = targets[0];
            for(var t in targets) {
                // console.log(JSON.stringify(targets));
                // console.log(targets[t]);
                var r = creep.pos.getRangeTo(targets[t]);
                if (r < creep.pos.getRangeTo(chosen)) {
                    chosen = targets[t];
                }
            }
            // console.log(chosen+" is closest");
            return chosen;
        }
        function chooseMostEnergy(targets,creep) {
            chosen = targets[0];
            for(var t in targets) {
                if ( targets[t].id  == chosen.id   ) {continue;}
                // console.log(chosen + "vs" + targets[t]);
                // console.log(JSON.stringify(targets));
                // console.log(targets[t]);
                var r = targets[t].energy;
                var diff = (r - chosen.energy);
                // console.log("Difference: "+diff);
                // console.log("r = "+ r+" chosen = "+chosen.energy);
                if ((r > chosen.energy) && Math.abs(diff) > 50) {
                   if ( _.sum(creep.carry) == 0 ) {
                        var oldChoice = chosen;
                        chosen = targets[t];
                        // console.log("Choosing: "+chosen+" over " +oldChoice);
                    } else {
                        //stay here with CLOSEST
                        var oldChoice = chosen;
                        chosen = chooseClosest(targets,creep);
                        // console.log("Staying: "+chosen+" oldChoice: " +oldChoice);
                    }
                } else if ( r == chosen.energy) {
                    var oldChoice=chosen;
                    chosen = chooseClosest(targets,creep);
                    // console.log("Choosing: "+chosen+" over " +oldChoice+" (EQUAL so Closest)");
                } else if ( r < chosen.energy) {
                    // chosen = chosen;
                    // console.log("Choosing: "+chosen+" over " +targets[t]+" (Has More)");
                } else {
                    var oldChoice = chosen;
                    chosen = chooseClosest(targets,creep);
                    // console.log("Choosing: "+chosen+" over " +oldChoice+" (Defaulted to Closest)");
                }
            }
            // console.log(chosen+" Has The Most Energy: "+chosen.energy);
            return chosen;
        }
    }
    
};