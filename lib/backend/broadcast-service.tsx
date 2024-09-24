// broadcastService.ts
import { supabaseClient } from "@/lib/backend/client"

/**
 * Function to broadcast a message to a specific room/channel
 * @param channelName - The name of the channel/room to join
 * @param message - The message you want to send
 * @param event - The event type (optional, defaults to 'message')
 */
export const broadcastMessage = async (channelName: string, message: Record<string, any>, event: string = 'typing') => {
    const supabase = supabaseClient();
  const channel = supabase.channel(channelName)

  // Subscribe and send a message once connected
  await channel.subscribe((status: string) => {
    console.log("sending broadcast");
    if (status === 'SUBSCRIBED') {
      channel.send({
        type: 'broadcast',
        event: event,
        payload: message,
      })
    }
  })
}
