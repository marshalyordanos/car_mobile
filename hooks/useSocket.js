import { useEffect } from "react";
import SocketService from "../socket";

export const useSocket = (
  userId,
  { onNewMessage, onChatListUpdate, onGlobalAlert } = {}
) => {
  useEffect(() => {
    if (!userId) return;

    SocketService.connect(userId);

    if (onNewMessage) SocketService.onNewMessage(onNewMessage);
    if (onChatListUpdate) SocketService.onChatListUpdate(onChatListUpdate);
    if (onGlobalAlert) SocketService.onGlobalAlert(onGlobalAlert);

    return () => {
      SocketService.disconnect();
    };
  }, [userId]);
};
