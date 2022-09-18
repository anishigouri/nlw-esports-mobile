import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Background } from "../../components/Background";

import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { IGameParams } from "../../@types/navigation";
import { styles } from "./styles";

import { Entypo } from "@expo/vector-icons";
import { THEME } from "../../theme";

import logoImg from "../../assets/logo-nlw-esports.png";
import { DuoCard, DuoCardProps } from "../../components/DuoCard";
import { Heading } from "../../components/Heading";
import { DuoMatch } from "../../components/DuoMatch";

export function Game() {
  const route = useRoute();
  const navigation = useNavigation();
  const game = route.params as IGameParams;
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState("");

  useEffect(() => {
    fetch(`http://192.168.15.9:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setDiscordDuoSelected(data.discord));
  }, []);

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchDiscordUser(adsId: string) {
    fetch(`http://192.168.15.9:3333/ads/${adsId}/ads`)
      .then((response) => response.json())
      .then((data) => setDuos(data));
  }

  function onConnect() {}

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>
          <Image source={logoImg} style={styles.logo} resizeMode="cover" />
          <View style={styles.right} />
        </View>

        <Image source={{ uri: game.bannerUrl }} style={styles.cover} />
        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />
        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => fetchDiscordUser(item.id)} />
          )}
          horizontal
          contentContainerStyle={
            duos.length > 0 ? styles.contentList : styles.contentEmptyList
          }
          showsHorizontalScrollIndicator={false}
          style={styles.containerList}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda
            </Text>
          )}
        />
        <DuoMatch
          visible={discordDuoSelected.length === 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected("")}
        />
      </SafeAreaView>
    </Background>
  );
}
