// The nClaimer (Beta)
// Claims Neutral Sectors across the map in direction indicated
// usage: Game.spawns['Spawn1'].createCreep([CLAIM,MOVE,MOVE],null,{role:'nClaimer',direction:'LEFT'});
module.exports = {
    run(creep) {
        //First we import functions
        var funcz = require('functions.inc');
        
        //Now init any null memories to defaults for this role
        if (!creep.memory.state) { creep.memory.state = 'SeekDirectionExit'; }
        if (!creep.memory.task) { creep.memory.task = 'MoveTo'; }
        let goToRoom = creep.room.name;
        if ( creep.room.find(FIND_MY_STRUCTURES{ filter: (structure) => { return (( structure.structureType == STRUCTURE_SPAWN ))}}) ) {
            goToRoom = creep.room.describeExits(creep.room.name)[creep.memory.direction];
            console.log("Room To The "+creep.memory.direction+" is "+goToRoom);
        } else {
            //Nothing.. claim this place or leave
        }
        ////////////////
        //State Machinery
        switch(creep.memory.state ) {
            case 'SeekDirectionExit': {
                //Do SeekDirectionExit
                if (creep.spawning) { break; }
                    if(Game.rooms[goToRoom].controller) {
                        let result = creep.claimController(Game.rooms[goToRoom].controller);
                        switch(result) {
                            case ERR_NOT_IN_RANGE: {
                                creep.moveTo(Game.rooms[goToRoom].controller);
                                creep.memory.task = 'moveTo';
                                break;
                            } 
                            case ERR_BUSY: {
                                console.log(creep.name+": Claiming Returned BUSY");
                                break;
                            }
                            case OK: { creep.memory.task = 'Claiming';break; }
                            default: {
                                console.log(creep.name+": Claiming Returned "+result);
                                break;
                            }
                        }
                    } else {
                        // We are FULL.
                        creep.memory.state = 'findNextRoom';
                        creep.memory.task = 'moveTo';
                    }
                break;
            }
            case 'findNextRoom': {
                goToRoom = creep.room.describeExits(creep.room.name)[creep.memory.direction];
                console.log("Room To The "+creep.memory.direction+" is "+goToRoom);
                break;
            }
        }
        //
        // End Switch(state)
        
    } // END Run(creep)
    
};