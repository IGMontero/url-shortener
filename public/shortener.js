$('#shortener').on('click',function(){
  var url = $('#url-field').val();
  
  if(!url)
    return;
  
  $.ajax({
    url:'api/shorten',
    type:'POST',
    dataType:'json',
    data:{url:url},
    success: function(data){
      if(data.error){
        $('#error-message').text(data.error);
        $('#response a').text('');
      }else{
        $('#error-message').text('');
        $('#long-url').html("<a id=\"long-url\" href=\""+data.long_url+"\">Long URL: "+data.long_url+"</a>");
        $('#short-url').html("<a id=\"short-url\" href=\""+data.short_url+"\">Short URL: "+data.short_url+"</a>");
      }
    }
  })
  
  
})