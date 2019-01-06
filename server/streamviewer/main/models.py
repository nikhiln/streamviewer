import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

from streamviewer.common.integrations import YoutubeAPI

User = get_user_model()


class ChatMessageManager(models.Manager):
    def last_50_messages(self, stream_id=None):
        messages = ChatMessage.objects.order_by('-created_at').all()
        if stream_id:
            messages = messages.filter(live_stream_id=stream_id)
        return messages[:50]

    def get_stats_for_stream(self, stream_id, order_by=None):
        return ChatMessage.objects.filter(live_stream_id=stream_id).values('sender__username').annotate(
            total=models.Count('id')).order_by(order_by)

    def get_messages_for_stream(self, stream_id, sender_username=None, order_by=None):
        messages = ChatMessage.objects.filter(live_stream_id=stream_id)
        if sender_username:
            messages = messages.filter(sender__username=sender_username)
        if order_by:
            messages = messages.order_by(order_by)
        return messages


class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, blank=False, null=False, related_name='author_messages',
                               on_delete=models.CASCADE)

    live_stream_author_id = models.CharField("Live stream author unique identifier", null=True, blank=True,
                                             max_length=1024)

    live_stream_id = models.CharField("Live stream unique identifier", null=False, blank=False, max_length=1024)

    message = models.TextField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    objects = ChatMessageManager()

    def __str__(self):
        return str(self.sender) + " - " + self.message


class YoutubeLiveStream(object):
    """
    Creating dummy model - to keep consistence
    """

    @classmethod
    def get_live_streams(cls, query):
        youtube_api = YoutubeAPI(settings.GOOGLE_DEVELOPER_KEY)
        return youtube_api.search_live_streams(query)
