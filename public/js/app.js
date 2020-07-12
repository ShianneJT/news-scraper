$('.card').hover(
    function () {
        $(this).addClass('shadow-lg').css('cursor', 'pointer');
    }, function () {
        $(this).removeClass('shadow-lg');
    }
);

// Save an article
$('.save-article-btn').click(function() {
    let thisId = $(this).attr('data-id');

    $.ajax({
        method: 'POST',
        url: '/saved/' + thisId
    }).    
    then(function(data) {
        window.location = '/';
    });
});

// Delete an article
$('.delete-article-btn').click(function() {
    let thisId = $(this).attr('data-id');

    $.ajax({
        method: 'POST',
        url: '/deleted/' + thisId
    }).
    then(function(data) {
        window.location = '/saved';
    });
});

// 

$('.save-note').on('click', function () {
    var thisId = $(this).attr('data-id');
    $.ajax({
        method: 'POST',
        url: '/articles/' + thisId,
        data: {
            body: $('#noteText' + thisId).val()
            //   body: $("#noteText").val()
        }
    }).then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $('#noteText' + thisId).val('');
        $('.modalNote').modal('hide');
        window.location = '/saved';
    });
});


// View comments
$('.commentsBtn').click(function () {
    let id = $(this).attr('id');

    $.ajax({
        method: 'GET',
        url: '/articles/' + id
    }).then(function (data) {
        $('#article-headline').text(data.headline);
        $('#submit-comment-div').append("<button type='button' id='submitComment' class='btn' data-id='" + data._id + "'>Submit Comment</button>")
    });
});

// Add comment
$('.submitComment').click(function () {
    let id = $(this).attr('data-id');

    $.ajax({
        method: 'POST',
        url: '/articles/' + id,
        data: {
            body: $('#commentText').val()
        }
    }).then(function (data) {
        console.log(data);
    });
});
