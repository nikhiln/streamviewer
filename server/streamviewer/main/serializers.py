from rest_framework import serializers

from .models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()

    def get_sender(self, obj):
        return obj.sender.username

    class Meta:
        model = ChatMessage
        fields = ('id', 'sender', 'live_stream_author_id', 'live_stream_id', 'message', 'created_at')
