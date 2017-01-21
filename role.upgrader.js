// The Upgrader (Alpha)
module.exports = {
    run(creep) {
       
        if (!creep.memory['state'] ) {
            // creep.say('Harvest');
            creep.memory['state'] = 'Harvest';
        } else {
            // creep.say(creep.memory['state']);
        }
        var state = creep.memory['state'];
        
        ////////////////
        //State Machinez
        switch(state) {
            case 'Harvest': {
                // console.log(creep.name + " Is Carrying: "+_.sum(creep.carry)+" Total Of Max "+creep.carryCapacity);
                if ( _.sum(creep.carry) < creep.carryCapacity) {
                    // console.log(creep.name + " Empty!");
                    var sources = creep.room.find(FIND_SOURCES);
                    var bestSource = chooseMostEnergy(sources,creep);
                    if(creep.harvest(bestSource) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(bestSource);
                    //   creep.say("goHarvest");
                    }
                } else  if ( _.sum(creep.carry) == creep.carryCapacity) {
                    // We are FULL.
                    // creep.say('upgrade');
                    creep.memory['state'] = 'upgradeController';
                }
                break;
            }
            case 'upgradeController': {
                var roomControllers = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_CONTROLLER } } );
                // console.log('Creeps Room has '+roomControllers.length+' Spawns available');
                var closestController = chooseClosest(roomControllers,creep);
                if(creep.upgradeController(closestController) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestController);
                    // creep.say("goUpgrade");
                }
                if ( _.sum(creep.carry) == 0 ) { creep.memory.state = 'Harvest';creep.say('More!');}
                break;
            }
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
                if ((r > chosen.energy) && diff > 50) {
                    chosen = targets[t];
                    // console.log("Choosing: "+chosen+" over " +targets[t]);
                } else if ( r == chosen.energy) {
                    chosen = chooseClosest(targets,creep);
                    // console.log("Choosing: "+chosen+" over " +targets[t]+" (EQUAL)");
                } else {
                    chosen = chooseClosest(targets,creep);
                    // console.log("Choosing: "+chosen+" over " +targets[t]+" (Closest)");
                }
            }
            // console.log(chosen+" Has The Most Energy: "+chosen.energy);
            return chosen;
        }
    }
    
};