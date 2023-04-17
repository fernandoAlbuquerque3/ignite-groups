import { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Header } from "@components/Header"
import { Highlight } from "@components/Highlight"
import { GroupCard } from "@components/GroupCard"
import { ListEmpty } from "@components/ListEmpty"
import { Button } from "@components/Button"

import { Container } from "./styles"
import { groupsGetAll } from "@storage/group/groupGetAll"


export function Groups() {
  const [groups, setGroups] = useState<string[]>([])

  const navigation = useNavigation()

  function handleNewGroup() {
    navigation.navigate('new')
  }

  async function fetchGroups() {
    try {
      const data = await groupsGetAll()
      setGroups(data)
    }catch (error) {
      console.log(error)
    }
  }

useEffect(() => {
 
}, [])

  return (
    <Container>
      <Header />

      <Highlight title="Turmas" subtitle="jogue com a sua turma" />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <GroupCard title={item} />}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={() => (
          <ListEmpty message="Não existe nenhuma turma cadastra." />
        )}
        showsVerticalScrollIndicator={false}
      />
      <Button title="Criar nova turma" onPress={handleNewGroup} />
    </Container>
  )
}
