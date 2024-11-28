<content>
<script lang="ts">
  import { ListView, ObservableArray } from '@nativescript/core';
  
  export let conversationId: string;
  
  let messages = new ObservableArray([
    {
      id: '1',
      text: "Hi! I just checked in but I can't find the WiFi password. Could you help?",
      isUser: false,
      timestamp: new Date('2024-03-10T14:30:00'),
      sender: 'John Smith'
    },
    {
      id: '2',
      text: "Of course! The WiFi password is 'sunset2024'. Let me know if you need anything else!",
      isUser: true,
      timestamp: new Date('2024-03-10T14:31:00'),
      sender: 'Host'
    }
  ]);

  let newMessage = '';

  function sendMessage() {
    if (!newMessage.trim()) return;
    
    messages.push({
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
      sender: 'Host'
    });
    
    newMessage = '';
  }
</script>

<page>
  <actionBar title="Chat">
    <navigationButton text="Back" on:tap="{goBack}" />
  </actionBar>
  
  <gridLayout rows="*, auto">
    <listView row="0" items="{messages}">
      <Template let:item>
        <gridLayout>
          <stackLayout class="message-bubble {item.isUser ? 'sent' : 'received'}" >
            <label text="{item.text}" textWrap="true" />
            <label text="{item.timestamp.toLocaleTimeString()}" class="time" />
          </stackLayout>
        </gridLayout>
      </Template>
    </listView>
    
    <gridLayout row="1" columns="*, auto" class="input-bar">
      <textField col="0" bind:text="{newMessage}" hint="Type a message..." />
      <button col="1" text="Send" on:tap="{sendMessage}" class="btn btn-primary" />
    </gridLayout>
  </gridLayout>
</page>

<style>
  .message-bubble {
    margin: 5 10;
    padding: 10;
    border-radius: 10;
    max-width: 80%;
  }
  .sent {
    background-color: #007AFF;
    color: white;
    align-self: flex-end;
  }
  .received {
    background-color: #e5e5e5;
    align-self: flex-start;
  }
  .time {
    font-size: 12;
    opacity: 0.7;
  }
  .input-bar {
    padding: 10;
    background-color: #f5f5f5;
  }
</style>
</content>