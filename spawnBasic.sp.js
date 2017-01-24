// Spawn Basic dot sp (spawn)
module.exports = {
    run(StructureSpawn) {
        //mins and maxes
        //should make this something
        let minHarvesters = 5;
        let minUpgraders = 2;
        let minBaseBuilders = 2;
        let maxHarvesters = 10;
        let maxUpgraders = 4;
        let maxBaseBuilders = 4;
        if (!StructureSpawn.memory.lastAnnouce) { StructureSpawn.memory.lastAnnouce = Game.time; }
        
        if ( Game.time > ( StructureSpawn.memory.lastAnnouce + 10 ) ) {
            console.log("~~~~~\n");
            StructureSpawn.memory.lastAnnouce = Game.time;
            console.log(StructureSpawn.name +": Spawn Report");
            console.log(StructureSpawn.name +": Energy/Max - "+StructureSpawn.energy+'/'+StructureSpawn.energyCapacity);
            console.log("Total Available Energy (Extensions): " + StructureSpawn.room.energyAvailable);
            console.log(StructureSpawn.name +": Full");
            let dedCreepz = "CreepName -> TicksToLive\n";
            let cnt = 1;
            for(var creepz in Game.creeps) {
                if ( Game.creeps[creepz].spawning ) { continue;}
                dedCreepz += creepz +" -> " +Game.creeps[creepz].ticksToLive + "\t";
                if ( !(cnt % 6) ) { dedCreepz += "\n"; }
                cnt++;
            }
            console.log(dedCreepz);
            var harvestersThisRoom = Game.rooms[StructureSpawn.room.name].find(FIND_MY_CREEPS,{filter: { memory :{ role: 'harvester'} }}).length;
            var upgradersThisRoom = Game.rooms[StructureSpawn.room.name].find(FIND_MY_CREEPS,{filter: { memory :{ role: 'upgrader'} }}).length;
            var baseBuildersThisRoom = Game.rooms[StructureSpawn.room.name].find(FIND_MY_CREEPS,{filter: { memory :{ role: 'baseBuilder'} }}).length;
            console.log("Structure Room: " + StructureSpawn.room.name );
            console.log("Harvesters in this room: "+ harvestersThisRoom);
            console.log("Upgraders in this room: "+ upgradersThisRoom);
            console.log("Builders in this room: "+ baseBuildersThisRoom);
            if ( StructureSpawn.canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK && (StructureSpawn.spawning == null && harvestersThisRoom < maxHarvesters && 
                    upgradersThisRoom > minUpgraders && baseBuildersThisRoom > minBaseBuilders) || StructureSpawn.canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK && harvestersThisRoom < minHarvesters ) {
                console.log(StructureSpawn.name +": Creating Harvester Role Creep ("+harvestersThisRoom+ " Exist)");
                StructureSpawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE],null,{role:'harvester'});
            } else if ( StructureSpawn.canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK && StructureSpawn.spawning == null && upgradersThisRoom < maxUpgraders &&
                    baseBuildersThisRoom > minBaseBuilders ) {
                console.log(StructureSpawn.name +": Creating Upgrader Role Creep");
                StructureSpawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE],null,{role:'upgrader'});
            } else if ( StructureSpawn.canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK && StructureSpawn.spawning == null && baseBuildersThisRoom < maxBaseBuilders ) {
                console.log(StructureSpawn.name +": Creating baseBuilder Role Creep");
                StructureSpawn.createCreep([WORK,CARRY,CARRY,MOVE,MOVE],null,{role:'baseBuilder'});
            } else {
                console.log("Total Available Energy: " + StructureSpawn.room.energyAvailable);
                console.log("Currently Spawning: "+ StructureSpawn.spawning );
                console.log(StructureSpawn.name + ": Not making a damn thing..");
            }
            console.log("~~~~~");
        }
        
    }
};