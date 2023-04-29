import { useState, useEffect, useRef } from "react"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Alert, FlatList, TextInput } from "react-native"

import { AppError } from "@utils/AppError"

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles"

import { Header } from "@components/Header"
import { Highlight } from "@components/Highlight"
import { ButtonIcon } from "@components/ButtonIcon"
import { Input } from "@components/Input"
import { Filter } from "@components/Filter"
import { PlayerCard } from "@components/PlayerCard"
import { ListEmpty } from "@components/ListEmpty"
import { Button } from "@components/Button"

import { PlayerAddByGroup } from "@storage/player/playerAddByGroup"
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam"
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO"
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup"
import { groupRemoveByName } from "@storage/group/groupRemoveByName"

type RouteParams = {
  group: string
}

export function Players() {
  const [team, setTeam] = useState("Time A")
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
  const [newPlayerName, setNewPlayerName] = useState('');

  const route = useRoute()
  const navigation = useNavigation()

  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer() {
    if(newPlayerName.trim().length === 0) {
      return Alert.alert('Nova Pessoa', 'informe o nome da pessoa para adicionar ao time. ')
    }
    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await PlayerAddByGroup(newPlayer, group)
      newPlayerNameInputRef.current?.blur()
      setNewPlayerName('')
      fetchPlayersByTeam()
    } catch (error) {
      if(error instanceof AppError) {
        Alert.alert('Nova Pessoa', error.message)
      }else {
        console.log(error)
        Alert.alert('Nova Pessoa','Não foi possivel adicionar ')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      const playersByTeam = await playersGetByGroupAndTeam(group, team)
      setPlayers(playersByTeam)

    } catch (error) {
      console.log(error)
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas filtradas pelo time selecionado')
    }
  }

  async function handleRemoveParticipant(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam()

    } catch (error) {
      console.log(error)
      Alert.alert('Remover Participante', 'Não foi possível remover esse participante.')
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');
    } catch (error) {
      console.log(error);
      Alert.alert('Remover Grupo','Não foi possivel remover o grupo.')
    }
  }

  async function handleGroupRemove() {
    Alert.alert('Remover','Deseja remover o grupo?',
    [
      {text: 'Não', style: 'cancel'},
      {text: 'Sim', onPress: () => groupRemove()}
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam()
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight title={group} subtitle="adicione a galera e separe os times" />
      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>
      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]} //colocar opção de adicionar times/guardando no storage
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PlayerCard
            name={item.name}
            onRemove={() => handleRemoveParticipant(item.name)}
          />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há pessoas nesse time." />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          players.length === 0 && { flex: 1 },
        ]}
      />
      <Button title="Remover turma" type="SECONDARY"
      onPress={handleGroupRemove} />
    </Container>
  )
}