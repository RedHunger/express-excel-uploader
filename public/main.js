$(window).on('load',function () {
    function ajaxInfo() {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: 'http://127.0.0.1:8000/info',
            success: function(response) {
                $('.list').html('');
                var storage = response.files;
                for (val in storage) {
                    $('.list').append('<li>'+'Name: '+storage[val].name + '<br>' + ' TimeStamp: '  + storage[val].time + '</li>');
                }
            }
        });
    }

    ajaxInfo();

});
$(document).ready(function () {
    $('#sendFileButton').on('click', function (e) {
        e.preventDefault();
        var data = {
            fileName : $('#fileField').get(0).files[0].name,
            fileTimeStamp: $('#fileField').get(0).files[0].lastModified,
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://127.0.0.1:8000/add',
            success: function(data) {
                $('.content_name').text("Name: "+ data.fileName);
                $('.content_date').text("TimeStamp: "+ data.fileTimeStamp);
                ajaxInfo();
            },

        }).then(
            $("#uploadForm").submit(),
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: 'http://127.0.0.1:8000/upload',
                success: function(data) {
                    alert('ulr: upload');
                }
            }));

    });
});
