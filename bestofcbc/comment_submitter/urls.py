from django.conf.urls.defaults import *

urlpatterns = patterns('bestofcbc.comment_submitter.views',
    (r'^$', 'index'),
    (r'^comment/(?P<comment_id>\d+)', 'get_comment'),
    (r'^submit','submit'),
)
