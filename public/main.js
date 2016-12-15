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
};

$(window).on('load',function () {


    ajaxInfo();

});
$(document).ready(function () {
    $('#sendFileButton').on('click', function (e) {
        e.preventDefault();
        var data = new FormData();
        $.each($('#fileField')[0].files, function(i, file) {
            data.append('file-'+i, file);
        });
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
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                url: 'http://127.0.0.1:8000/upload',
                success: function(data) {
                    alert('ulr: upload');
                }
            }));

    });
});
