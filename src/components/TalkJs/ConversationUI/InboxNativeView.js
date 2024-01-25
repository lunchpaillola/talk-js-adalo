import React, {useState} from 'react';
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as TalkRn from "@talkjs/react-native";

const InboxView = ({
  me,
  ID,
  _height,
  loadingColor,
}) => {

  const [conversationBuilder, setConversationBuilder] = useState(null);
  const onSelectConversation = (event) => {
    setConversationBuilder(event.conversation);
  };


  return (
    <>
      <TalkRn.Session appId={ID} me={me}>
        <View style={{ height: _height }}>
        <TalkRn.ConversationList
              onSelectConversation={onSelectConversation}
              loadingComponent={
                <View style={{ ...styles.wrapper, height: _height }}>
                  <ActivityIndicator
                    size="large"
                    color={loadingColor || "#242526"}
                  />
                </View>
              }
            />
        </View>
      </TalkRn.Session>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InboxView;
