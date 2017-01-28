module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Buried ' + name + '. They were dead.');
            // Game.notify('Buried ' + name + '. They were dead.',5);
        }
    }
    for(var r in Game.rooms ) {
        var roomTowers = Game.rooms[r].find(FIND_MY_STRUCTURES, { filter: (structure) => { return ( structure.structureType == STRUCTURE_TOWER )} } );
        for (var t in roomTowers) {
            var closestHostile = roomTowers[t].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                roomTowers[t].attack(closestHostile);
            }
        }
    }
    var _ = require('lodash');
    //declare role definitions
    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var baseBuilder = require('role.baseBuilder');
    var spBasic = require('spawnBasic.sp');
    var funkz = require('functions.inc');

    //Collect Roled Creeps
    var harvesters = _.filter( Game.creeps, { memory: {role: 'harvester'} } );
    
    //creepLoop 
    for(var c in Game.creeps) {
        var cr = Game.creeps[c];
        if(cr.memory.role == 'harvester') {
            roleHarvester.run(cr);
            // funkz.report(Game.creeps[c]);
        } else if(cr.memory.role == 'upgrader') {
            roleUpgrader.run(cr);
        } else if(cr.memory.role == 'baseBuilder') {
            baseBuilder.run(cr);
        }
    }
    
    //spawn loop
    // Every Spawn In the Game(mine)
    for(var s in Game.spawns) {
        spBasic.run(Game.spawns[s]);
    }
    
}