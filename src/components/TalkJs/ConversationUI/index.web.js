import React, { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Talk from "talkjs";
import { Session, Inbox } from "@talkjs/react";

const ConversationUI = ({
  me,
  ID,
  participantList,
  conversationId,
  addParticipantsToConversation,
  _height,
  loadingColor,
  chatView,
}) => {
  const syncUser = useCallback(() => new Talk.User(me), []);

  const syncConversation = useCallback(
    (session) => {
      const conversation = session.getOrCreateConversation(conversationId);
      conversation.setParticipant(session.me);

      addParticipantsToConversation(Talk, conversation, participantList, false);

      return conversation;
    },
    [participantList]
  );

  const inboxProps = {
    style: { width: "100%", height: _height },
    className: "chat-container",
    loadingComponent: (
      <View style={{...styles.wrapper,height: _height}}>
        <ActivityIndicator size="large" color={loadingColor || "#242526"} />
      </View>
    ),
    // Add syncConversation prop only if chatView prop is defined and not empty
    ...(chatView && participantList?.length > 0 && { syncConversation }),
  };

  return (
    <View style={styles.wrapper}>
      <Session appId={ID} syncUser={syncUser}>
        <Inbox {...inboxProps} />
      </Session>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ConversationUI;
