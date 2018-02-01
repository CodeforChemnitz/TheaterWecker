"""theaterwecker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from django.template.response import TemplateResponse
from django.views import View
from django.views.generic import RedirectView


class OneSignalSDKView(View):

    def get(self, request, *args, **kwargs):
        return TemplateResponse(
            request=request,
            template='js/{}'.format(kwargs['path'].split('?')[0]),
            content_type="application/javascript"
        )



urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('api.urls', namespace="api")),
    url(r'^', include('app.urls', namespace="app")),
    url(r'^manifest.json$', RedirectView.as_view(url='/static/manifest.json')),
    url(r'^(?P<path>OneSignalSDK.*)$', OneSignalSDKView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
