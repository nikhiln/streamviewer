import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import ChatMessage, User


class ChatConsumer(WebsocketConsumer):

    def fetch_messages(self, data):
        live_stream_id = data.get('liveStreamId')
        messages = ChatMessage.objects.last_50_messages(live_stream_id)
        content = {
            'command': 'fetch_messages',
            'type': 'messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_message(content)

    def new_message(self, data):
        author = data.get('username', None)
        text = data.get('message', None)
        live_stream_id = data.get('liveStreamId', None)
        live_stream_author_id = data.get('liveStreamAuthorId', None)
        sender = User.objects.filter(username=author).first()
        if sender:
            message = ChatMessage.objects.create(sender=sender, message=text, live_stream_id=live_stream_id,
                                                 live_stream_author_id=live_stream_author_id)
            content = {
                'command': 'new_message',
                'type': 'new_message',
                'message': self.message_to_json(message)
            }
            self.send_chat_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': str(message.id),
            'sender': message.sender.username,
            'liveStreamAuthorId': message.live_stream_author_id,
            'liveStreamId': message.live_stream_id,
            'message': message.message,
            'created_at': str(message.created_at)
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = 'room'
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # leave group room
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))
