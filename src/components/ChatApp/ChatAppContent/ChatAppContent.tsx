'use client';

import { JumboScrollbar } from '@jumbo/components';
import { idGenerator } from '@jumbo/utilities/systemHelpers';
import React from 'react';
import { conversations, users } from '../data';
import { ActiveConversationFooter } from './ActiveConversationFooter';
import { ActiveConversationHeader } from './ActiveConversationHeader';
import { ContentPlaceholder } from './ContentPlaceholder';
import { ConversationChatGroupByDate } from './ConversationChatGroupByDate';

const ChatAppContent = ({ category }: any) => {
  /** todo: change type activeConversation */
  let activeConversation: any = {};
  if (category[0] === 'contact') {
    const conversationIndex = conversations.findIndex((conversation) => {
      return (
        (conversation.first_user_id === parseInt(category[1]) &&
          conversation.second_user_id === 1) ||
        (conversation.second_user_id === parseInt(category[1]) &&
          conversation.first_user_id === 1)
      );
    });
    let conversation;
    if (conversationIndex === -1) {
      conversation = {
        id: idGenerator(),
        first_user_id: parseInt(category[1]),
        second_user_id: 1,
        contact: users.find((item) => item.id === parseInt(category[1])),
        messages: [],
      };
      conversations.push(conversation);
    } else {
      activeConversation = conversations[conversationIndex];
    }
    activeConversation.last_message =
      activeConversation?.messages?.length > 0
        ? activeConversation?.messages[activeConversation?.messages.length - 1]
        : undefined;
  } else {
    const conversationIndex = conversations.findIndex(
      (conversation) => conversation.id === parseInt(category[1])
    );
    activeConversation = conversations[conversationIndex];
  }
  if (!category[1]) {
    return <ContentPlaceholder />;
  } else {
    return (
      <React.Fragment>
        <ActiveConversationHeader activeConversation={activeConversation} />
        <JumboScrollbar
          autoHide
          autoHideDuration={200}
          autoHideTimeout={500}
          autoHeightMin={30}
          style={{ minHeight: 200 }}
        >
          <ConversationChatGroupByDate
            activeConversation={activeConversation}
          />
        </JumboScrollbar>
        <ActiveConversationFooter />
      </React.Fragment>
    );
  }
};

export default ChatAppContent;
