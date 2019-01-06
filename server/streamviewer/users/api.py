from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_auth.registration.views import SocialLoginView

from django.conf import settings


class GoogleLoginAPIView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = getattr(settings, 'SOCIAL_LOGIN_GOOGLE_CALLBACK_URL', 'http://localhost:8000')
