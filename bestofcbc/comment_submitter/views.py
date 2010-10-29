from django.shortcuts import render_to_response, get_object_or_404
from bestofcbc.comment_submitter.models import Comment,Author
from django.core.paginator import Paginator, InvalidPage,EmptyPage
import hashlib
import datetime
from django.http import HttpResponse
from django.utils.html import strip_tags


def index(request):
    latest_comment_list = Comment.objects.all().order_by('-date')
    paginator = Paginator(latest_comment_list,8)
    try:
        page = int(request.GET.get('page','1'))
    except ValueError:
        page = 1

    try:
        comments = paginator.page(page)
    except (EmptyPage,InvalidPage):
        comments = paginator.page(paginator.num_pages)
    return render_to_response('comment_submitter/index.html',{'comments':comments})


def get_comment(request,comment_id):
    comment = get_object_or_404(Comment,pk=comment_id)
    return render_to_response('comment_submitter/single.html',{'comment':comment})

def submit(request):
    sub_comment = request.POST['comment']
    sub_comment = strip_tags(sub_comment)
    author = request.POST['author']
    author = strip_tags(author)
    author_link = request.POST['authorLink']
    url = request.POST['url']
    comment_hash = hashlib.md5(sub_comment).hexdigest()
    try:
        results = Comment.objects.filter(hash = comment_hash)
   
        if results.count() == 0:
            a = Author.objects.filter(name = author)
            if a.count() == 0:
                a = Author(name=author,profile=author_link)
                a.save()
            else:
                a = a[0]
            c = Comment(hash=comment_hash,comment=sub_comment,date=datetime.datetime.now(),story = url,author=a)
            c.save()
    except Error:
        print "ERROR"
    
    return HttpResponse("Comment submitted Successfully.")

