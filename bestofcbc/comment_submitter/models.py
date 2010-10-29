from django.db import models
from django.db.models.signals import post_save
import urllib
import urllib2
import twitter


class Author(models.Model):
    name = models.CharField(max_length=200)
    profile = models.URLField()
    
class Comment(models.Model):
    hash = models.CharField(max_length=200)
    story = models.URLField()
    comment = models.TextField()
    date = models.DateTimeField()
    author = models.ForeignKey(Author)    
    
    def get_absolute_url(self):
        return "/bestofcbc/comment/%i/" % self.id

class Tag(models.Model):
    tag = models.CharField(max_length=50)
    comments = models.ManyToManyField(Comment)

def post_to_twitter(sender, **kwargs):
    if kwargs.get('created',True):
        #hard coded host == BAD!!
        c = kwargs.get('instance')
        url = 'http://%s%s' % ("labs.laserdeathstehr.com",c.get_absolute_url())
        tiny_url = get_tiny_url(url)
        if(len(c.comment)+len(" ")+len(tiny_url) < 140):
            tweet = '%s %s' % (c.comment,tiny_url)
        else:
            tweet = '%s... %s' % (c.comment[:110],tiny_url)
        api = twitter.Api('bestofcbc','1qaz@WSX')
        api.PostUpdate(tweet)
    
def get_tiny_url(url):
    API_CREATE_URI = "http://tinyurl.com/api-create.php?url=%s"
    encoded_url = urllib.urlencode({'url':url})[4:]
    new_url = API_CREATE_URI % (encoded_url)
    tinyurl_request = urllib2.Request(new_url)
    tinyurl_handle = urllib2.urlopen(tinyurl_request)
    return tinyurl_handle.read()



post_save.connect(post_to_twitter,sender=Comment)
