module.exports.loop = function () {
    var _ = require('lodash');
    //declare role definitions
    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var spBasic = require('spawnBasic.sp');
    
    //Collect Roled Creeps
    var harvesters = _.filter( Game.creeps, { memory: {role: 'harvester'} } );
    
    //creepyLoop 
    for(var c in Game.creeps) {
        var cr = Game.creeps[c];
        if(cr.memory.role == 'harvester') {
            roleHarvester.run(cr);
        } else if(cr.memory.role == 'upgrader') {
            roleUpgrader.run(cr);
        }
    }
    
    //spawn loop
    // Every Spawn In the Game(mine)
    for(var s in Game.spawns) {
        spBasic.run(Game.spawns[s]);
    }
    
}