import React from "react";
import { MessagesProps } from "../../data";
import { ActiveConversationChat } from "../ActiveConversationChat";
/** todo : change any typescript */
const chatGroupedByDate = (array: any[], key: any) =>
  Object.entries(
    array.reduce((result, { [key]: k, ...rest }) => {
      (result[k] = result[k] || []).push(rest);
      return result;
    }, {})
  ).map(([sent_date, messages]) => ({
    sent_date,
    messages,
  }));
const ConversationChatGroupByDate = ({
  activeConversation,
}: {
  activeConversation?: { messages: MessagesProps[] };
}) => {
  const conversationMessages = React.useMemo(() => {
    if (activeConversation)
      return chatGroupedByDate(activeConversation?.messages, "sent_date");

    return [];
  }, [activeConversation]);
  return (
    <React.Fragment>
      {conversationMessages?.map((messagesGroupByDate, index) => (
        <ActiveConversationChat
          key={index}
          conversation={messagesGroupByDate}
        />
      ))}
    </React.Fragment>
  );
};

export { ConversationChatGroupByDate };
