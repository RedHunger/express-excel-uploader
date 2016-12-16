function ajaxInfo() {
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: 'http://127.0.0.1:8000/info',
        success: function(response) {
            $('.list').html('');
            var storage = response.files;
            for (val in storage) {
                $('.list').append('<li>'+'Name: '+storage[val].name + '<br>' + ' Size: '  + storage[val].size + ' kb</li>');
            }
        }
    });
};

$(window).on('load',function () {
    ajaxInfo();

});
$(document).ready(function () {
    $('#sendFileButton').on('click', function (e) {
        var data = new FormData();
        $.each($('#fileField')[0].files, function(i, file) {
            data.append('file[]', file);
        });
        $.ajax({
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            url: 'http://127.0.0.1:8000/upload',
            success: function(data) {
                alert('File uploaded');
                $('.content_name').text("Name: "+ data[0].originalname);
                $('.content_size').text("Size: "+ data[0].size+ 'kb');
            }
        }).then(ajaxInfo());

    });
});
