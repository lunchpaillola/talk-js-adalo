import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as TalkRn from "@talkjs/react-native";
import Header from "./InboxHeader";

const ChatView = ({
  me,
  ID,
  participantList,
  conversationId,
  addParticipantsToConversation,
  _height,
  inboxHeaderColor,
  inboxFontColor,
  loadingColor,
}) => {
  const [conversationBuilder, setConversationBuilder] = useState(null);
  const [showConversationList, setShowConversationList] = useState(false);

  useEffect(() => {
      const builder = TalkRn.getConversationBuilder(conversationId);
      builder.setParticipant(me);
      addParticipantsToConversation(TalkRn, builder, participantList, true);
      setConversationBuilder(builder);
      
  }, [conversationId, me, participantList]);

  const onSelectConversation = (event) => {
    setConversationBuilder(event.conversation);
  };

  const onBackPress = () => {
    setShowConversationList(true);
  };

  return (
    <>
      <TalkRn.Session appId={ID} me={me}>
        <View style={{ height: _height }}>
          {showConversationList ? (
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
          ) : conversationBuilder ? (
            <>
              <Header
                onBackPress={onBackPress}
                inboxFontColor={inboxFontColor}
                inboxHeaderColor={inboxHeaderColor}
              />
              <TalkRn.Chatbox
                conversationBuilder={conversationBuilder}
                loadingComponent={
                  <View style={{ ...styles.wrapper, height: _height }}>
                    <ActivityIndicator
                      size="large"
                      color={loadingColor || "#242526"}
                    />
                  </View>
                }
              />
            </>
          ) : (
            <View style={{ ...styles.wrapper, height: _height }}>
              <ActivityIndicator
                size="large"
                color={loadingColor || "#242526"}
              />
            </View>
          )}
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

export default ChatView;
