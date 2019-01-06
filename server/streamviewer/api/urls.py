from __future__ import unicode_literals

from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_auth.views import LogoutView

from streamviewer.users.api import GoogleLoginAPIView
from streamviewer.main.api import YoutubeLiveStreamAPIView, LiveStreamStatAPIView, LiveStreamChatHistoryAPIView

app_name = "api"

router = DefaultRouter()
router.register(r'youtube/stream-chat', LiveStreamChatHistoryAPIView)

urlpatterns = [
    path('youtube/stats/', view=LiveStreamStatAPIView.as_view(), name="youtube-live-streams-stats"),
    path('youtube/livestream/', view=YoutubeLiveStreamAPIView.as_view(), name="youtube-live-streams"),
    path('rest-auth/google/', view=GoogleLoginAPIView.as_view(), name='google_login'),
    path('rest-auth/logout/', LogoutView.as_view(), name='rest_logout'),
]

urlpatterns += router.urls
