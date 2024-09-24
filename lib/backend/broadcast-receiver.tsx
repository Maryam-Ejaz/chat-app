// import { useEffect } from 'react';
// import { supabaseClient } from './client';
// import { Imessage, useMessage } from "@/lib/store/messages"; // Importing message context for state management
// import { toast } from 'sonner';

// interface MessagePayload {
//   id: string; // Required field for message ID
//   userId: string; 
//   content?: string; // Content can be optional for typing indication
//   timestamp?: string; // Timestamp can be optional for typing indication
//   userAvatarUrl: string; // Required field for user avatar URL
//   userDisplayName: string; // Required field for user display name
//   isTyping?: boolean; // Optional field to indicate typing status
// }

// const BroadcastReceiver = () => {
//   const supabase = supabaseClient();
//   const { addMessage, optimisticDeleteMessage } = useMessage((state) => state); 
//   const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
//   console.log('Here');

//   useEffect(() => {
//     const channel = supabase.channel('chatroom');

//     // Function to handle incoming messages
//     const messageReceived = async (payload: any) => {
//       console.log('Received message:', payload);

//       // Validate the payload structure
//       const { id, userId, content, timestamp, userAvatarUrl, userDisplayName, isTyping } = payload;

//       if (isTyping) {
//         // Create a typing indication message
//         const typingMessage: MessagePayload = {
//           id, // Assuming typing messages have an ID as well
//           userId,
//           content: 'is typing...',
//           userAvatarUrl,
//           userDisplayName,
//         };

//         // Check if a typing message already exists for this user
//         const existingTypingMessage = useMessage((state) => state.messages.find(msg => msg.id === userId && msg.users?.display_name === 'is typing...'));

//         if (!existingTypingMessage) {
//           addMessage(typingMessage as unknown as Imessage);
//           setOptimisticIds(userId);
//         }
//       } else {
//         // If not typing, delete the typing indication message
//         optimisticDeleteMessage(id!); // Delete optimistically from state

//         // Delete from the database
//         const { error } = await supabase
//           .from("messages")
//           .delete()
//           .eq("id", id!);

//         if (error) {
//           toast.error(error.message);
//         } else {
//           toast.success("Message deleted successfully");
//         }

//         // Check for a valid message to add
//         if (userId && content && timestamp && userAvatarUrl && userDisplayName) {
//           const message: MessagePayload = {
//             id, // Include the message ID
//             userId,
//             content,
//             timestamp,
//             userAvatarUrl,
//             userDisplayName,
//           };

//           // Add the new message to the state
//           addMessage(message as unknown as Imessage);
//           setOptimisticIds(userId);
//         } else {
//           console.error('Invalid message payload:', payload);
//         }
//       }
//     };

//     // Subscribe to broadcast messages of type 'message'
//     channel
//       .on('broadcast', { event: 'typing' }, (payload: any) => messageReceived(payload))
//       .subscribe();

//     // Clean up the subscription when the component is unmounted
//     return () => {
//       channel.unsubscribe();
//     };
//   }, [addMessage, optimisticDeleteMessage, setOptimisticIds]);

//   return null;
// };

// export default BroadcastReceiver;
