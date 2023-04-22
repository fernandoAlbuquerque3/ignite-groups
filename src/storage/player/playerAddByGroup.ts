import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";
import { PLAYER_COLLECTION } from "@storage/storageConfig";

import { PlayerStorageDTO } from "./PlayerStorageDTO";

async function PlayerAddByGroup(newPlayer:PlayerStorageDTO, group: string) {
  try{

    /*
    @ignite-teams:players-rocket : []
    @ignite-teams:players-amigos : [] 
    @ignite-teams:players-ignite : []
    */

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, '');

  }catch(error) {
    throw (error)
  }
}