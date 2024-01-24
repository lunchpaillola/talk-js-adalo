import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import ConversationUI from "./ConversationUI";
import sha256 from "crypto-js/sha256";
import editorImage from "./EditorImage.png";

const TalkJs = (props) => {
  const {
    editor,
    talkJsApplicationID,
    userId,
    name,
    email,
    photo,
    participantList,
    role,
    _height,
    loadingColor,
    inboxHeaderColor,
    inboxFontColor,
    chatView
  } = props;

  const ID = talkJsApplicationID;
  const [me, setMe] = useState(null);
  useEffect(() => {
    if (userId && name) {
      setMe({
        id: userId,
        name: name,
        email: email,
        photoUrl: photo?.uri,
        role: role,
      });
    }
  }, [userId, name, email, role]);

  const createUniqueConversationId = (participantList) => {
    const userIds = Array.from(
      new Set(
        participantList.map(
          (participant) => participant?.participantDetails?.pUserId
        )
      )
    ).sort((a, b) => a - b);

    const uniqueSortedIds = Array.from(new Set(userIds)).sort();
    const concatenatedIds = uniqueSortedIds.join("-");
    const hash = sha256(concatenatedIds);

    return hash.toString();
  };

  let conversationId;
  if (participantList) {
    conversationId = createUniqueConversationId(participantList);
  }

  const addParticipantsToConversation = (
    TalkLibrary,
    conversation,
    participantList,
    isNative
  ) => {
    if (participantList && participantList.length > 0) {
      participantList.forEach((participantDetails) => {
        let participant;
        const participantObject = {
          id: participantDetails?.participantDetails?.pUserId,
          name: participantDetails?.participantDetails?.pName,
          email: participantDetails?.participantDetails?.pEmail,
          photoUrl: participantDetails?.participantDetails?.pPhoto?.uri,
          role: participantDetails?.participantDetails?.pRole,
        };
        if (isNative) {
          participant = participantObject;
        } else {
          participant = new TalkLibrary.User(participantObject);
        }
        conversation.setParticipant(participant);
      });
    }
  };

  return (
    editor ? (
      <Image
        source={editorImage}
        style={{
          flex: 1,
          height: _height,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
        }}
      />
    ) : (!talkJsApplicationID || !userId || !name || !me || (chatView && participantList?.length === 0))  ? (
      <View style={{ ...styles.wrapper, height: _height }}>
        <ActivityIndicator size="large" color={loadingColor || "#242526"} />
      </View>
    ) : (
    <ConversationUI
      conversationId={conversationId}
      me={me}
      participantList={participantList}
      ID={talkJsApplicationID}
      addParticipantsToConversation={addParticipantsToConversation}
      _height={_height}
      inboxHeaderColor={inboxHeaderColor}
      inboxFontColor={inboxFontColor}
      loadingColor={loadingColor}
      chatView={chatView}
    />
    )
  );
};

export default TalkJs;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
