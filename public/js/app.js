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

