import React from "react";
import ChatView from "./ChatNativeView";
import InboxView from "./InboxNativeView";

const ConversationUI = ({
  me,
  ID,
  participantList,
  conversationId,
  addParticipantsToConversation,
  _height,
  inboxHeaderColor,
  inboxFontColor,
  loadingColor,
  chatView,
}) => {

  // Common props for both ChatView and InboxView
  const commonProps = {
    conversationId,
    me,
    participantList,
    ID,
    addParticipantsToConversation,
    _height,
    inboxHeaderColor,
    inboxFontColor,
    loadingColor,
    chatView,
  };

  return (
    <>
      {chatView ? (
        <ChatView {...commonProps} />
      ) : (
        <InboxView {...commonProps} />
      )}
    </>
  );
};

export default ConversationUI;
