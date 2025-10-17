import React from 'react'
import { useAIChat } from '../contexts/AIChatContext'
import AIChatButton from './AIChatButton'
import AIChatPanel from './AIChatPanel'

const AIChat: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    openChat,
    closeChat,
    sendMessage
  } = useAIChat()

  return (
    <>
      <AIChatButton 
        onClick={openChat}
        hasNewMessage={messages.length > 1 && !isOpen}
      />
      
      <AIChatPanel
        isOpen={isOpen}
        onClose={closeChat}
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </>
  )
}

export default AIChat