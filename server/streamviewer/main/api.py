# Django imports
from django.utils.translation import ugettext_lazy as _

from rest_framework import viewsets
from rest_framework import filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from .models import YoutubeLiveStream, ChatMessage
from .serializers import ChatMessageSerializer


class YoutubeLiveStreamAPIView(APIView):
    """
    Gets the top livestreams from youtube

    Parameters (Get):
        1. query (Optional) - You can search by any query string. E.g. games would return live streaming related to
        gaming.

    Response Output (Get):
    [{
        "id": "<Youtube video id>",
        "publishedAt": "2019-01-04T10:32:43.000Z",
        "channelId": "<Youtube channel id>",
        "title": "Live Pubg",
        "description": "description...",
        "thumbnails": {
            "default": {
                "url": "https://i.ytimg.com/vi/_VS9MiDJE-4/default_live.jpg",
                "width": 120,
                "height": 90
            },
            "medium": {
                "url": "https://i.ytimg.com/vi/_VS9MiDJE-4/mqdefault_live.jpg",
                "width": 320,
                "height": 180
            },
            "high": {
                "url": "https://i.ytimg.com/vi/_VS9MiDJE-4/hqdefault_live.jpg",
                "width": 480,
                "height": 360
            }
        },
        "channelTitle": "Pubg",
        "liveBroadcastContent": "live"
    }]
    """

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, **kwargs):
        """
        Return a list of top youtube live stream
        """
        search_query = request.GET.get('query')
        return Response(YoutubeLiveStream.get_live_streams(query=search_query))


class LiveStreamStatAPIView(APIView):
    """
    Stats and analysis api for live streaming. Returns the stats including sender and total number of messages sent
    for given stream.

    Parameters (Get):
        1. streamId (Required) - Unique identification of stream (youtube video id)
        2. orderBy  (Optional) - Result would be order by given field (allows 'sender__username' and 'total'). In order
            to order in descending, pass with '-' prefix. E.g. -total would return the records in a order where
            first record would be with highest number of chat messages sent and so on. Default is by total in descending
            order.

    Response Output (Get):
        [{
            "sender__username": "xyz",
            "total": 17
        },
        {
            "sender__username": "abc",
            "total": 2
        }]

    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, **kwargs):
        """
        Returns the stats for the given streaming video
        """
        stream_id = request.GET.get('streamId')
        order_by = request.GET.get('orderBy', '-total')

        if not stream_id:
            return Response({"message": _("Please specify the stream id")}, status=status.HTTP_400_BAD_REQUEST)

        stats = ChatMessage.objects.get_stats_for_stream(stream_id, order_by=order_by)
        return Response(stats)


class LiveStreamChatHistoryAPIView(viewsets.ReadOnlyModelViewSet):
    """
    Gets all the chat messages for give stream

    Parameters (Get):
        1. sender  (Optional) - Search chat messages sent by given sender
        2. orderBy  (Optional) - Result would be order by given field (allows 'sender', 'created_at', etc).
        In order to sort in descending, pass with '-' prefix.

    Response Output (Get):
    [{
        "id": "023e5ccb-a3c4-4223-8b90-18f21a813830",
        "sender": "nikhil",
        "live_stream_author_id": null,
        "live_stream_id": "jnEjSsMOWkQ",
        "message": "fef",
        "created_at": "2019-01-06T08:49:28.912586Z"
    }]

    """
    permission_classes = (permissions.IsAuthenticated,)
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        stream_id = self.request.GET.get('streamId')
        order_by = self.request.GET.get('orderBy', '-created_at')
        sender_username = self.request.GET.get('sender', None)

        if order_by and order_by == "sender":
            order_by = "sender__username"

        return ChatMessage.objects.get_messages_for_stream(stream_id, sender_username=sender_username,
                                                           order_by=order_by)
